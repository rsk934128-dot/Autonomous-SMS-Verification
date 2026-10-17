import { GitHubUser, GitHubRepo, GitHubFileEntry, GitHubPushRequest, GitHubPushResponse, SavedGitHubPushRecord } from '../types/github';
import { ProgramProject } from '../types/aiStudio';
import { collection, doc, setDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

const GITHUB_TOKEN_KEY = 'tv_github_pat_token';
const GITHUB_USER_KEY = 'tv_github_user_cache';
const GITHUB_HISTORY_KEY = 'tv_github_push_history';

export class GitHubService {
  /**
   * Get cached token from localStorage
   */
  static getStoredToken(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(GITHUB_TOKEN_KEY) || '';
  }

  /**
   * Save token to localStorage
   */
  static saveToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(GITHUB_TOKEN_KEY, token.trim());
    }
  }

  /**
   * Clear GitHub session
   */
  static clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GITHUB_TOKEN_KEY);
      localStorage.removeItem(GITHUB_USER_KEY);
    }
  }

  /**
   * Get cached user
   */
  static getStoredUser(): GitHubUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(GITHUB_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Validate PAT token against server proxy /api/github/validate-token
   */
  static async validateToken(token: string): Promise<{ success: boolean; user?: GitHubUser; scopes?: string[]; error?: string }> {
    try {
      const res = await fetch('/api/github/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'GitHub Authentication failed' };
      }

      if (typeof window !== 'undefined' && data.user) {
        localStorage.setItem(GITHUB_USER_KEY, JSON.stringify(data.user));
        localStorage.setItem(GITHUB_TOKEN_KEY, token.trim());
      }

      return { success: true, user: data.user, scopes: data.scopes };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * List user's GitHub Repositories
   */
  static async fetchUserRepos(token: string): Promise<{ success: boolean; repos?: GitHubRepo[]; error?: string }> {
    try {
      const res = await fetch('/api/github/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to fetch repositories' };
      }

      return { success: true, repos: data.repos || [] };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Create a new GitHub repository
   */
  static async createRepo(
    token: string,
    name: string,
    description: string,
    isPrivate: boolean = false
  ): Promise<{ success: boolean; repo?: any; error?: string }> {
    try {
      const res = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim(), name, description, isPrivate, autoInit: true }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to create repository' };
      }

      return { success: true, repo: data.repo };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }

  /**
   * Push full file bundle to GitHub repository
   */
  static async pushFiles(payload: GitHubPushRequest): Promise<GitHubPushResponse> {
    try {
      const res = await fetch('/api/github/push-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          repoUrl: '',
          commitSha: '',
          commitUrl: '',
          branch: payload.branch || 'main',
          totalFilesPushed: 0,
          error: data.error || 'Failed to push files to GitHub repository.',
        };
      }

      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        repoUrl: '',
        commitSha: '',
        commitUrl: '',
        branch: payload.branch || 'main',
        totalFilesPushed: 0,
        error: msg,
      };
    }
  }

  /**
   * AI-generated GitHub README
   */
  static async generateAiReadme(params: {
    title: string;
    description: string;
    category?: string;
    techStack?: string[];
    features?: string[];
  }): Promise<string> {
    try {
      const res = await fetch('/api/github/ai-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (data.success && data.readme) {
        return data.readme;
      }
    } catch (e) {
      console.warn('AI README generation fallback', e);
    }

    return `# ${params.title}\n\n${params.description}\n\n## Built with TextVerified Hub & React.`;
  }

  /**
   * Transform a ProgramProject or Custom App into standard GitHub project files
   */
  static generateProjectFiles(program: ProgramProject): GitHubFileEntry[] {
    const slug = program.title.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const safeTitle = program.title.replace(/"/g, '\\"');

    // 1. package.json
    const packageJson = JSON.stringify(
      {
        name: slug,
        private: true,
        version: program.version || '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'tsc -b && vite build',
          preview: 'vite preview',
        },
        dependencies: {
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          'lucide-react': '^0.546.0',
          'canvas-confetti': '^1.9.4',
        },
        devDependencies: {
          '@types/react': '^19.0.0',
          '@types/react-dom': '^19.0.0',
          '@types/canvas-confetti': '^1.9.0',
          '@vitejs/plugin-react': '^5.0.0',
          tailwindcss: '^4.0.0',
          typescript: '^5.8.0',
          vite: '^6.2.0',
        },
      },
      null,
      2
    );

    // 2. index.html
    const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="description" content="${program.description.replace(/"/g, '&quot;')}" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <link rel="manifest" href="/manifest.webmanifest" />
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

    // 3. vite.config.ts
    const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
