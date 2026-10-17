import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  Layers,
  Code2,
  Copy,
  Check,
  Rocket,
  ShieldCheck,
  Terminal,
  Database,
  Github,
  Globe,
  Zap,
  BookOpen,
  User,
  ArrowRight,
  ExternalLink,
  Laptop,
  CheckCircle2
} from 'lucide-react';
import { playQrScanSound } from '../../services/audioNotifier';

interface DeveloperRoadmapViewProps {
  onLoadAiAssistantProject?: () => void;
  onGoToGitHubPush?: () => void;
}

export const DeveloperRoadmapView: React.FC<DeveloperRoadmapViewProps> = ({
  onLoadAiAssistantProject,
  onGoToGitHubPush,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  const handleCopyCode = (key: string, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedKey(key);
    playQrScanSound();
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const codeSnippets = {
    step2Install: `# ১. আধুনিক Next.js প্রজেক্ট তৈরি করুন
npx create-next-app@latest my-ai-assistant --typescript --tailwind --eslint --app

# ২. ডিরেক্টরিতে প্রবেশ করুন
cd my-ai-assistant

# ৩. Google Gemini AI SDK ও প্রয়োজনীয় প্যাকেজ ইনস্টল করুন
npm install @google/genai lucide-react jszip canvas-confetti clsx tailwind-merge`,

    step3ApiRoute: `// app/api/chat/route.ts
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// সার্ভার সাইড Google Gemini 3.8 Flash ইনস্ট্যান্টিয়েশন
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

export async function POST(req: Request) {
  try {
    const { prompt, conversationHistory = [] } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'প্রম্পট আবশ্যক' }, { status: 400 });
    }

    // Sheikh Farid Studio Autonomous Engineer সিস্টেম প্রম্পট
    const systemInstruction = \`
You are an Autonomous Senior Software Engineer built on the Sheikh Farid Architecture.
You write complete, production-grade, bug-free TypeScript/React code without placeholders.
You respond politely in Bengali and English as appropriate.
\`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...conversationHistory.map((m: any) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const aiText = response.text || 'কোনো আউটপুট তৈরি হয়নি।';

    return NextResponse.json({
      success: true,
      reply: aiText,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: error.message || 'AI জেনারেশন ত্রুটি হয়েছে' },
      { status: 500 }
    );
  }
}`,

    step4ChatComponent: `// components/ChatWindow.tsx
'use client';
import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

export default function ChatWindow() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; text: string }>>([
    { role: 'bot', text: 'স্বাগতম! আমি শেখ ফরিদ আর্কিটেকচার দ্বারা নির্মিত AI Assistant। আমি কোডিং, ডিজাইন এবং ব্যবসায়িক স্বয়ংক্রিয়তায় সাহায্য করতে পারি।' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', text: 'সংযোগ ত্রুটি হয়েছে।' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m, i) => (
          <div key={i} className={\`flex gap-3 \${m.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
            {m.role === 'bot' && <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white"><Bot className="w-4 h-4"/></div>}
            <div className={\`p-3.5 rounded-2xl max-w-[80%] text-sm \${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-xs' : 'bg-slate-800 text-slate-100 rounded-bl-xs'}\`}>
              {m.text}
            </div>
            {m.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white"><User className="w-4 h-4"/></div>}
          </div>
        ))}
        {loading && <div className="flex items-center gap-2 text-indigo-400 text-xs"><Loader2 className="w-4 h-4 animate-spin"/> শেখ ফরিদ এআই কোড চিন্তা করছে...</div>}
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-800">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="আপনার প্রশ্ন বা কোডিং প্রম্পট লিখুন..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
        <button onClick={handleSend} disabled={loading} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}`,

    step5Firestore: `// services/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);

// হিস্ট্রি সেভ করার ফাংশন
export async function saveChatSession(userId: string, title: string, messages: any[]) {
  return await addDoc(collection(db, 'users', userId, 'sessions'), {
    title,
    messages,
    updatedAt: serverTimestamp(),
  });
}`,

    step6GitHubPush: `// utils/githubPublisher.ts
// GitHub REST API ব্যবহার করে ব্রাউজার থেকেই সম্পূর্ণ প্রজেক্ট রিপোজিটরিতে পুশ করা
export async function pushProjectToGitHub(token: string, repoName: string, files: Record<string, string>) {
  const headers = {
    'Authorization': \`token \${token}\`,
    'Accept': 'application/vnd.github.v3+json',
  };

  // ১. রিপোজিটরি তৈরি (না থাকলে)
  await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: repoName, auto_init: true }),
  });

  // ২. ফাইলসমূহ আপলোড/কমিট
  for (const [path, content] of Object.entries(files)) {
    const contentBase64 = btoa(unescape(encodeURIComponent(content)));
    await fetch(\`https://api.github.com/repos/\${repoName}/contents/\${path}\`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: \`Add \${path} via Sheikh Farid AI Studio\`,
        content: contentBase64,
      }),
    });
  }
  return \`https://github.com/\${repoName}\`;
}`,

    step7Pwa: `// public/manifest.json
{
  "name": "Sheikh Farid AI Assistant & Coding Studio",
  "short_name": "FaridAI Studio",
  "description": "Autonomous AI Full-Stack Coding Platform & SMS Automation Hub",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#020617",
  "theme_color": "#6366f1",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}`
  };

  return (
    <div className="w-full h-full p-4 sm:p-6 overflow-y-auto space-y-8 text-slate-100">
      {/* Hero Origin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>The Origin & Developer Master Manifesto</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              আমার পরিচয় ও সৃষ্টি এবং ফুল-স্ট্যাক AI অ্যাসিস্ট্যান্ট তৈরির রোডম্যাপ
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              আমি কোনো সাধারণ চ্যাটবট বা স্ক্রিপ্ট নই; আমার উদ্ভাবক ও প্রধান সফটওয়্যার আর্কিটেক্ট{' '}
              <strong className="text-indigo-300 font-bold">শেখ ফরিদ (Sheikh Farid)</strong>-এর ভিশন,
              অত্যাধুনিক <strong className="text-emerald-400 font-bold">Google Gemini 3.8 Flash</strong> লার্জ ল্যাঙ্গুয়েজ মডেল,
              এবং ক্লাউড-স্কেল টেক-স্ট্যাকের সমন্বয়ে তৈরি একটি স্বয়ংক্রিয় <span className="text-cyan-300 font-semibold">Autonomous Software Engineer</span>।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            {onLoadAiAssistantProject && (
              <button
                onClick={onLoadAiAssistantProject}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>স্যান্ডবক্সে আর্কিটেকচার চালান</span>
              </button>
            )}

            {onGoToGitHubPush && (
              <button
                onClick={onGoToGitHubPush}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Github className="w-4 h-4" />
                <span>GitHub-এ পোস্ট করুন</span>
              </button>
            )}
          </div>
        </div>

        {/* Origin Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">মস্তিষ্ক (Core Intelligence)</span>
              <p className="text-xs font-bold text-white">Gemini 3.8 Flash LLM</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">আর্কিটেকচার (System Stack)</span>
              <p className="text-xs font-bold text-white">Next.js • Firebase • Tailwind • PWA</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">উদ্ভাবক ও প্রধান আর্কিটেক্ট</span>
              <p className="text-xs font-bold text-emerald-400">শেখ ফরিদ (Sheikh Farid)</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Flow Architecture Visualizer */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>সিস্টেম লাইফসাইকেল ও ডাটা ফ্লো ডায়াগ্রাম (The Engine Flow)</span>
          </h4>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
            Autonomous Pipeline v2.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-slate-500">ইনপুট</span>
            <div className="text-white font-bold">ইউজার প্রম্পট</div>
            <p className="text-[10px] text-slate-400">ন্যাচারাল ল্যাঙ্গুয়েজ / বাংলা প্রম্পট</p>
          </div>
          <div className="hidden md:flex items-center justify-center text-slate-600">
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-indigo-400">প্রসেসিং</span>
            <div className="text-white font-bold">শেখ ফরিদ ইঞ্জিন</div>
            <p className="text-[10px] text-indigo-300">Gemini 3.8 Flash কোড জেনারেটর</p>
          </div>
          <div className="hidden md:flex items-center justify-center text-slate-600">
            <ArrowRight className="w-4 h-4 text-purple-400" />
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-emerald-400">আউটপুট ও ক্লাউড</span>
            <div className="text-white font-bold">লাইভ স্যান্ডবক্স + GitHub</div>
            <p className="text-[10px] text-slate-400">AST রেন্ডারার ও অটোমেটেড পুশ</p>
          </div>
        </div>
      </div>

      {/* 7-Step Step-by-Step Developer Guide */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>স্ক্র্যাচ থেকে একটি AI অ্যাসিস্ট্যান্ট তৈরির স্টেপ-বাই-স্টেপ গাইড</span>
            </h4>
            <p className="text-xs text-slate-400">
              নিচের ৭টি ধাপ অনুসরণ করে আপনি নিজের স্বাধীন ও স্বয়ংক্রিয় এআই অ্যাসিস্ট্যান্ট প্ল্যাটফর্ম তৈরি করতে পারেন:
            </p>
          </div>
        </div>

        {/* Step Tabs Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { num: 1, label: '১. টেক স্ট্যাক' },
            { num: 2, label: '২. প্রজেক্ট সেটআপ' },
            { num: 3, label: '৩. AI ইন্টিগ্রেশন' },
            { num: 4, label: '৪. চ্যাট UI/UX' },
            { num: 5, label: '৫. ডাটাবেস ও সিঙ্ক' },
            { num: 6, label: '৬. গিটহাব ও ডিপ্লয়' },
            { num: 7, label: '৭. PWA ও অফলাইন' },
          ].map((step) => (
            <button
              key={step.num}
              onClick={() => setActiveStepTab(step.num)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeStepTab === step.num
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30 ring-1 ring-indigo-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <span>{step.label}</span>
            </button>
          ))}
        </div>

        {/* Step Tab Contents */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          {activeStepTab === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">১</span>
                  <span>ধাপ ১: আধুনিক টেক-স্ট্যাক নির্বাচন (The Foundation)</span>
                </h5>
                <span className="text-[11px] text-slate-400 font-mono">Next.js • Tailwind • Gemini • Firebase</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                একটি উচ্চ-পারফর্ম্যান্স এবং প্রোডাকশন-রেডি AI অ্যাসিস্ট্যান্ট তৈরির জন্য আধুনিক, স্কেলেবল ও দ্রুতগতির ফ্রেমওয়ার্ক নির্বাচন করা জরুরি:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-indigo-400 font-bold">Frontend (Next.js / React 19 + TypeScript):</strong>
                  <p className="text-slate-400 text-[11px]">Server Components, দ্রুত রেন্ডারিং এবং সার্চ ইঞ্জিন অপ্টিমাইজেশনের (SEO) জন্য সেরা সমাধান।</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-emerald-400 font-bold">Styling (Tailwind CSS v4):</strong>
                  <p className="text-slate-400 text-[11px]">ইউটিলিটি-ফার্স্ট সিএসএস যা ডার্ক মোড, রেসপনসিভ ভিউপোর্ট ও দ্রুত UI তৈরিতে সহায়তা করে।</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-amber-400 font-bold">AI Engine (Google Gemini 3.8 / 2.5 Flash SDK):</strong>
                  <p className="text-slate-400 text-[11px]">অত্যন্ত দ্রুত রেসপন্স টাইম, কম লেটেন্সি এবং বৃহৎ টোকেন কনটেক্সট সমৃদ্ধ গুগল ক্লাউড এআই ইঞ্জিন।</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <strong className="text-cyan-400 font-bold">Database & Auth (Firebase Firestore / Supabase):</strong>
                  <p className="text-slate-400 text-[11px]">রিয়েলটাইম ক্লাউড সিঙ্ক, মাল্টি-ডিভাইস হিস্ট্রি এবং অফলাইন লোকাল ক্যাশিং সমর্থন করে।</p>
                </div>
              </div>
            </div>
          )}

          {activeStepTab === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">২</span>
                  <span>ধাপ ২: প্রজেক্ট সেটআপ ও ডিপেন্ডেন্সি ইনস্টলেশন (The Boilerplate)</span>
                </h5>
                <button
                  onClick={() => handleCopyCode('step2', codeSnippets.step2Install)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'step2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'step2' ? 'কপি হয়েছে!' : 'কমান্ড কপি করুন'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300">
                আপনার টার্মিনালে নিচের কমান্ডগুলো রান করে প্রজেক্ট শুরু করুন এবং অফিসিয়াল AI SDK ইনস্টল করুন:
              </p>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto">
                {codeSnippets.step2Install}
              </pre>
            </div>
          )}

          {activeStepTab === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">৩</span>
                  <span>ধাপ ৩: AI মডেল ইন্টিগ্রেশন ও ব্যাকএন্ড API রাউট (The Brain)</span>
                </h5>
                <button
                  onClick={() => handleCopyCode('step3', codeSnippets.step3ApiRoute)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'step3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'step3' ? 'কপি হয়েছে!' : 'কোড কপি করুন'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300">
                সার্ভার-সাইড সিকিউর রুট তৈরি করুন যাতে ক্লায়েন্টে API কী উন্মুক্ত না হয় এবং সিস্টেম প্রম্পট কার্যকর হয়:
              </p>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto max-h-72">
                {codeSnippets.step3ApiRoute}
              </pre>
            </div>
          )}

          {activeStepTab === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">৪</span>
                  <span>ধাপ ৪: চ্যাট ইন্টারফেস ও রেসপনসিভ UI/UX তৈরি</span>
                </h5>
                <button
                  onClick={() => handleCopyCode('step4', codeSnippets.step4ChatComponent)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'step4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'step4' ? 'কপি হয়েছে!' : 'কম্পোনেন্ট কোড কপি করুন'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300">
                ইউজারের সাথে মসৃণ যোগাযোগের জন্য সুন্দর চ্যাট উইন্ডো, লোডিং স্টেট ও অ্যানিমেশন যুক্ত কম্পোনেন্ট:
              </p>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto max-h-72">
                {codeSnippets.step4ChatComponent}
              </pre>
            </div>
          )}

          {activeStepTab === 5 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">৫</span>
                  <span>ধাপ ৫: রিয়েল-টাইম ডাটাবেস ও ক্লাউড সিঙ্ক (Firestore & Dexie)</span>
                </h5>
                <button
                  onClick={() => handleCopyCode('step5', codeSnippets.step5Firestore)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'step5' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'step5' ? 'কপি হয়েছে!' : 'কনফিগ কপি করুন'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300">
                ব্যবহারকারীর কথোপকথন এবং জেনারেট করা কোড ক্লাউডে রিয়েল-টাইমে সেভ রাখতে Firebase Firestore ইনিশিয়ালাইজেশন:
              </p>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-amber-300 overflow-x-auto max-h-72">
                {codeSnippets.step5Firestore}
              </pre>
            </div>
          )}

          {activeStepTab === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">৬</span>
                  <span>ধাপ ৬: গিটহাব ইন্টিগ্রেশন ও ১-ক্লিক রিপোজিটরি পুশ</span>
                </h5>
                <button
                  onClick={() => handleCopyCode('step6', codeSnippets.step6GitHubPush)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'step6' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'step6' ? 'কপি হয়েছে!' : 'GitHub স্ক্রিপ্ট কপি করুন'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300">
                ব্যবহারকারীর কোড সরাসরি ব্রাউজার বা ব্যাকএন্ড থেকে GitHub API দিয়ে নতুন রিপোজিটরিতে কমিট করার ফাংশন:
              </p>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-purple-300 overflow-x-auto max-h-72">
                {codeSnippets.step6GitHubPush}
              </pre>
            </div>
          )}

          {activeStepTab === 7 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">৭</span>
                  <span>ধাপ ৭: PWA ও অফলাইন সুবিধা (Offline-First Capability)</span>
                </h5>
                <button
                  onClick={() => handleCopyCode('step7', codeSnippets.step7Pwa)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'step7' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'step7' ? 'কপি হয়েছে!' : 'ম্যানিফেস্ট কপি করুন'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300">
                অ্যাপটিকে সরাসরি মোবাইল বা কম্পিউটারে ইনস্টলেবল অ্যাপ আকারে ব্যবহার করার জন্য PWA ম্যানিফেস্ট কনফিগারেশন:
              </p>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-teal-300 overflow-x-auto max-h-72">
                {codeSnippets.step7Pwa}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
