import React from 'react';
import {
  FolderTree,
  Download,
  Database,
  CheckCheck,
  Key,
  GraduationCap,
  Sparkles,
  Palette,
} from 'lucide-react';
import { ApiConnectionState } from '../types';

export type AppTab = 'explorer' | 'queue' | 'vault' | 'auditor';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  apiState: ApiConnectionState;
  onOpenApiKeyModal: () => void;
  onOpenUiOptionsModal: () => void;
  selectedResourceCount: number;
  queueCount: number;
  offlineCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  apiState,
  onOpenApiKeyModal,
  onOpenUiOptionsModal,
  selectedResourceCount,
  queueCount,
  offlineCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Banner Row */}
        <div className="flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-slate-800/60">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Oak KS3 Downloader
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <Sparkles className="w-3 h-3" /> Key Stage 3
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Curriculum Hierarchy Preserver & Nested Metadata Downloader
              </p>
            </div>
          </div>

          {/* Right Controls: API Key Pill & Quick Stats */}
          <div className="flex items-center gap-3">
            
            {/* Quick Stats Pill */}
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Selected:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedResourceCount}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Queue:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{queueCount}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Vault:</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{offlineCount}</span>
              </div>
            </div>

            {/* API Key Connection Button */}
            <button
              onClick={onOpenApiKeyModal}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border shadow-2xs ${
                apiState.isValid
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                  : apiState.apiKey
                  ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>
                {apiState.isValid
                  ? 'Oak API Verified'
                  : apiState.apiKey
                  ? 'Key Pending Test'
                  : 'Demo / Local Engine'}
              </span>
            </button>

            {/* UI Customization Options Button */}
            <button
              onClick={onOpenUiOptionsModal}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-xs"
              title="Change UI Theme & View Options"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">UI Options</span>
            </button>

          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'explorer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            Curriculum Explorer
            {selectedResourceCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'explorer' ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}>
                {selectedResourceCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'queue'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            Batch Downloader & ZIP
            {queueCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'queue' ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
              }`}>
                {queueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'vault'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            Offline Library Vault
            {offlineCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'vault' ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
              }`}>
                {offlineCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('auditor')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'auditor'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCheck className="w-4 h-4" />
            Structure & Naming Auditor
          </button>

        </div>

      </div>
    </header>
  );
};
