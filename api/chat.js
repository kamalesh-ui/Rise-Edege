import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN);

const MODELS = [
  'HuggingFaceH4/zephyr-7b-beta',
  'mistralai/Mistral-7B-Instruct-v0.3',
  'Qwen/Qwen2.5-72B-Instruct',
];

function buildSystemPrompt(context) {
  let prompt = `You are Rise Edge AI Career Assistant. Help with career advice, skills, roadmaps, salary insights. Use markdown formatting.`;
  if (context?.skills)     prompt += `\nUser skills: ${context.skills}`;
  if (context?.interests)  prompt += `\nUser interests: ${context.interests}`;
  if (context?.experience) prompt += `\nUser experience: ${context.experience}`;
  return prompt;
}

async function callHF(messages) {
  let lastError;
  for (const model of MODELS) {
    try {
      const res = await hf.chatCompletion({ model, messages, max_tokens: 600, temperature: 0.7 });
      const text = res.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (err) {
      lastError = err;
      if (err.message?.includes('401')) throw new Error('Invalid HF_TOKEN');
    }
  }
  throw lastError;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, context, history = [] } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message required' });

    const messages = [
      { role: 'system', content: buildSystemPrompt(context) },
      ...history.slice(-6).filter(m => m.role && m.content),
      { role: 'user', content: message.trim() },
    ];

    const text = await callHF(messages);
    return res.json({ response: text });

  } catch (err) {
    console.error('Chat error:', err.message);
    let msg = '⚠️ Something went wrong. Please try again.';
    if (err.message?.includes('401')) msg = '🔑 Invalid API token.';
    else if (err.message?.includes('429')) msg = '⏳ Rate limited. Wait 30 seconds.';
    else if (err.message?.includes('503')) msg = '🔄 Model warming up. Try again in 20 seconds.';
    return res.status(500).json({ error: msg });
  }
}