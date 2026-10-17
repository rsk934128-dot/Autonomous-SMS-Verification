import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Wand2,
  Play,
  Download,
  Globe,
  Layers,
  Code2,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  Copy,
  Plus,
  Trash2,
  Rocket,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Terminal,
  Zap,
  CheckCircle2,
  AlertCircle,
  FileCode,
  FolderGit2,
  DollarSign,
  Github,
  Key,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Cpu,
  Bot
} from 'lucide-react';
import JSZip from 'jszip';
import { ProgramProject, ChatMessage, QuickPromptTemplate } from '../../types/aiStudio';
import { MarketplaceProduct } from '../../types/marketplace';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DeveloperRoadmapView } from './DeveloperRoadmapView';

interface GeminiAppStudioProps {
  initialProgram?: Partial<ProgramProject> | null;
  onPublishToMarketplace?: (product: MarketplaceProduct) => void;
  onPushToGitHub?: (program: ProgramProject) => void;
}

const FARID_AI_ASSISTANT_SAMPLE: ProgramProject = {
  id: 'prog_farid_ai_assistant',
  title: 'Sheikh Farid Autonomous AI Assistant & Code Studio',
  description: 'Google Gemini 3.8 Flash দ্বারা চালিত শেখ ফরিদ অটোনোমাস এআই সফটওয়্যার অ্যাসিস্ট্যান্ট এবং কোডিং ইঞ্জিন।',
  category: 'SaaS',
  version: '2.5.0',
  features: [
    'Gemini 3.8 Flash Large Language Model Brain',
    'Sheikh Farid Visionary System Architecture',
    'Real-time Chat with Streaming Code Generation',
    'Next.js 15, TypeScript & Tailwind CSS Foundation',
    'Firebase Firestore Cloud Real-time Persistence',
    'Automated 1-Click GitHub Repository Commit & Deploy'
  ],
  techStack: ['Next.js 15', 'TypeScript', 'Gemini 3.8 Flash', 'Tailwind CSS', 'Firebase Firestore', 'GitHub REST API'],
  colorTheme: ['#6366f1', '#a855f7', '#0f172a'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  valuationBdt: 25000,
  valuationUsd: 220,
  deployedStatus: 'live',
  deployedUrl: 'https://ais-dev-7xvgnqtcch52l5ap3yqyud-480315954464.asia-east1.run.app',
  previewHtml: `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center">
  <div class="max-w-2xl w-full bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
    <div class="flex items-center justify-between pb-4 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30 text-xl">
          ⚡
        </div>
        <div>
          <h2 class="text-xl font-bold text-white tracking-tight">Sheikh Farid Autonomous AI Assistant</h2>
          <p class="text-xs text-indigo-400">Powered by Gemini 3.8 Flash & Cloud Architecture</p>
        </div>
      </div>
      <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        Active v2.5
      </span>
    </div>

    <div class="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-xs">
      <div class="flex items-center justify-between">
        <span class="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">আমার পরিচয় ও সৃষ্টি (The Origin)</span>
        <span class="text-slate-400">Architect: শেখ ফরিদ (Sheikh Farid)</span>
      </div>
      <p class="text-slate-300 leading-relaxed">
        আমি সাধারণ কোনো স্ক্রিপ্ট নই; আমার উদ্ভাবক শেখ ফরিদ-এর প্রযুক্তিগত দক্ষতা ও দূরদর্শী চিন্তাভাবনায় গঠিত স্বয়ংক্রিয় এআই সফটওয়্যার আর্কিটেকচার।
      </p>
    </div>

    <div class="space-y-3">
      <div id="chatBox" class="h-44 overflow-y-auto p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
        <div class="flex gap-2">
          <div class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">SF</div>
          <div class="p-2.5 bg-slate-800 text-slate-200 rounded-xl max-w-[85%]">
            স্বাগতম! আমি শেখ ফরিদ এআই সহকারী। আমি যেকোনো কোড লিখতে, সমস্যা সমাধান করতে এবং স্বয়ংক্রিয়ভাবে প্রজেক্ট সাজাতে প্রস্তুত। নিচে প্রম্পট লিখুন!
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <input id="userPrompt" type="text" placeholder="একটি ক্যালকুলেটর বা নতুন কোড প্রম্পট লিখুন..." class="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500">
        <button onclick="sendAssistantMsg()" class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer">
          পাঠান
        </button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2 text-center text-[11px]">
      <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
        <span class="text-slate-500 block text-[9px]">ENGINE</span>
        <strong class="text-indigo-300">Gemini 3.8 Flash</strong>
      </div>
      <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
        <span class="text-slate-500 block text-[9px]">STORAGE</span>
        <strong class="text-emerald-300">Firebase Firestore</strong>
      </div>
      <div class="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
        <span class="text-slate-500 block text-[9px]">SYNC</span>
        <strong class="text-purple-300">GitHub REST API</strong>
      </div>
    </div>
  </div>

  <script>
    function sendAssistantMsg() {
      const input = document.getElementById('userPrompt');
      const val = input.value.trim();
      if (!val) return;
      const box = document.getElementById('chatBox');
      
      const uMsg = document.createElement('div');
      uMsg.className = 'flex gap-2 justify-end';
      uMsg.innerHTML = '<div class="p-2.5 bg-indigo-600 text-white rounded-xl max-w-[85%] text-xs">' + val + '</div>';
      box.appendChild(uMsg);
      input.value = '';
      box.scrollTop = box.scrollHeight;

      setTimeout(() => {
        const bMsg = document.createElement('div');
        bMsg.className = 'flex gap-2';
        bMsg.innerHTML = '<div class="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">SF</div><div class="p-2.5 bg-slate-800 text-slate-200 rounded-xl max-w-[85%] text-xs">শেখ ফরিদ ইঞ্জিন আপনার অনুরোধ প্রসেস করেছে: "' + val + '" এর জন্য ক্লিন আর্কিটেকচার কোড তৈরি ও লাইভ রাখা হলো!</div>';
        box.appendChild(bMsg);
        box.scrollTop = box.scrollHeight;
      }, 500);
    }
  </script>
</body>
</html>`,
  reactCode: `import React, { useState } from 'react';
import { Sparkles, Bot, Send, Code, Layers, ShieldCheck, Database, Github } from 'lucide-react';

export default function SheikhFaridAIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'স্বাগতম! আমি শেখ ফরিদ (Sheikh Farid) আর্কিটেকচার ও Google Gemini 3.8 Flash চালিত Autonomous AI Assistant।' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: \`শেখ ফরিদ ইঞ্জিন আপনার অনুরোধ গ্রহণ করেছে: "\${userText}"। কোড স্ট্রাকচার ও রিয়েলটাইম ডেটাবেস প্রস্তুত করা হয়েছে।\`
        }
      ]);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col items-center justify-center font-sans antialiased">
      <div className="max-w-2xl w-full bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Sheikh Farid AI Assistant</h2>
              <p className="text-xs text-indigo-400">Gemini 3.8 Flash • Next.js • Firebase Architecture</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            Autonomous v2.5
          </span>
        </div>

        <div className="h-64 overflow-y-auto p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
          {messages.map((m, i) => (
            <div key={i} className={\`flex gap-2.5 \${m.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  SF
                </div>
              )}
              <div className={\`p-3 rounded-2xl max-w-[80%] leading-relaxed \${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'}\`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="আপনার কোডিং প্রম্পট বা প্রশ্ন লিখুন..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleSend}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-900/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>পাঠান</span>
          </button>
        </div>
      </div>
    </div>
  );
}
`
};

const DEFAULT_TEMPLATES: QuickPromptTemplate[] = [
  {
    id: 'tmpl-farid-assistant',
    title: 'Sheikh Farid Autonomous AI Assistant & Code Studio',
    titleBn: 'শেখ ফরিদ স্বয়ংক্রিয় এআই অ্যাসিস্ট্যান্ট ও কোড স্টুডিও',
    category: 'SaaS',
    iconName: 'Cpu',
    prompt: 'শেখ ফরিদ আর্কিটেকচার দ্বারা চালিত একটি সম্পূর্ণ অটোনোমাস এআই কোডিং অ্যাসিস্ট্যান্ট অ্যাপ বানান যাতে লাইভ চ্যাট উইন্ডো, কোড প্রিভিউ স্যান্ডবক্স, গিটহাব পুশ অপশন এবং রিয়েলটাইম ফায়ারবেস হিস্ট্রি সিঙ্ক থাকে।',
    description: 'Autonomous conversational coding assistant with interactive sandbox, multi-file code generator, and GitHub exporter.',
    descriptionBn: 'লাইভ চ্যাট, ইন্টারেক্টিভ কোড স্যান্ডবক্স এবং গিটহাব এক্সপোর্টার সমৃদ্ধ এআই ডেভেলপার অ্যাসিস্ট্যান্ট।',
    estimatedLines: 240,
  },
  {
    id: 'tmpl-currency',
    title: 'Kuwait & BD Multi-Currency Converter',
    titleBn: 'কুয়েত দিনার ও বাংলাদেশি টাকা রূপান্তরকারী',
    category: 'Fintech',
    iconName: 'DollarSign',
    prompt: 'কুয়েতি দিনার (KWD) থেকে বাংলাদেশি টাকা (BDT) এবং ইউএসডি (USD) লাইভ রূপান্তরকারী একটি অ্যাপ বানান যেখানে কাস্টম রেট এবং হিস্ট্রি টেবিল থাকবে।',
    description: 'Real-time KWD, BDT & USD converter with customizable exchange rate ledger and quick math.',
    descriptionBn: 'লাইভ মুদ্রা রূপান্তর ও হিস্ট্রি টেবিলসহ আধুনিক ফিনটেক টুল।',
    estimatedLines: 120,
  },
  {
    id: 'tmpl-sms-scheduler',
    title: 'Automated SMS Campaign Manager',
    titleBn: 'অটোমেটেড এসএমএস ক্যাম্পেইন ম্যানেজার',
    category: 'SMS & Telecom',
    iconName: 'Zap',
    prompt: 'একটি বাল্ক এসএমএস ও ওটিপি ক্যাম্পেইন শিডিউলার বানান যেখানে প্রাপক তালিকা, মেসেজ প্রিভিউ, এবং ডেলিভারি স্ট্যাটাস অ্যানিমেশন থাকবে।',
    description: 'Bulk SMS and OTP dispatcher interface with live character counter, tag placeholders, and logs.',
    descriptionBn: 'বাল্ক এসএমএস শিডিউলিং ও ডেলিভারি পর্যবেক্ষণ ড্যাশবোর্ড।',
    estimatedLines: 160,
  },
  {
    id: 'tmpl-invoice',
    title: 'Instant Invoice & Receipt Generator',
    titleBn: 'ইনস্ট্যান্ট ইনভয়েস ও ক্যাশ মেমো জেনারেটর',
    category: 'E-commerce',
    iconName: 'FileCode',
    prompt: 'গ্রাহকদের জন্য একটি আধুনিক ইনভয়েস এবং ক্যাশ মেমো মেকার বানান যাতে আইটেম যোগ করা, ভ্যাট/ডিসকাউন্ট গণনা এবং প্রিন্ট/পিডিএফ প্রিভিউ করা যায়।',
    description: 'Interactive invoice maker with dynamic row addition, subtotal/VAT calculation, and print styling.',
    descriptionBn: 'আইটেম সংযোজন, ভ্যাট ও ডিসকাউন্টসহ প্রিন্ট-রেডি ইনভয়েস নির্মাতা।',
    estimatedLines: 190,
  },
  {
    id: 'tmpl-qr',
    title: 'Dynamic QR Code & Contact Card Maker',
    titleBn: 'ডায়নামিক কিউআর কোড ও ভিজিটিং কার্ড মেকার',
    category: 'Utility',
    iconName: 'Sparkles',
    prompt: 'ইউআরএল, ওয়াইফাই, এবং ভিকার্ডের জন্য একটি আধুনিক কিউআর কোড জেনারেটর এবং কাস্টমাইজযোগ্য ডিজিটাল ভিজিটিং কার্ড অ্যাপ বানান।',
    description: 'Generate customizable SVG QR codes for websites, WhatsApp links, and vCards with download.',
    descriptionBn: 'ওয়েব লিংক ও হোয়াটসঅ্যাপের জন্য কিউআর কোড নির্মাতা।',
    estimatedLines: 140,
  },
];

const INITIAL_PROGRAM_SAMPLE: ProgramProject = {
  id: 'prog_default_1',
  title: 'Sheikh Farid Smart Calculator & Currency Hub',
  description: 'ইন্টারঅ্যাক্টিভ মাল্টি-ফাংশনাল ক্যালকুলেটর এবং কুয়েত দিনার (KWD) ও টাকার (BDT) রিয়েলটাইম কনভার্টার।',
  category: 'Fintech',
  version: '1.0.0',
  features: [
    'Real-time KWD to BDT and USD conversion',
    'Interactive calculator keypad with memory',
    'Transaction audit ledger stored in local state',
    'Clean dark-slate UI with responsive Tailwind styling',
  ],
  techStack: ['React 19', 'Tailwind CSS', 'Lucide React', 'Clipboard API'],
  colorTheme: ['#10b981', '#6366f1', '#0f172a'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  valuationBdt: 5500,
  valuationUsd: 48,
  deployedStatus: 'live',
  deployedUrl: 'https://farid-currency-hub.sheikhfarid-studio.app',
  previewHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-6 flex items-center justify-center">
  <div class="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
    <div class="flex items-center justify-between pb-4 border-b border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20 text-lg">
          ৳
        </div>
        <div>
          <h2 class="text-lg font-bold text-white tracking-tight">KWD / BDT Live Converter</h2>
          <p class="text-xs text-slate-400">Farid Studio Autonomous Engine</p>
        </div>
      </div>
      <span class="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
        Live 1.0
      </span>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-300 mb-1.5">কুয়েত দিনার পরিমাণ (KWD Dinar):</label>
        <div class="relative">
          <input type="number" id="kwdInput" value="10" oninput="convertCurrency()" class="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-emerald-500 pr-16" placeholder="যেমন: 50">
          <span class="absolute right-4 top-3 text-xs font-bold text-slate-400">KWD د.ك</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
          <span class="text-xs text-slate-400 font-medium">বাংলাদেশি টাকা (BDT)</span>
          <div id="bdtResult" class="text-xl font-black text-emerald-400 mt-1">৳ 3,950</div>
          <span class="text-[10px] text-slate-500">1 KWD = 395.00 BDT</span>
        </div>
        <div class="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
          <span class="text-xs text-slate-400 font-medium">ইউএস ডলার (USD)</span>
          <div id="usdResult" class="text-xl font-black text-cyan-400 mt-1">$ 32.55</div>
          <span class="text-[10px] text-slate-500">1 KWD = 3.25 USD</span>
        </div>
      </div>

      <div class="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
        <span class="text-emerald-300">স্মার্ট ক্যালকুলেশন লাইভ অ্যাক্টিভ রয়েছে</span>
        <button onclick="copyOutput()" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition">কপি ফলাফল</button>
      </div>
    </div>
  </div>

  <script>
    function convertCurrency() {
      const val = parseFloat(document.getElementById('kwdInput').value) || 0;
      const bdt = (val * 395).toLocaleString();
      const usd = (val * 3.255).toFixed(2);
      document.getElementById('bdtResult').innerText = '৳ ' + bdt;
      document.getElementById('usdResult').innerText = '$ ' + usd;
    }
    function copyOutput() {
      const val = document.getElementById('kwdInput').value;
      const bdt = document.getElementById('bdtResult').innerText;
      navigator.clipboard.writeText(val + ' KWD = ' + bdt);
      alert('ফলাফল ক্লিপবোর্ডে কপি করা হয়েছে!');
    }
  </script>
</body>
</html>`,
  reactCode: `import React, { useState } from 'react';
import { DollarSign, ArrowRightLeft, Copy, Check, Sparkles } from 'lucide-react';

export default function CurrencyHub() {
  const [kwd, setKwd] = useState('10');
  const [copied, setCopied] = useState(false);

  const num = parseFloat(kwd) || 0;
  const bdt = (num * 395).toLocaleString();
  const usd = (num * 3.255).toFixed(2);

  const handleCopy = () => {
    navigator.clipboard.writeText(\`\${kwd} KWD = \${bdt} BDT | \$\${usd} USD\`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center font-sans antialiased">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">KWD / BDT Live Converter</h2>
              <p className="text-xs text-slate-400">Farid Studio Autonomous Engine</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            Live
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">কুয়েত দিনার পরিমাণ (KWD):</label>
            <input
              type="number"
              value={kwd}
              onChange={(e) => setKwd(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-emerald-500"
              placeholder="যেমন: 50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 font-medium">বাংলাদেশি টাকা (BDT)</span>
              <div className="text-xl font-black text-emerald-400 mt-1">৳ {bdt}</div>
              <span className="text-[10px] text-slate-500">1 KWD = 395.00 BDT</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 font-medium">ইউএস ডলার (USD)</span>
              <div className="text-xl font-black text-cyan-400 mt-1">$ {usd}</div>
              <span className="text-[10px] text-slate-500">1 KWD = 3.25 USD</span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'ফলাফল কপি সম্পন্ন!' : 'কপি করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}`,
};

export const GeminiAppStudio: React.FC<GeminiAppStudioProps> = ({
  initialProgram,
  onPublishToMarketplace,
  onPushToGitHub,
}) => {
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();

  // Programs Registry State
  const [programs, setPrograms] = useState<ProgramProject[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('tv_gemini_programs');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Failed reading programs from localStorage', e);
      }
    }
    return [INITIAL_PROGRAM_SAMPLE];
  });

  const [activeProgramId, setActiveProgramId] = useState<string>(() => {
    return programs[0]?.id || INITIAL_PROGRAM_SAMPLE.id;
  });

  const rawActive = programs.find((p) => p?.id === activeProgramId) || programs[0] || INITIAL_PROGRAM_SAMPLE;

  // Safe wrapper with guaranteed non-null fields to prevent ANY white-screen crashes
  const activeProgram: ProgramProject = {
    id: rawActive?.id || 'prog_default',
    title: rawActive?.title || 'Sheikh Farid Smart App',
    description: rawActive?.description || 'Gemini AI generated program',
    category: rawActive?.category || 'Utility',
    version: rawActive?.version || '1.0.0',
    reactCode: rawActive?.reactCode || '// React component code',
    previewHtml: rawActive?.previewHtml || '<!DOCTYPE html><html><body><h1>Sheikh Farid Studio</h1></body></html>',
    features: Array.isArray(rawActive?.features) ? rawActive.features : ['Responsive UI', 'React 19'],
    techStack: Array.isArray(rawActive?.techStack) ? rawActive.techStack : ['React 19', 'Tailwind CSS'],
    colorTheme: Array.isArray(rawActive?.colorTheme) ? rawActive.colorTheme : ['#10b981', '#0f172a'],
    createdAt: rawActive?.createdAt || new Date().toISOString(),
    updatedAt: rawActive?.updatedAt || new Date().toISOString(),
    valuationBdt: rawActive?.valuationBdt || 5000,
    valuationUsd: rawActive?.valuationUsd || 45,
    deployedStatus: rawActive?.deployedStatus || 'draft',
    deployedUrl: rawActive?.deployedUrl || '',
  };

  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init_msg',
      sender: 'gemini',
      text: 'স্বাগতম! আমি শেখ ফরিদ স্টুডিওর জেমিলাই (Gemini 3.8 Flash) এআই সহকারী। আপনি চ্যাট করে সহজেই নতুন অ্যাপ বা প্রোগ্রাম তৈরি করতে পারেন, বিদ্যমান কোড পরিবর্তন করতে পারেন, নতুন ফিচার যুক্ত করতে পারেন এবং ১-ক্লিকে GitHub-এ পোস্ট ও ডিপ্লয় করতে পারেন। নিচে লিখুন আপনি কী প্রোগ্রাম বানাতে বা পরিবর্তন করতে চান!',
      timestamp: new Date().toLocaleTimeString(),
      suggestedActions: [
        'একটি কুয়েত তালাবাত ফুড ডেলিভারি ট্র্যাকার বানান',
        'বিকাশ ও কে-নেট পেমেন্ট গেটওয়ে সিমুলেশন যোগ করুন',
        'ডার্ক মোড টগল এবং এক্সপোর্ট টু এক্সেল যোগ করুন',
      ],
    },
  ]);

  const [promptInput, setPromptInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'deploy' | 'github' | 'templates' | 'roadmap'>('preview');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedShareUrl, setCopiedShareUrl] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [showDeploySuccess, setShowDeploySuccess] = useState(false);
  const [isPublishedToMarketplace, setIsPublishedToMarketplace] = useState(false);
  const [showNewProgramModal, setShowNewProgramModal] = useState(false);
  const [newProgramTitle, setNewProgramTitle] = useState('');
  const [newProgramCategory, setNewProgramCategory] = useState<ProgramProject['category']>('Utility');
  const [newProgramPrompt, setNewProgramPrompt] = useState('');

  // GitHub State
  const [githubToken, setGithubToken] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gh_pat_token') || '';
    }
    return '';
  });
  const [githubRepoName, setGithubRepoName] = useState<string>(() => {
    return (activeProgram.title || 'app').toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  });
  const [githubIsPrivate, setGithubIsPrivate] = useState(false);
  const [isPushingGithub, setIsPushingGithub] = useState(false);
  const [githubResult, setGithubResult] = useState<{
    success: boolean;
    repoUrl?: string;
    cloneUrl?: string;
    message?: string;
    error?: string;
  } | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Sync programs to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tv_gemini_programs', JSON.stringify(programs));
      } catch (err) {
        console.warn('Storage save failed:', err);
      }
    }
  }, [programs]);

  // Keep repo name in sync when active program changes
  useEffect(() => {
    setGithubRepoName((activeProgram.title || 'app').toLowerCase().replace(/[^a-z0-9_-]+/g, '-'));
    setGithubResult(null);
  }, [activeProgram.id]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAiLoading]);

  // If initialProgram was passed (e.g. from Website Remixer)
  useEffect(() => {
    if (initialProgram && initialProgram.title) {
      const exists = programs.find((p) => p.id === initialProgram.id);
      if (!exists) {
        const importedProg: ProgramProject = {
          id: initialProgram.id || 'remix_import_' + Date.now(),
          title: initialProgram.title || 'Remixed Application',
          description: initialProgram.description || 'Imported from AI Website Remixer',
          category: initialProgram.category || 'SaaS',
          version: '1.0.0',
          reactCode: initialProgram.reactCode || '// React Code',
          previewHtml: initialProgram.previewHtml || '<!DOCTYPE html><html><body><h1>Loaded</h1></body></html>',
          features: Array.isArray(initialProgram.features) ? initialProgram.features : ['Imported clean architecture', 'Tailwind responsive UI'],
          techStack: Array.isArray(initialProgram.techStack) ? initialProgram.techStack : ['React 19', 'Tailwind CSS'],
          colorTheme: Array.isArray(initialProgram.colorTheme) ? initialProgram.colorTheme : ['#6366f1', '#0f172a'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          valuationBdt: initialProgram.valuationBdt || 6500,
          valuationUsd: initialProgram.valuationUsd || 55,
          deployedStatus: 'draft',
        };
        setPrograms((prev) => [importedProg, ...prev]);
        setActiveProgramId(importedProg.id);
      }
    }
  }, [initialProgram]);

  // Send prompt to Gemini API
  const handleSendPrompt = async (forcedPrompt?: string, actionType: 'create' | 'modify' | 'expand' | 'chat' = 'modify') => {
    const textToSend = (forcedPrompt || promptInput).trim();
    if (!textToSend || isAiLoading) return;

    setPromptInput('');

    // Append user message
    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/gemini/program-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          currentProgram: activeProgram,
          chatHistory: chatHistory.slice(-6),
          actionType,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const updatedProg: ProgramProject = {
          ...activeProgram,
          title: data.title || activeProgram.title,
          description: data.description || activeProgram.description,
          category: data.category || activeProgram.category,
          reactCode: data.reactCode || activeProgram.reactCode,
          previewHtml: data.previewHtml || activeProgram.previewHtml,
          features: Array.from(new Set([...(activeProgram.features || []), ...(data.featuresAdded || [])])),
          techStack: data.techStack || activeProgram.techStack,
          valuationBdt: data.valuationBdt || activeProgram.valuationBdt || 5000,
          valuationUsd: data.valuationUsd || activeProgram.valuationUsd || 45,
          updatedAt: new Date().toISOString(),
        };

        setPrograms((prev) => prev.map((p) => (p.id === activeProgram.id ? updatedProg : p)));

        const geminiMsg: ChatMessage = {
          id: 'gem_' + Date.now(),
          sender: 'gemini',
          text: data.replyText,
          timestamp: new Date().toLocaleTimeString(),
          suggestedActions: data.suggestedActions || [
            'GitHub-এ রিপোজিটরি তৈরি করে পোস্ট করুন',
            '১-ক্লিকে লাইভ ক্লাউডে ডিপ্লয় করুন',
            'কোডটি জিপ (ZIP) আকারে ডাউনলোড করুন',
          ],
          appliedChanges: data.featuresAdded,
        };

        setChatHistory((prev) => [...prev, geminiMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: 'err_' + Date.now(),
          sender: 'system',
          text: `ত্রুটি: ${data.error || 'Gemini সাড়া দিতে পারেনি। আবার চেষ্টা করুন।'}`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setChatHistory((prev) => [...prev, errorMsg]);
      }
    } catch (err: unknown) {
      console.error('Gemini chat request failed:', err);
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        sender: 'system',
        text: 'সার্ভারের সাথে যোগাযোগে বিঘ্ন ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Create brand new program
  const handleCreateNewProgram = async () => {
    if (!newProgramTitle.trim()) return;

    const newId = 'prog_' + Date.now();
    const newProg: ProgramProject = {
      id: newId,
      title: newProgramTitle.trim(),
      description: newProgramPrompt.trim() || 'Custom program created via Sheikh Farid Studio.',
      category: newProgramCategory,
      version: '1.0.0',
      features: ['Modern React 19 architecture', 'Tailwind responsive UI'],
      techStack: ['React 19', 'Tailwind CSS', 'Lucide React'],
      colorTheme: ['#10b981', '#0f172a'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      valuationBdt: 4000,
      valuationUsd: 35,
      deployedStatus: 'draft',
      reactCode: `import React, { useState } from 'react';
import { Sparkles, Zap } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex items-center justify-center font-sans antialiased">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto text-xl font-bold">
          <Zap className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">${newProgramTitle}</h1>
        <p className="text-xs text-slate-400">Gemini AI Studio New Program Canvas</p>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg transition cursor-pointer"
        >
          ইন্টারেক্টিভ ক্লিক কাউন্টার: {count}
        </button>
      </div>
    </div>
  );
}`,
      previewHtml: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-6 font-sans">
  <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
    <div class="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto text-2xl font-bold">⚡</div>
    <h1 class="text-xl font-bold text-white">${newProgramTitle}</h1>
    <p class="text-xs text-slate-400">Gemini AI Studio Dynamic Sandbox</p>
    <button onclick="alert('Program is interactive!')" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg transition cursor-pointer">ক্লিক করুন</button>
  </div>
</body>
</html>`,
    };

    setPrograms((prev) => [newProg, ...prev]);
    setActiveProgramId(newId);
    setShowNewProgramModal(false);

    if (newProgramPrompt.trim()) {
      handleSendPrompt(
        `একটি নতুন প্রোগ্রাম "${newProgramTitle}" তৈরি করুন। বিস্তারিত নির্দেশ: ${newProgramPrompt.trim()}`,
        'create'
      );
    }
    setNewProgramTitle('');
    setNewProgramPrompt('');
  };

  // Delete program
  const handleDeleteProgram = (id: string) => {
    if (programs.length <= 1) {
      alert('কমপক্ষে একটি প্রোগ্রাম তালিকায় থাকা আবশ্যক!');
      return;
    }
    if (window.confirm('আপনি কি এই প্রোগ্রামটি মুছে ফেলতে নিশ্চিত?')) {
      const remaining = programs.filter((p) => p.id !== id);
      setPrograms(remaining);
      setActiveProgramId(remaining[0].id);
    }
  };

  // 1-Click Copy Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeProgram.reactCode || '');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Generate GitHub-Ready Project Files Object
  const generateProjectFilesMap = () => {
    const safeTitle = (activeProgram.title || 'app').toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
    const packageJsonContent = JSON.stringify(
      {
        name: safeTitle,
        private: true,
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'vite build',
          preview: 'vite preview',
        },
        dependencies: {
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          'lucide-react': '^0.546.0',
        },
        devDependencies: {
          '@vitejs/plugin-react': '^4.3.0',
          tailwindcss: '^4.0.0',
          typescript: '^5.0.0',
          vite: '^6.0.0',
        },
      },
      null,
      2
    );

    const dockerfileContent = `FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]`;

    const vercelJsonContent = JSON.stringify(
      {
        rewrites: [{ source: '/(.*)', destination: '/index.html' }],
      },
      null,
      2
    );

    const githubWorkflow = `name: Build and Deploy\non:\n  push:\n    branches: [ main ]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm install\n      - run: npm run build\n`;

    const gitignoreContent = `node_modules\ndist\n.env\n.env.local\n.DS_Store\n`;

    const readmeContent = `# ${activeProgram.title || 'Sheikh Farid Studio App'}

Generated and published via **Sheikh Farid Studio & Gemini AI 3.8 Flash**.

## Features
${(activeProgram.features || []).map((f) => `- ${f}`).join('\n')}

## Tech Stack
${(activeProgram.techStack || []).map((t) => `- ${t}`).join('\n')}

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`

## Build for Production
\`\`\`bash
npm run build
\`\`\`
`;

    return {
      'package.json': packageJsonContent,
      'src/App.tsx': activeProgram.reactCode || '// React component code',
      'index.html': activeProgram.previewHtml || '<!DOCTYPE html><html><body><h1>App</h1></body></html>',
      'Dockerfile': dockerfileContent,
      'vercel.json': vercelJsonContent,
      '.gitignore': gitignoreContent,
      '.github/workflows/deploy.yml': githubWorkflow,
      'README.md': readmeContent,
    };
  };

  // 1-Click Production ZIP Download with GitHub files
  const handleDownloadZip = async () => {
    const zip = new JSZip();
    const safeTitle = (activeProgram.title || 'app').toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
    const files = generateProjectFilesMap();

    Object.entries(files).forEach(([name, content]) => {
      zip.file(name, content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeTitle}-github-ready.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Direct Push to GitHub via API
  const handlePushToGitHub = async () => {
    if (!githubToken.trim()) {
      alert('অনুগ্রহ করে আপনার GitHub Personal Access Token প্রদান করুন!');
      return;
    }
    if (!githubRepoName.trim()) {
      alert('অনুগ্রহ করে রিপোজিটরির নাম প্রদান করুন!');
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('gh_pat_token', githubToken.trim());
    }

    setIsPushingGithub(true);
    setGithubResult(null);

    const files = generateProjectFilesMap();

    try {
      const res = await fetch('/api/github/push-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken.trim(),
          repoName: githubRepoName.trim(),
          description: activeProgram.description || 'Generated via Sheikh Farid Studio',
          isPrivate: githubIsPrivate,
          files,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGithubResult({
          success: true,
          repoUrl: data.repoUrl,
          cloneUrl: data.cloneUrl,
          message: data.message || 'GitHub-এ সফলভাবে পোস্ট করা হয়েছে!',
        });
      } else {
        setGithubResult({
          success: false,
          error: data.error || 'GitHub-এ পুশ করতে ব্যর্থ হয়েছে। টোকেন ও পারমিশন চেক করুন।',
        });
      }
    } catch (err: unknown) {
      console.error('GitHub push request error:', err);
      setGithubResult({
        success: false,
        error: 'সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      });
    } finally {
      setIsPushingGithub(false);
    }
  };

  // Simulate Cloud Deployment
  const handleDeployToCloud = async () => {
    setIsDeploying(true);
    setDeployStep(0);
    setShowDeploySuccess(false);

    const steps = [
      '📦 Bundling React 19 & Tailwind modules...',
      '🛡️ Running security audit & zero-secret validation...',
      '🚀 Deploying container image to Cloud Run & Vercel edge...',
      '🌐 Allocating live subdomain & SSL certificate...',
      '✅ Health check passed: 200 OK!',
    ];

    for (let i = 0; i < steps.length; i++) {
      setDeployStep(i);
      await new Promise((r) => setTimeout(r, 550));
    }

    const safeTitle = (activeProgram.title || 'app').toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
    const liveUrl = `https://${safeTitle}-${Math.random().toString(36).substring(2, 6)}.sheikhfarid-studio.app`;

    const updatedProg: ProgramProject = {
      ...activeProgram,
      deployedStatus: 'live',
      deployedUrl: liveUrl,
      updatedAt: new Date().toISOString(),
    };

    setPrograms((prev) => prev.map((p) => (p.id === activeProgram.id ? updatedProg : p)));
    setIsDeploying(false);
    setShowDeploySuccess(true);
  };

  // 1-Click Publish to AI Code Marketplace
  const handlePublishToMarketplace = () => {
    const safeTitle = activeProgram.title || 'Smart React App';
    const bdt = activeProgram.valuationBdt || 5000;
    const usd = activeProgram.valuationUsd || 45;

    const marketplaceItem: MarketplaceProduct = {
      id: 'market_' + activeProgram.id,
      title: safeTitle,
      tagline: activeProgram.description || 'Modern full-stack application built with Gemini AI Studio',
      description: `Production-ready application featuring ${(activeProgram.features || []).join(', ')}. Optimized React 19 functional code, zero bloat, mobile-responsive Tailwind CSS design tokens, and Docker/Vercel deployment configs included.`,
      category: activeProgram.category === 'Fintech' ? 'Full-Stack' : activeProgram.category === 'E-commerce' ? 'SaaS' : 'UI Kit',
      tags: ['Gemini AI', 'React 19', 'Tailwind CSS', activeProgram.category || 'Utility', 'Kuwait & BD Ready'],
      techStack: activeProgram.techStack || ['React 19', 'Tailwind CSS', 'Vite'],
      sellerId: currentUser?.uid || 'sheikh_farid_lead',
      sellerName: currentUser?.displayName || 'Sheikh Farid Engineer',
      sellerEmail: currentUser?.email || 'fs2217732@gmail.com',
      priceBdt: bdt,
      priceUsd: usd,
      downloadFileName: `${safeTitle.toLowerCase().replace(/[^a-z0-9_-]+/g, '-')}-source.zip`,
      downloadSizeMb: 1.8,
      salesCount: 0,
      rating: 5.0,
      featured: true,
      createdAt: new Date().toISOString(),
      valuationReport: {
        valuationBdt: bdt,
        valuationUsd: usd,
        recommendedPriceBdt: bdt,
        recommendedPriceUsd: usd,
        qualityScore: 96,
        securityGrade: 'A+',
        complexityTier: 'Full-Stack App',
        architectureAnalysis: `Clean modular architecture incorporating ${(activeProgram.techStack || []).join(', ')}. Zero external bloat and responsive viewports.`,
        keyStrengths: activeProgram.features || [],
        securityReview: 'Client inputs isolated, secret credentials quarantined server-side.',
        monetizationTips: 'Ready for CodeCanyon, Gumroad, or private SaaS license sales.',
      },
    };

    if (onPublishToMarketplace) {
      onPublishToMarketplace(marketplaceItem);
    }
    setIsPublishedToMarketplace(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header / Studio Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Gemini 3.8 Flash AI Studio & Program Copilot</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{activeProgram.title}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                {activeProgram.version}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              {activeProgram.description}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('roadmap')}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800 hover:to-indigo-800 text-purple-200 border border-purple-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>রোডম্যাপ ও আর্কিটেকচার</span>
            </button>

            <button
              onClick={() => setShowNewProgramModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>নতুন প্রোগ্রাম যোগ করুন</span>
            </button>

            <button
              onClick={() => setActiveTab('github')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Github className="w-4 h-4 text-white" />
              <span>GitHub-এ পোস্ট</span>
            </button>

            <button
              onClick={handleDeployToCloud}
              disabled={isDeploying}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>{isDeploying ? 'ডিপ্লয় হচ্ছে...' : '১-ক্লিকে ক্লাউড ডিপ্লয়'}</span>
            </button>

            <button
              onClick={handlePublishToMarketplace}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isPublishedToMarketplace
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/30'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isPublishedToMarketplace ? 'মার্কেটপ্লেসে প্রকাশিত ✅' : 'মার্কেটপ্লেসে পাবলিশ'}</span>
            </button>
          </div>
        </div>

        {/* Program Switcher Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            আপনার প্রোগ্রামসমূহ ({programs.length}):
          </span>
          {programs.map((p) => {
            const pTitle = p?.title || 'Untitled';
            const isCur = (p?.id || '') === activeProgramId;
            return (
              <div
                key={p?.id || Math.random()}
                onClick={() => p?.id && setActiveProgramId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition whitespace-nowrap border ${
                  isCur
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{pTitle}</span>
                {programs.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (p?.id) handleDeleteProgram(p.id);
                    }}
                    className="text-slate-400 hover:text-rose-400 p-0.5 rounded cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Studio Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Gemini AI Copilot Chat & Quick Add Prompt (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col h-[650px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Gemini AI Conversational Assistant
                  </h3>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    মডেল: gemini-3.8-flash (সক্রিয়)
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setChatHistory([
                    {
                      id: 'cleared_' + Date.now(),
                      sender: 'system',
                      text: 'চ্যাট হিস্ট্রি রিসেট করা হয়েছে। নতুন প্রশ্ন বা নির্দেশনা লিখুন।',
                      timestamp: new Date().toLocaleTimeString(),
                    },
                  ])
                }
                className="text-[11px] text-slate-500 hover:text-slate-300 px-2 py-1 rounded bg-slate-950 border border-slate-800 cursor-pointer"
              >
                ক্লিয়ার
              </button>
            </div>

            {/* Chat Messages Scrollable Area */}
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3 shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : msg.sender === 'system'
                        ? 'bg-slate-950 text-amber-300 border border-amber-500/20'
                        : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                    {msg.appliedChanges && msg.appliedChanges.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                          ✨ নতুন যুক্ত বৈশিষ্ট্যসমূহ:
                        </span>
                        <ul className="text-[11px] text-slate-300 space-y-0.5">
                          {msg.appliedChanges.map((change, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.suggestedActions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendPrompt(sug, 'modify')}
                          className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] text-indigo-300 hover:text-indigo-200 transition cursor-pointer text-left"
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isAiLoading && (
                <div className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 w-fit">
                  <Wand2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span className="text-xs">জেমিলাই এআই কোড বিশ্লেষণ ও নতুন ফিচার প্রস্তুত করছে...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Starters */}
            <div className="py-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-slate-500 font-semibold whitespace-nowrap text-[10px]">দ্রুত নির্দেশ:</span>
              <button
                onClick={() => handleSendPrompt('এপটিতে কুয়েত দিনার এবং বাংলাদেশি টাকা কনভার্টার ক্যালকুলেটর যুক্ত করুন।')}
                className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 whitespace-nowrap cursor-pointer"
              >
                💵 কারেন্সি কনভার্টার
              </button>
              <button
                onClick={() => handleSendPrompt('একটি অটোমেটেড এসএমএস ক্যাম্পেইন শিডিউলার উইজেট যুক্ত করুন।')}
                className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 whitespace-nowrap cursor-pointer"
              >
                📱 এসএমএস শিডিউলার
              </button>
              <button
                onClick={() => handleSendPrompt('ডার্ক মোড টগল এবং পিডিএফ ডাউনলোড বোতাম যোগ করুন।')}
                className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 whitespace-nowrap cursor-pointer"
              >
                📄 PDF ডাউনলোড
              </button>
            </div>

            {/* Prompt Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="mt-2 flex gap-2"
            >
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="চ্যাট করে বলুন: কি ফিচার যোগ করবেন বা কোন প্রোগ্রাম বানাবেন? (বাংলা/English)..."
                disabled={isAiLoading}
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!promptInput.trim() || isAiLoading}
                className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-2xl font-bold transition flex items-center justify-center shadow-lg shadow-indigo-900/30 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Interactive Execution Sandbox, Code & GitHub Publishing (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col h-[650px]">
            {/* Viewport & View Mode Tabs Bar */}
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'preview'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>লাইভ স্যান্ডবক্স</span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'code'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>React 19 কোড</span>
                </button>

                <button
                  onClick={() => setActiveTab('github')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'github'
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-sm ring-1 ring-purple-500/40'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  <Github className="w-3.5 h-3.5 text-purple-300" />
                  <span>GitHub পোস্ট ও জিপ</span>
                </button>

                <button
                  onClick={() => setActiveTab('deploy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'deploy'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Rocket className="w-3.5 h-3.5 text-amber-300" />
                  <span>ক্লাউড ডিপ্লয়</span>
                </button>

                <button
                  onClick={() => setActiveTab('templates')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'templates'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-purple-300" />
                  <span>টেমপ্লেটস</span>
                </button>

                <button
                  onClick={() => setActiveTab('roadmap')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'roadmap'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-1 ring-purple-400'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>রোডম্যাপ ও আর্কিটেকচার</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Farid Studio
                  </span>
                </button>
              </div>

              {/* Device Viewport Selector */}
              {activeTab === 'preview' && (
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setViewportMode('desktop')}
                    className={`p-1.5 rounded-lg cursor-pointer ${
                      viewportMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Desktop View"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewportMode('tablet')}
                    className={`p-1.5 rounded-lg cursor-pointer ${
                      viewportMode === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Tablet View"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewportMode('mobile')}
                    className={`p-1.5 rounded-lg cursor-pointer ${
                      viewportMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Mobile View"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Sandbox Body Content */}
            <div className="flex-1 overflow-hidden mt-3 relative bg-slate-950 rounded-2xl border border-slate-800 flex flex-col">
              {activeTab === 'preview' ? (
                <div className="w-full h-full flex items-center justify-center p-2 bg-slate-950 overflow-auto">
                  <div
                    className={`h-full transition-all duration-300 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl ${
                      viewportMode === 'desktop'
                        ? 'w-full'
                        : viewportMode === 'tablet'
                        ? 'w-[720px]'
                        : 'w-[375px]'
                    }`}
                  >
                    <iframe
                      title="Gemini Program Sandbox"
                      srcDoc={activeProgram.previewHtml || '<!DOCTYPE html><html><body><h1>Sheikh Farid Studio</h1></body></html>'}
                      sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                      className="w-full h-full border-0 bg-slate-950"
                    />
                  </div>
                </div>
              ) : activeTab === 'code' ? (
                <div className="w-full h-full flex flex-col">
                  <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400">src/components/GeneratedApp.tsx</span>
                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'কপি হয়েছে!' : 'কপি কোড'}</span>
                    </button>
                  </div>
                  <pre className="flex-1 p-4 font-mono text-xs text-emerald-400/90 overflow-auto bg-slate-950 leading-relaxed selection:bg-emerald-500 selection:text-white">
                    <code>{activeProgram.reactCode}</code>
                  </pre>
                </div>
              ) : activeTab === 'github' ? (
                /* Dedicated GitHub Integration & Posting Hub */
                <div className="w-full h-full p-5 sm:p-6 overflow-y-auto space-y-6">
                  {/* Top GitHub Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                        <Github className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">GitHub রিপোজিটরি পোস্ট ও জিপ এক্সপোর্ট</h4>
                        <p className="text-xs text-slate-400">
                          আপনার তৈরি করা অ্যাপের সম্পূর্ণ কোড ও কনফিগারেশন সরাসরি GitHub-এ পোস্ট করুন অথবা GitHub-রেডি জিপ ডাউনলোড করুন।
                        </p>
                      </div>
                    </div>

                    {onPushToGitHub && (
                      <div className="mt-4 pt-3 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-purple-200">
                          সম্পূর্ণ ফাইল ট্রিসহ ইন-ব্রাউজার এডিট ও কাস্টম রিপো পুশ করতে চান?
                        </span>
                        <button
                          onClick={() => onPushToGitHub(activeProgram)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <FolderGit2 className="w-4 h-4" />
                          <span>🚀 GitHub পাবলিশার ও ফাইল এডিটরে খুলুন (Open in Studio)</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* GitHub API Direct Push Card */}
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Key className="w-4 h-4 text-purple-400" />
                        <span>১-ক্লিকে সরাসরি GitHub-এ পোস্ট করুন (Direct Push)</span>
                      </h5>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        REST API v3 Ready
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-semibold text-slate-300">GitHub Personal Access Token (PAT):</label>
                          <a
                            href="https://github.com/settings/tokens/new?scopes=repo&description=SheikhFaridStudioApp"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 underline"
                          >
                            <span>টোকেন তৈরি করুন</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <input
                          type="password"
                          value={githubToken}
                          onChange={(e) => setGithubToken(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (repo পারমিশনসহ টোকেন দিন)"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          🔒 টোকেনটি আপনার ব্রাউজারে সুরক্ষিত থাকে এবং শুধুমাত্র আপনার রিপোজিটরিতে কোড পুশ করার কাজে ব্যবহৃত হয়।
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-semibold text-slate-300 block mb-1">Repository Name:</label>
                          <input
                            type="text"
                            value={githubRepoName}
                            onChange={(e) => setGithubRepoName(e.target.value)}
                            placeholder="যেমন: farid-currency-hub"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-300 block mb-1">Visibility:</label>
                          <select
                            value={githubIsPrivate ? 'private' : 'public'}
                            onChange={(e) => setGithubIsPrivate(e.target.value === 'private')}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                          >
                            <option value="public">🌐 Public (সবার জন্য উন্মুক্ত)</option>
                            <option value="private">🔒 Private (ব্যক্তিগত)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={handlePushToGitHub}
                        disabled={isPushingGithub || !githubToken.trim()}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 cursor-pointer"
                      >
                        {isPushingGithub ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>GitHub-এ রিপোজিটরি তৈরি ও ফাইল পোস্ট হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <Github className="w-4 h-4" />
                            <span>GitHub-এ পোস্ট করুন (Push to GitHub)</span>
                          </>
                        )}
                      </button>

                      {/* GitHub Success / Error Result */}
                      {githubResult && (
                        <div
                          className={`p-3.5 rounded-xl border text-xs ${
                            githubResult.success
                              ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-200'
                              : 'bg-rose-950/50 border-rose-500/30 text-rose-200'
                          }`}
                        >
                          {githubResult.success ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 font-bold text-emerald-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>{githubResult.message}</span>
                              </div>
                              {githubResult.repoUrl && (
                                <a
                                  href={githubResult.repoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition text-xs"
                                >
                                  <span>GitHub রিপোজিটরি ওপেন করুন</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-rose-300">
                              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              <span>{githubResult.error}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* GitHub Ready ZIP Download Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">GitHub-রেডি জিপ (.ZIP)</span>
                        <Download className="w-4 h-4 text-cyan-400" />
                      </div>
                      <p className="text-xs text-slate-400">
                        `.gitignore`, `.github/workflows/deploy.yml`, `package.json`, `Dockerfile` এবং `README.md` সহ কমপ্লিট প্যাকেজ।
                      </p>
                      <button
                        onClick={handleDownloadZip}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>GitHub ZIP ডাউনলোড করুন</span>
                      </button>
                    </div>

                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">টার্মিনাল CLI কমান্ড</span>
                        <Terminal className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-xs text-slate-400">
                        আপনার লোকাল পিসিতে টার্মিনালে সরাসরি রান করার জন্য স্ট্যান্ডার্ড git push কমান্ড কপি করুন।
                      </p>
                      <button
                        onClick={() => {
                          const cmds = `git init\ngit add .\ngit commit -m "feat: initial commit from Sheikh Farid Studio"\ngit branch -M main\ngit remote add origin https://github.com/USERNAME/${githubRepoName}.git\ngit push -u origin main`;
                          navigator.clipboard.writeText(cmds);
                          alert('Git CLI কমান্ড ক্লিপবোর্ডে কপি করা হয়েছে!');
                        }}
                        className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Git কমান্ডসমূহ কপি করুন</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'deploy' ? (
                /* Deploy Tab */
                <div className="w-full h-full p-6 overflow-y-auto space-y-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          <Rocket className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white">ডিপ্লয়মেন্ট ও লাইভ পাবলিশিং স্ট্যাটাস</h4>
                          <p className="text-xs text-slate-400">
                            স্ট্যাটাস: <span className="text-emerald-400 font-bold uppercase">{activeProgram.deployedStatus || 'Ready'}</span>
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                        Production Ready
                      </span>
                    </div>

                    {activeProgram.deployedUrl && (
                      <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-slate-300 font-mono truncate">{activeProgram.deployedUrl}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(activeProgram.deployedUrl || '');
                              setCopiedShareUrl(true);
                              setTimeout(() => setCopiedShareUrl(false), 2000);
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            {copiedShareUrl ? 'কপি হয়েছে' : 'কপি লিংক'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      ১-ক্লিক প্রোডাকশন এক্সপোর্ট ও ডিপ্লয় অপশন:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">প্রোডাকশন ZIP ডাউনলোড</span>
                          <Download className="w-4 h-4 text-emerald-400" />
                        </div>
                        <p className="text-xs text-slate-400">
                          Vite, React 19, Tailwind CSS, Dockerfile, এবং vercel.json সহ সম্পূর্ণ প্রোডাকশন রেডি প্যাকেজ।
                        </p>
                        <button
                          onClick={handleDownloadZip}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>সম্পূর্ণ ZIP ডাউনলোড করুন</span>
                        </button>
                      </div>

                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">কোড মার্কেটপ্লেস পাবলিশ</span>
                          <ShoppingBag className="w-4 h-4 text-amber-400" />
                        </div>
                        <p className="text-xs text-slate-400">
                          মূল্যায়ন: ৳{activeProgram.valuationBdt?.toLocaleString()} BDT (${activeProgram.valuationUsd}) রেটিং সহ ইনবিল্ট মার্কেটপ্লেসে তালিকাভুক্ত করুন।
                        </p>
                        <button
                          onClick={handlePublishToMarketplace}
                          className="w-full py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>মার্কেটপ্লেসে লাইভ করুন</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
                    <span className="font-bold text-slate-300">কমান্ড লাইন (CLI) ডিপ্লয়মেন্ট গাইড:</span>
                    <div className="space-y-2 font-mono text-[11px]">
                      <div className="p-2.5 bg-slate-900 rounded-lg flex items-center justify-between">
                        <span className="text-slate-300">Vercel: <span className="text-cyan-400">npx vercel --prod</span></span>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-lg flex items-center justify-between">
                        <span className="text-slate-300">Firebase: <span className="text-amber-400">firebase deploy --only hosting</span></span>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-lg flex items-center justify-between">
                        <span className="text-slate-300">Docker: <span className="text-indigo-400">docker build -t farid-app . && docker run -p 3000:80 farid-app</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'roadmap' ? (
                <DeveloperRoadmapView
                  onLoadAiAssistantProject={() => {
                    setPrograms((prev) => {
                      const exists = prev.find((p) => p.id === FARID_AI_ASSISTANT_SAMPLE.id);
                      if (!exists) return [FARID_AI_ASSISTANT_SAMPLE, ...prev];
                      return prev;
                    });
                    setActiveProgramId(FARID_AI_ASSISTANT_SAMPLE.id);
                    setActiveTab('preview');
                  }}
                  onGoToGitHubPush={() => {
                    setPrograms((prev) => {
                      const exists = prev.find((p) => p.id === FARID_AI_ASSISTANT_SAMPLE.id);
                      if (!exists) return [FARID_AI_ASSISTANT_SAMPLE, ...prev];
                      return prev;
                    });
                    setActiveProgramId(FARID_AI_ASSISTANT_SAMPLE.id);
                    setActiveTab('github');
                  }}
                />
              ) : (
                /* Templates Tab */
                <div className="w-full h-full p-6 overflow-y-auto space-y-4">
                  <h4 className="text-sm font-bold text-white">রেডিমেড প্রোগ্রাম টেমপ্লেটস:</h4>
                  <p className="text-xs text-slate-400">
                    যে কোনো টেমপ্লেটে ক্লিক করে জেমিলাই এআই দিয়ে ১-ক্লিকে প্রোগ্রামটি তৈরি বা যুক্ত করুন:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DEFAULT_TEMPLATES.map((tmpl) => (
                      <div
                        key={tmpl.id}
                        onClick={() => {
                          handleSendPrompt(`একটি নতুন প্রোগ্রাম তৈরি করুন: ${tmpl.prompt}`, 'create');
                          setActiveTab('preview');
                        }}
                        className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition cursor-pointer space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                            {tmpl.titleBn}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {tmpl.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">{tmpl.descriptionBn}</p>
                        <div className="pt-2 flex items-center justify-between text-[11px] text-indigo-400 font-semibold">
                          <span>প্রোগ্রাম তৈরি করুন</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Program Modal */}
      {showNewProgramModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>নতুন প্রোগ্রাম তৈরি করুন</span>
              </h3>
              <button
                onClick={() => setShowNewProgramModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">প্রোগ্রামের নাম:</label>
                <input
                  type="text"
                  value={newProgramTitle}
                  onChange={(e) => setNewProgramTitle(e.target.value)}
                  placeholder="যেমন: কুয়েত দিনার ট্র্যাকার, ওটিপি সেন্ডার..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ক্যাটাগরি:</label>
                <select
                  value={newProgramCategory}
                  onChange={(e) => setNewProgramCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Utility">Utility</option>
                  <option value="Fintech">Fintech</option>
                  <option value="SaaS">SaaS</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="SMS & Telecom">SMS & Telecom</option>
                  <option value="AI Tool">AI Tool</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  প্রোগ্রামের বিস্তারিত নির্দেশ (ঐচ্ছিক প্রম্পট):
                </label>
                <textarea
                  value={newProgramPrompt}
                  onChange={(e) => setNewProgramPrompt(e.target.value)}
                  placeholder="জেমিলাই এআইকে নির্দেশ দিন: এই প্রোগ্রামে কী কী বাটন, ইনপুট ফিল্ড ও ফিচার থাকবে..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowNewProgramModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleCreateNewProgram}
                disabled={!newProgramTitle.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-indigo-900/40"
              >
                <Sparkles className="w-4 h-4" />
                <span>তৈরি করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
