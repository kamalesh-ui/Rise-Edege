import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Trash2, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../lib/session';
import MarkdownRenderer from '../components/MarkdownRenderer';
import type { ChatMessage } from '../lib/types';

const QUICK_PROMPTS = [
  '🎯 What career suits me?',
  '📊 Compare Data Science vs Web Dev',
  '🤖 Will AI replace marketing?',
  '📚 How to become a data scientist?',
  '💰 What do engineers earn?',
  '🚀 Best careers for 2030',
];

// ─── Detect backend URL ────────────────────────────────────────────────────────
// Falls back to localhost:3001 if VITE_API_URL is not set
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendOk, setBackendOk] = useState<boolean | null>(null); // null = unchecked
  const chatEndRef = useRef<HTMLDivElement>(null);
  const profile = getUserProfile();

  // ── Scroll to bottom on new messages ──────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Health-check backend on mount ─────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => setBackendOk(true))
      .catch(() => setBackendOk(false));
  }, []);

  // ── Welcome message ────────────────────────────────────────────────────────
  useEffect(() => {
    const welcome: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: `👋 **Welcome to Rise Edge AI Assistant!**\n\nI'm here to help you navigate your career journey. I can:\n\n🎯 Suggest careers based on your skills\n📊 Compare different career paths\n🤖 Analyse AI impact on jobs\n📚 Create personalised learning roadmaps\n💰 Share salary insights\n\n${
        profile
          ? `I see you're interested in **${profile.interests}** with skills in **${profile.skills}**. Let me give you personalised advice!`
          : 'Tell me about your skills and interests, or try one of the quick prompts below!'
      }`,
      timestamp: new Date(),
    };
    setMessages([welcome]);
  }, []);

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          context: profile,
          // Skip welcome message (index 0) from history
          history: messages.slice(1).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Use the friendly error from backend if available
        throw new Error(data.error || `Server error ${res.status}`);
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not process that. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);

    } catch (err: any) {
      console.error('Chat error:', err);

      const isNetworkError =
        err instanceof TypeError && err.message === 'Failed to fetch';

      const friendlyError = isNetworkError
        ? '🔌 Cannot reach the backend server. Make sure it\'s running:\n```\nnode api/chat.js\n```'
        : err.message || '⚠️ Something went wrong. Please try again.';

      setError(friendlyError);

      // Also show error as a chat bubble
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: friendlyError,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errMsg]);

    } finally {
      setLoading(false);
    }
  };

  // ── Retry last user message ────────────────────────────────────────────────
  const retryLast = () => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (lastUser) {
      setMessages(prev => prev.slice(0, -1)); // remove last error bubble
      sendMessage(lastUser.content);
    }
  };

  // ── Clear chat ─────────────────────────────────────────────────────────────
  const clearChat = () => {
    setMessages(prev => [prev[0]]); // keep welcome
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-16 flex flex-col">

      {/* ── Header ── */}
      <div className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-16 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#0a0a0f]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Career AI Assistant</h2>
                <p className={`text-xs ${
                  backendOk === null ? 'text-gray-500' :
                  backendOk ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {backendOk === null ? 'Connecting…' : backendOk ? 'Online' : 'Backend offline'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-all"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Backend offline banner ── */}
      <AnimatePresence>
        {backendOk === false && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="max-w-3xl mx-auto w-full px-4 pt-3"
          >
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Backend server is not running</p>
                <p className="text-red-400 text-xs mt-0.5">
                  Start it with: <code className="bg-white/10 px-1 rounded">node api/chat.js</code>
                  &nbsp;— then make sure <code className="bg-white/10 px-1 rounded">VITE_API_URL</code> in
                  your <code className="bg-white/10 px-1 rounded">.env</code> points to it.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/10 border border-cyan-500/20'
                    : 'bg-emerald-500/10 border border-emerald-500/20'
                }`}>
                  {msg.role === 'user'
                    ? <User className="w-4 h-4 text-cyan-400" />
                    : <Bot className="w-4 h-4 text-emerald-400" />
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/10 border border-cyan-500/20 rounded-tr-md'
                    : 'bg-white/[0.03] border border-white/[0.06] rounded-tl-md'
                }`}>
                  <MarkdownRenderer content={msg.content} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading dots */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-md bg-white/[0.03] border border-white/[0.06]">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-gray-600 ml-2">Thinking…</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Retry button after error */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <button
                onClick={retryLast}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-gray-400 hover:text-emerald-400 hover:border-emerald-500/20 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry last message
              </button>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* ── Quick prompts (only before first real message) ── */}
      {messages.length <= 1 && (
        <div className="max-w-3xl mx-auto w-full px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                disabled={loading}
                className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-400 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="border-t border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form
            onSubmit={e => { e.preventDefault(); sendMessage(input); }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={backendOk === false ? 'Start backend server first…' : 'Ask me anything about careers…'}
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#0a0a0f] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <p className="text-center text-xs text-gray-700 mt-2">
            Rise Edge AI provides guidance based on career data. Always verify with professionals.
          </p>
        </div>
      </div>
    </div>
  );
}