import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, RefreshCw, X, ShieldCheck, ExternalLink } from 'lucide-react';
import { ApiConnectionState } from '../types';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiState: ApiConnectionState;
  onSaveKey: (key: string) => Promise<void>;
  onTestConnection: () => Promise<void>;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiState,
  onSaveKey,
  onTestConnection,
}) => {
  const [inputKey, setInputKey] = useState(apiState.apiKey);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSaveKey(inputKey);
    await onTestConnection();
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Oak API Credentials</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configure your Oak National Academy API Key</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            apiState.isValid
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : apiState.apiKey
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            {apiState.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : apiState.apiKey ? (
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            )}
            <div className="text-sm space-y-1">
              <p className="font-semibold">
                {apiState.isValid
                  ? 'Connected to Oak National Academy API'
                  : apiState.apiKey
                  ? 'Custom API Key Configured'
                  : 'Demo / Local KS3 Engine Active'}
              </p>
              <p className="text-xs opacity-90 leading-relaxed">
                {apiState.isValid
                  ? 'Your key is verified. You have live access to Oak curriculum endpoints for Key Stage 3.'
                  : apiState.apiKey
                  ? 'Key entered. Click "Test Connection" to verify endpoint response.'
                  : 'You are using the built-in offline KS3 dataset covering Mathematics, Science, English, History, Geography, Computing, and Languages.'}
              </p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Oak API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Paste your Oak National Academy API key here..."
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono"
              />
              {inputKey && (
                <button
                  type="button"
                  onClick={() => setInputKey('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Keys are free under Open Government Licence v3.0</span>
              <a
                href="https://www.thenational.academy/teachers/curriculum-api"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                Request Free API Key <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onTestConnection}
              disabled={apiState.isValidating}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${apiState.isValidating ? 'animate-spin text-emerald-600' : ''}`} />
              Test Connection
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                {isSaving ? 'Saving...' : 'Save & Update'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
