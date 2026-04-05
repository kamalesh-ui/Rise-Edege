import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { HfInference } from '@huggingface/inference';

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.HF_TOKEN) {
  console.error('❌ HF_TOKEN missing in .env');
  process.exit(1);
}

const hf = new HfInference(process.env.HF_TOKEN);

const MODELS = [
  'mistralai/Mixtral-8x7B-Instruct-v0.1',
  'google/gemma-2-2b-it',
  'Qwen/Qwen2.5-72B-Instruct',
];

// ✅ Allow ALL origins — fixes all port issues (5173, 5174, 5175, etc.)
app.use(cors());
app.use(express.json({ limit: '10kb' }));

function buildSystemPrompt(context) {
  let prompt = `You are Rise Edge AI Career Assistant.
Help with:
- Career suggestions
- Skills & roadmap
- Salary insights
- AI impact on jobs
Give structured, clear, practical answers using markdown formatting.`;

  if (context?.skills || context?.interests) {
    prompt += `\n\nUser Profile:
Skills: ${context.skills || 'N/A'}
Interests: ${context.interests || 'N/A'}`;
    if (context.experience) prompt += `\nExperience: ${context.experience}`;
  }
  return prompt;
}

async function callHF(messages) {
  let lastError;
  for (const model of MODELS) {
    try {
      console.log('🤖 Trying:', model);
      const res = await hf.chatCompletion({
        model,
        messages,
        max_tokens: 600,
        temperature: 0.7,
      });
      const text = res.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error('Empty response');
      console.log('✅ Success:', model);
      return text;
    } catch (err) {
      console.warn(`⚠️  Failed: ${model} → ${err.message}`);
      lastError = err;
      if (err.message?.includes('401')) throw new Error('Invalid HF_TOKEN');
    }
  }
  throw lastError;
}

// ✅ Returns plain JSON — matches ChatPage.tsx fetch
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

    const messages = [
      { role: 'system', content: buildSystemPrompt(context) },
      ...history.slice(-6).filter(m => m.role && m.content),
      { role: 'user', content: message.trim() },
    ];

    const aiText = await callHF(messages);
    return res.json({ response: aiText });

  } catch (err) {
    console.error('❌ Error:', err.message);
    let msg = '⚠️ Something went wrong. Please try again.';
    if (err.message?.includes('401') || err.message?.includes('Invalid HF_TOKEN')) msg = '🔑 Invalid API token.';
    else if (err.message?.includes('429')) msg = '⏳ Rate limited. Wait 30 seconds.';
    else if (err.message?.includes('503')) msg = '🔄 Model warming up. Try again in 20 seconds.';
    return res.status(500).json({ error: msg });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Rise Edge AI Backend',
    hfToken: process.env.HF_TOKEN ? '✅ Set' : '❌ Missing',
    models: MODELS,
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Backend → http://localhost:${PORT}`);
  console.log(`🤖 HF Token: ${process.env.HF_TOKEN ? '✅ loaded' : '❌ MISSING'}\n`);
});