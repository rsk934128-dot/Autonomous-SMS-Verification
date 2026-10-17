import React, { useState, useEffect, useMemo } from 'react';
import {
  Github,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Lock,
  Globe,
  Check,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  FileCode,
  FolderGit2,
  RefreshCw,
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Code2,
  Download,
  Terminal,
  Smartphone,
  Eye,
  LogOut,
  Send,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GitHubUser, GitHubRepo, GitHubFileEntry, SavedGitHubPushRecord } from '../../types/github';
import { ProgramProject } from '../../types/aiStudio';
import { GitHubService } from '../../services/githubService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { TextVerifiedEngine } from '../../services/TextVerifiedEngine';

interface GitHubStudioProps {
  initialProgram?: ProgramProject | null;
  onOpenInGeminiStudio?: (program: ProgramProject) => void;
  onRequestSmsVerification?: (serviceName: string) => void;
}

export const GitHubStudio: React.FC<GitHubStudioProps> = ({
  initialProgram,
  onOpenInGeminiStudio,
  onRequestSmsVerification,
}) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  // Auth State
  const [token, setToken] = useState<string>(() => GitHubService.getStoredToken());
  const [user, setUser] = useState<GitHubUser | null>(() => GitHubService.getStoredUser());
  const [showTokenInput, setShowTokenInput] = useState<boolean>(!GitHubService.getStoredToken());
  const [validatingToken, setValidatingToken] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');

  // Repositories State
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(false);
  const [repoMode, setRepoMode] = useState<'create' | 'existing'>('create');
  const [selectedExistingRepo, setSelectedExistingRepo] = useState<string>('');

  // Project & Repo Form
  const [repoName, setRepoName] = useState<string>(() => {
    if (initialProgram) {
      return initialProgram.title.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 40);
    }
    return 'my-react-app';
  });
  const [repoDescription, setRepoDescription] = useState<string>(() => {
    return initialProgram?.description || 'Autonomous modern web application built with TextVerified & Gemini Studio';
  });
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [branch, setBranch] = useState<string>('main');
  const [commitMessage, setCommitMessage] = useState<string>('Initial commit: Built with TextVerified Hub');

  // Files Editor State
  const [files, setFiles] = useState<GitHubFileEntry[]>(() => {
    if (initialProgram) {
      return GitHubService.generateProjectFiles(initialProgram);
    }
    // Default starter template
    const defaultProg: ProgramProject = {
      id: 'starter-1',
      title: 'Modern Web App',
      description: 'Responsive React + Vite + Tailwind full-stack application',
      category: 'SaaS',
      version: '1.0.0',
      reactCode: `import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-8 h-8 text-slate-950" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
          Welcome to Your New GitHub App
        </h1>
        <p className="text-slate-400 text-sm">
          Deployed cleanly to GitHub with automated CI/CD readiness, responsive Tailwind v4 styles, and modern React 19.
        </p>
        <button
          onClick={() => setCount((c) => c + 1)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Clicked {count} times</span>
        </button>
      </div>
    </div>
  );
}
`,
      previewHtml: '',
      features: ['Modern React 19 SPA', 'Tailwind CSS v4 styling', 'Clean GitHub CI/CD structure'],
      techStack: ['React', 'Vite', 'Tailwind CSS', 'TypeScript'],
      colorTheme: ['#10b981', '#06b6d4'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return GitHubService.generateProjectFiles(defaultProg);
  });

  const [activeFilePath, setActiveFilePath] = useState<string>('src/App.tsx');
  const [newFileName, setNewFileName] = useState<string>('');
  const [isAddingFile, setIsAddingFile] = useState<boolean>(false);

  // Push Operations State
  const [pushing, setPushing] = useState<boolean>(false);
  const [pushStep, setPushStep] = useState<string>('');
  const [pushResult, setPushResult] = useState<{
    success: boolean;
    repoUrl: string;
    commitSha: string;
    commitUrl: string;
    branch: string;
    totalFilesPushed: number;
    error?: string;
  } | null>(null);

  // Push History
  const [pushHistory, setPushHistory] = useState<SavedGitHubPushRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // TextVerified SMS / 2FA helper modal toggle
  const [showSmsHelper, setShowSmsHelper] = useState<boolean>(false);

  // Active File Content
  const activeFile = useMemo(() => {
    return files.find((f) => f.path === activeFilePath) || files[0];
  }, [files, activeFilePath]);

  // Load push history on boot
  useEffect(() => {
    let isMounted = true;
    const loadHist = async () => {
      setLoadingHistory(true);
      const hist = await GitHubService.fetchPushHistory(currentUser?.uid || null);
      if (isMounted) {
        setPushHistory(hist);
        setLoadingHistory(false);
      }
    };
    loadHist();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // If initialProgram changes, regenerate files
  useEffect(() => {
    if (initialProgram) {
      const generated = GitHubService.generateProjectFiles(initialProgram);
      setFiles(generated);
      setRepoName(initialProgram.title.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 40));
      setRepoDescription(initialProgram.description);
      setActiveFilePath('src/App.tsx');
    }
  }, [initialProgram]);

  // Validate Token Handler
  const handleValidateToken = async (patToValidate?: string) => {
    const val = (patToValidate || token).trim();
    if (!val) {
      setAuthError('দয়া করে আপনার GitHub Personal Access Token (PAT) লিখুন।');
      return;
    }

    setValidatingToken(true);
    setAuthError('');

    const res = await GitHubService.validateToken(val);
    setValidatingToken(false);

    if (res.success && res.user) {
      setUser(res.user);
      setShowTokenInput(false);
      // Fetch repos
      handleFetchRepos(val);
    } else {
      setAuthError(res.error || 'GitHub টোকেন ভ্যালিডেশন ব্যর্থ হয়েছে। টোকেন পারমিশন চেক করুন।');
    }
  };

  // Fetch Repos
  const handleFetchRepos = async (authToken?: string) => {
    const t = authToken || token;
    if (!t) return;
    setLoadingRepos(true);
    const res = await GitHubService.fetchUserRepos(t);
    setLoadingRepos(false);
    if (res.success && res.repos) {
      setRepos(res.repos);
      if (res.repos.length > 0 && !selectedExistingRepo) {
        setSelectedExistingRepo(res.repos[0].name);
      }
    }
  };

  // Disconnect GitHub
  const handleDisconnect = () => {
    GitHubService.clearToken();
    setToken('');
    setUser(null);
    setShowTokenInput(true);
    setRepos([]);
  };

  // File Content Editor
  const handleFileContentChange = (newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.path === activeFile.path ? { ...f, content: newContent } : f))
    );
  };

  // Add New File
  const handleAddNewFile = () => {
    if (!newFileName.trim()) return;
    const cleanPath = newFileName.trim().replace(/^\//, '');
    if (files.some((f) => f.path === cleanPath)) {
      alert('File with this path already exists!');
      return;
    }
    const newEntry: GitHubFileEntry = {
      path: cleanPath,
      content: '// New file created in TextVerified Hub\n',
      isCustom: true,
    };
    setFiles((prev) => [...prev, newEntry]);
    setActiveFilePath(cleanPath);
    setNewFileName('');
    setIsAddingFile(false);
  };

  // Delete File
  const handleDeleteFile = (pathToDelete: string) => {
    if (files.length <= 1) {
      alert('You cannot delete the only remaining file.');
      return;
    }
    setFiles((prev) => prev.filter((f) => f.path !== pathToDelete));
    if (activeFilePath === pathToDelete) {
      const remaining = files.filter((f) => f.path !== pathToDelete);
      setActiveFilePath(remaining[0].path);
    }
  };

  // AI Polish README
  const [generatingReadme, setGeneratingReadme] = useState(false);
  const handleGenerateAiReadme = async () => {
    setGeneratingReadme(true);
    const readme = await GitHubService.generateAiReadme({
      title: repoName,
      description: repoDescription,
      techStack: initialProgram?.techStack || ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
      features: initialProgram?.features || ['Responsive UI', 'Modern Stack'],
    });
    setGeneratingReadme(false);
    setFiles((prev) => {
      const hasReadme = prev.some((f) => f.path === 'README.md');
      if (hasReadme) {
        return prev.map((f) => (f.path === 'README.md' ? { ...f, content: readme } : f));
      }
      return [...prev, { path: 'README.md', content: readme }];
    });
    setActiveFilePath('README.md');
  };

  // Push to GitHub Main Handler
  const handlePushToGitHub = async () => {
    if (!token) {
      setShowTokenInput(true);
      setAuthError('প্রথমে GitHub টোকেন দিয়ে লগইন করুন।');
      return;
    }

    const targetRepoName = repoMode === 'create' ? repoName.trim() : selectedExistingRepo;
    if (!targetRepoName) {
      alert('রিপোজিটোরির নাম দিন।');
      return;
    }

    const ownerName = user?.login;
    if (!ownerName) {
      alert('GitHub ব্যবহারকারীর নাম পাওয়া যায়নি। পুনরায় লগইন করুন।');
      return;
    }

    setPushing(true);
    setPushStep('GitHub যাচাই এবং রিপোজিটোরি প্রস্তুত করা হচ্ছে...');
    setPushResult(null);

    try {
      setPushStep('গিট ট্রিতে ফাইল কম্পাইল এবং সাইন করা হচ্ছে...');
      const result = await GitHubService.pushFiles({
        token,
        owner: ownerName,
        repo: targetRepoName,
        branch: branch || 'main',
        commitMessage: commitMessage || 'Deploy from TextVerified Hub',
        files,
        createNewRepo: repoMode === 'create',
        repoDescription,
        isPrivate,
      });

      if (result.success) {
        setPushStep('সফলভাবে গিটহাবে পুশ সম্পন্ন হয়েছে!');
        setPushResult(result);

        // Record to history
        const newRecord: SavedGitHubPushRecord = {
          id: `push-${Date.now()}`,
          repoName: targetRepoName,
          repoUrl: result.repoUrl,
          commitSha: result.commitSha,
          commitUrl: result.commitUrl,
          branch: result.branch,
          commitMessage: commitMessage || 'Deploy from TextVerified Hub',
          filesCount: result.totalFilesPushed,
          createdAt: new Date().toISOString(),
          projectTitle: initialProgram?.title || targetRepoName,
          authorLogin: ownerName,
        };

        await GitHubService.recordPush(currentUser?.uid || null, newRecord);
        setPushHistory((prev) => [newRecord, ...prev]);

        // Celebration confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      } else {
        setPushResult({
          success: false,
          repoUrl: '',
          commitSha: '',
          commitUrl: '',
          branch,
          totalFilesPushed: 0,
          error: result.error || 'Push failed. Please check permissions.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setPushResult({
        success: false,
        repoUrl: '',
        commitSha: '',
        commitUrl: '',
        branch,
        totalFilesPushed: 0,
        error: msg,
      });
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Direct Publisher & Multi-File Editor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              গীতহাব ইন্টিগ্রেশন ও সরাসরি ডিপ্লয় হাব
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              অ্যাপ তৈরি বা এডিট করার পর সরাসরি আপনার নিজস্ব GitHub অ্যাকাউন্টে নতুন রিপোজিটোরি তৈরি করুন, ফাইলগুলো
              ইন-ব্রাউজার এডিট করুন এবং ১-ক্লিকে পুশ করুন।
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowSmsHelper(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 border border-emerald-500/30 text-xs font-semibold shadow-sm transition-all"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>GitHub SMS / 2FA ওটিপি ভেরিফাই</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-2">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-8 h-8 rounded-full border border-emerald-500/50"
                />
                <div className="text-left text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>@{user.login}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-slate-400">{user.public_repos} public repos</div>
                </div>
                <button
                  onClick={handleDisconnect}
                  title="Disconnect GitHub"
                  className="ml-2 text-slate-400 hover:text-rose-400 transition-colors p-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowTokenInput(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Key className="w-4 h-4" />
                <span>GitHub PAT দিয়ে লগইন করুন</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* GitHub Token Setup Modal / Banner if not connected or editing */}
      {(showTokenInput || !user) && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">GitHub অ্যাকাউন্টে লগইন ও পারমিশন</h3>
                <p className="text-xs text-slate-400">
                  আপনার GitHub Personal Access Token (PAT) ইনপুট করুন। এটি দিয়ে নিরাপদে নতুন রিপো তৈরি ও ফাইল পুশ করা
                  হবে।
                </p>
              </div>
            </div>
            {user && (
              <button
                onClick={() => setShowTokenInput(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                বন্ধ করুন
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                GitHub Personal Access Token (PAT)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxx..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>
              {authError && (
                <div className="flex items-center gap-2 text-rose-400 text-xs mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => handleValidateToken()}
                disabled={validatingToken || !token.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                {validatingToken ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>যাচাই হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>কানেক্ট ও যাচাই করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <Key className="w-4 h-4 text-emerald-400" />
              <span>
                টোকেন না থাকলে GitHub Settings থেকে তৈরি করতে পারেন। প্রয়োজনীয় স্কোপ:{' '}
                <strong className="text-emerald-400">repo</strong> ও{' '}
                <strong className="text-emerald-400">read:user</strong>.
              </span>
            </div>
            <a
              href="https://github.com/settings/tokens/new?scopes=repo,read:user&description=TextVerified+Hub+Publisher"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shrink-0 transition-colors"
            >
              <span>GitHub এ টোকেন বানান</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Main Studio Grid: Left Config & File Explorer | Right Code Editor & Push Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Repository & Files Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Repository Target Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <FolderGit2 className="w-4 h-4 text-emerald-400" />
                <span>রিপোজিটোরি সেটিংস</span>
              </div>

              {/* Mode Switcher */}
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setRepoMode('create')}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                    repoMode === 'create'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  নতুন তৈরি
                </button>
                <button
                  onClick={() => {
                    setRepoMode('existing');
                    if (token && repos.length === 0) handleFetchRepos();
                  }}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                    repoMode === 'existing'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  বিদ্যমান রিপো
                </button>
              </div>
            </div>

            {repoMode === 'create' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    রিপোজিটোরির নাম (Repository Name)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-mono text-slate-500">
                      {user?.login ? `${user.login}/` : ''}
                    </span>
                    <input
                      type="text"
                      value={repoName}
                      onChange={(e) =>
                        setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, '-'))
                      }
                      placeholder="e.g. textverified-ai-app"
                      className={`w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono ${
                        user?.login ? 'pl-28' : 'pl-3.5'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    বিবরণ (Description)
                  </label>
                  <input
                    type="text"
                    value={repoDescription}
                    onChange={(e) => setRepoDescription(e.target.value)}
                    placeholder="Short description of your project..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    {isPrivate ? (
                      <Lock className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Globe className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-xs text-slate-300 font-medium">
                      {isPrivate ? 'প্রাইভেট রিপোজিটোরি (Private)' : 'পাবলিক রিপোজিটোরি (Public)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isPrivate ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isPrivate ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    আপনার রিপোজিটোরি নির্বাচন করুন
                  </label>
                  <button
                    onClick={() => handleFetchRepos()}
                    disabled={loadingRepos}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingRepos ? 'animate-spin' : ''}`} />
                    <span>রিফ্রেশ</span>
                  </button>
                </div>

                {loadingRepos ? (
                  <div className="py-6 text-center text-xs text-slate-400">রিপো লোড হচ্ছে...</div>
                ) : repos.length > 0 ? (
                  <select
                    value={selectedExistingRepo}
                    onChange={(e) => setSelectedExistingRepo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    {repos.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name} {r.private ? '🔒' : '🌐'} ({r.default_branch})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-slate-500 bg-slate-950 p-4 rounded-xl text-center">
                    কোন রিপো পাওয়া যায়নি অথবা আপনি টোকেন যুক্ত করেননি।
                  </div>
                )}
              </div>
            )}

            {/* Branch and Commit Message */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  টার্গেট ব্রাঞ্চ (Branch)
                </label>
                <div className="relative">
                  <GitBranch className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  কমিট মেসেজ (Commit Message)
                </label>
                <div className="relative">
                  <GitCommit className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* File Explorer Tree Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-bold text-sm">প্রজেক্ট ফাইল তালিকা ({files.length})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateAiReadme}
                  disabled={generatingReadme}
                  title="Generate enriched README with AI"
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${generatingReadme ? 'animate-spin' : ''}`} />
                  <span>AI README</span>
                </button>

                <button
                  onClick={() => setIsAddingFile(true)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ফাইল যোগ</span>
                </button>
              </div>
            </div>

            {/* Add File Input if open */}
            {isAddingFile && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-300 font-semibold">নতুন ফাইলের পাথ লিখুন:</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="e.g. src/components/Header.tsx"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleAddNewFile}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                  >
                    যোগ
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingFile(false);
                      setNewFileName('');
                    }}
                    className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs"
                  >
                    বাতিল
                  </button>
                </div>
              </div>
            )}

            {/* Files List */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {files.map((f) => {
                const isActive = f.path === activeFilePath;
                const isCode = f.path.endsWith('.tsx') || f.path.endsWith('.ts') || f.path.endsWith('.js');
                const isJson = f.path.endsWith('.json');
                const isMd = f.path.endsWith('.md');

                return (
                  <div
                    key={f.path}
                    onClick={() => setActiveFilePath(f.path)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold shadow-sm'
                        : 'bg-slate-950/60 hover:bg-slate-950 border border-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-xs">
                        {isCode ? '⚛️' : isJson ? '📋' : isMd ? '📖' : '📄'}
                      </span>
                      <span className="truncate font-mono">{f.path}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">
                        {Math.round(f.content.length / 1024 * 10) / 10} KB
                      </span>
                      {f.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(f.path);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Push Trigger (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Code Editor Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-slate-950 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="font-mono text-xs font-semibold text-slate-200">
                  {activeFile.path}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono">
                  {activeFile.content.split('\n').length} lines
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeFile.content);
                    alert('কোড কপি করা হয়েছে!');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>কপি</span>
                </button>
              </div>
            </div>

            {/* Monaco-style Code Textarea */}
            <div className="relative p-2 bg-slate-950 font-mono text-xs">
              <textarea
                value={activeFile.content}
                onChange={(e) => handleFileContentChange(e.target.value)}
                spellCheck={false}
                className="w-full h-[400px] bg-transparent text-slate-200 resize-y p-3 focus:outline-none focus:ring-0 leading-relaxed font-mono selection:bg-emerald-500/30 text-xs"
              />
            </div>

            {/* Push Action Bar */}
            <div className="bg-slate-900/95 border-t border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {repoMode === 'create'
                    ? `নতুন রিপো '${repoName}' তৈরি করে ${files.length}টি ফাইল পুশ করা হবে`
                    : `বিদ্যমান রিপো '${selectedExistingRepo}' এ পুশ করা হবে`}
                </span>
              </div>

              <button
                onClick={handlePushToGitHub}
                disabled={pushing || !token}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {pushing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{pushStep || 'গিটহাবে পুশ হচ্ছে...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>🚀 গিটহাবে পুশ করুন (Push to GitHub)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Push Result Success Modal / Alert */}
          {pushResult && (
            <div
              className={`rounded-3xl p-6 border shadow-2xl transition-all ${
                pushResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    pushResult.success
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {pushResult.success ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertCircle className="w-6 h-6" />
                  )}
                </div>

                <div className="space-y-3 flex-1">
                  <div>
                    <h4 className="text-base font-extrabold">
                      {pushResult.success
                        ? 'অভিনন্দন! আপনার অ্যাপ গিটহাবে সফলভাবে পুশ হয়েছে 🎉'
                        : 'গিটহাবে পুশ করার সময় ত্রুটি দেখা দিয়েছে'}
                    </h4>
                    <p className="text-xs opacity-80 mt-1">
                      {pushResult.success
                        ? `${pushResult.totalFilesPushed}টি ফাইল সফলভাবে '${pushResult.branch}' ব্রাঞ্চে কমিট হয়েছে।`
                        : pushResult.error}
                    </p>
                  </div>

                  {pushResult.success && (
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={pushResult.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub এ প্রজেক্ট দেখুন</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={pushResult.commitUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all font-mono"
                      >
                        <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Commit: {pushResult.commitSha.slice(0, 7)}</span>
                      </a>

                      <a
                        href={`https://github.dev/${user?.login}/${repoMode === 'create' ? repoName : selectedExistingRepo}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
                      >
                        <Code2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Codespaces এ খুলুন</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Push History Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">গিটহাব পুশ ইতিহাস (Push History)</h3>
          </div>
          <span className="text-xs text-slate-400">{pushHistory.length}টি রেকর্ড সংরক্ষিত</span>
        </div>

        {pushHistory.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            এখনও কোন প্রজেক্ট গিটহাবে পুশ করা হয়নি। উপরে প্রজেক্ট প্রস্তুত করে 'গিটহাবে পুশ করুন' বাটনে ক্লিক করুন।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pushHistory.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs truncate max-w-[180px]">
                    {item.repoName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-400 text-xs line-clamp-1">{item.commitMessage}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 font-mono">
                  <span>{item.filesCount} files ({item.branch})</span>
                  <a
                    href={item.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GitHub SMS / OTP 2FA Helper Modal */}
      {showSmsHelper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">GitHub SMS / 2FA ভেরিফিকেশন হেল্পার</h3>
                  <p className="text-xs text-slate-400">TextVerified Hub দিয়ে ওটিপি গ্রহণ ও ভেরিফাই করুন</p>
                </div>
              </div>
              <button
                onClick={() => setShowSmsHelper(false)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>GitHub 2FA / ফোন ভেরিফিকেশন কীভাবে করবেন:</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-400">
                  <li>GitHub একাউন্ট তৈরি বা টু-ফ্যাক্টর অথেনটিকেশনের সময় ফোন ভেরিফিকেশন চাইলে 'GitHub' নির্বাচন করুন।</li>
                  <li>আমাদের SMS ভেরিফিকেশন প্যানেল থেকে রিয়েল ইউএসএ ফোন নম্বর তাৎক্ষণিক রিসিভ করুন।</li>
                  <li>GitHub থেকে আসা ওটিপি অটোমেটিক ডিটেক্ট হয়ে যাবে ও স্বয়ংক্রিয় কপি হয়ে যাবে।</li>
                </ol>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowSmsHelper(false);
                    if (onRequestSmsVerification) {
                      onRequestSmsVerification('GitHub');
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>SMS ভেরিফিকেশন শুরু করুন (Start Verification)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