`;

    // 4. tsconfig.json
    const tsconfig = `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`;

    // 5. .gitignore
    const gitignore = `# Logs
logs
*.log
npm-debug.log*

# Node modules
node_modules/
dist/
dist-ssr
*.local

# Editor directories
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.env
`;

    // 6. src/main.tsx
    const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

    // 7. src/index.css
    const indexCss = `@import "tailwindcss";

@layer base {
  body {
    @apply bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
}
`;

    // 8. manifest.webmanifest
    const webmanifest = JSON.stringify(
      {
        name: program.title,
        short_name: program.title.slice(0, 12),
        start_url: '/',
        display: 'standalone',
        background_color: '#020617',
        theme_color: '#10b981',
        description: program.description,
      },
      null,
      2
    );

    // 9. README.md
    const readmeMd = `# ${program.title}

> ${program.description}

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)

---

## ✨ Features
${program.features.map((f) => `- ✅ ${f}`).join('\n')}

## 🛠️ Tech Stack
${program.techStack.map((t) => `- ⚡ **${t}**`).join('\n')}

---

## 🚀 Getting Started

### 1. Clone & Install
\`\`\`bash
git clone https://github.com/USER_OR_ORG/${slug}.git
cd ${slug}
npm install
\`\`\`

### 2. Run Local Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
\`\`\`bash
npm run build
\`\`\`

---

## 📄 License
This project is open-source under the **MIT License**. Created with **TextVerified Hub & Gemini AI Studio**.
`;

    // 10. src/App.tsx
    let appTsx = program.reactCode.trim();
    if (!appTsx.includes('export default')) {
      appTsx += '\n\nexport default App;\n';
    }

    return [
      { path: 'package.json', content: packageJson },
      { path: 'index.html', content: indexHtml },
      { path: 'vite.config.ts', content: viteConfig },
      { path: 'tsconfig.json', content: tsconfig },
      { path: '.gitignore', content: gitignore },
      { path: 'src/main.tsx', content: mainTsx },
      { path: 'src/App.tsx', content: appTsx },
      { path: 'src/index.css', content: indexCss },
      { path: 'public/manifest.webmanifest', content: webmanifest },
      { path: 'README.md', content: readmeMd },
    ];
  }

  /**
   * Save push record to Firestore and localStorage
   */
  static async recordPush(userId: string | null, record: SavedGitHubPushRecord) {
    // 1. LocalStorage
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(GITHUB_HISTORY_KEY);
        const list: SavedGitHubPushRecord[] = raw ? JSON.parse(raw) : [];
        list.unshift(record);
        localStorage.setItem(GITHUB_HISTORY_KEY, JSON.stringify(list.slice(0, 30)));
      } catch (e) {
        console.warn('Failed to save push to localStorage', e);
      }
    }

    // 2. Firestore
    if (userId) {
      try {
        const ref = doc(db, 'users', userId, 'githubProjects', record.id);
        await setDoc(ref, record);
      } catch (e) {
        console.warn('Failed saving github push record to firestore', e);
      }
    }
  }

  /**
   * Fetch push history
   */
  static async fetchPushHistory(userId: string | null): Promise<SavedGitHubPushRecord[]> {
    const localList: SavedGitHubPushRecord[] = [];
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(GITHUB_HISTORY_KEY);
        if (raw) {
          localList.push(...JSON.parse(raw));
        }
      } catch (e) {
        console.warn('Local history read error', e);
      }
    }

    if (!userId) return localList;

    try {
      const q = query(collection(db, 'users', userId, 'githubProjects'), orderBy('createdAt', 'desc'), limit(25));
      const snap = await getDocs(q);
      const cloudList: SavedGitHubPushRecord[] = [];
      snap.forEach((d) => {
        cloudList.push(d.data() as SavedGitHubPushRecord);
      });
      if (cloudList.length > 0) {
        return cloudList;
      }
    } catch (e) {
      console.warn('Cloud history fetch error:', e);
    }

    return localList;
  }
}
