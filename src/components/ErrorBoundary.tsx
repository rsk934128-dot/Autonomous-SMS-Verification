import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('tv_gemini_programs');
      localStorage.removeItem('tv_local_sessions');
    } catch (e) {
      console.warn('Storage clear note:', e);
    }
    window.location.reload();
  };

  private handleFullClear = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
    } catch (e) {
      console.warn('Full clear note:', e);
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 antialiased">
          <div className="max-w-lg w-full bg-slate-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto text-2xl font-bold shadow-lg shadow-rose-950/50">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-black text-white tracking-tight">
                অ্যাপ রান করতে সমস্যা হয়েছে
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                ব্রাউজারে সংরক্ষিত পুরনো স্টেট বা ক্যাশ ডেটার অমিলের কারণে এই ত্রুটি ঘটেছে। নিচের বোতামগুলোতে ক্লিক করে তাৎক্ষণিক স্বাভাবিক অবস্থায় ফিরে যান:
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left font-mono text-[11px] text-rose-300/80 overflow-x-auto max-h-24">
                {this.state.error.toString()}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/30 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>রিলোড ও রিকভার করুন</span>
              </button>

              <button
                onClick={this.handleFullClear}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>সম্পূর্ণ ক্যাশ রিসেট</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
