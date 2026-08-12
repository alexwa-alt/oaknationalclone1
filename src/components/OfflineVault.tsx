import React, { useState } from 'react';
import {
  Database,
  Search,
  Trash2,
  Eye,
  FileText,
  FileQuestion,
  FileCode,
  FileVideo,
  CheckCircle2,
  XCircle,
  X,
  Sparkles,
  Download,
  Info,
  BookOpen,
} from 'lucide-react';
import { StoredOfflineFile, ResourceType } from '../types';

interface OfflineVaultProps {
  offlineFiles: StoredOfflineFile[];
  onDeleteOfflineFile: (id: string) => Promise<void>;
  onClearAllOfflineFiles: () => Promise<void>;
}

export const OfflineVault: React.FC<OfflineVaultProps> = ({
  offlineFiles,
  onDeleteOfflineFile,
  onClearAllOfflineFiles,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewingFile, setPreviewingFile] = useState<StoredOfflineFile | null>(null);
  
  // Interactive Quiz state
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizScore, setShowQuizScore] = useState(false);

  // Filtered files
  const filteredFiles = offlineFiles.filter((file) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      file.filename.toLowerCase().includes(term) ||
      file.computedPath.toLowerCase().includes(term) ||
      file.sidecarMetadata.subject.title.toLowerCase().includes(term) ||
      file.sidecarMetadata.unit.title.toLowerCase().includes(term) ||
      file.sidecarMetadata.lesson.title.toLowerCase().includes(term)
    );
  });

  const totalVaultBytes = offlineFiles.reduce((acc, f) => acc + f.fileSizeBytes, 0);
  const totalVaultMB = (totalVaultBytes / (1024 * 1024)).toFixed(1);

  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'slidedeck':
        return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'worksheet':
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'quiz':
        return <FileQuestion className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'transcript':
        return <FileCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <FileVideo className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    }
  };

  const openPreview = (file: StoredOfflineFile) => {
    setPreviewingFile(file);
    setActiveQuizIndex(0);
    setSelectedQuizAnswers({});
    setShowQuizScore(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-purple-800/40 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold tracking-tight">Offline Library Vault</h2>
            </div>
            <p className="text-xs text-slate-300">
              Curriculum resources cached locally in your browser IndexedDB storage for offline classroom presentation &amp; study.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-700/60 text-xs font-semibold text-purple-200">
              {offlineFiles.length} Saved Files ({totalVaultMB} MB)
            </div>
            {offlineFiles.length > 0 && (
              <button
                onClick={onClearAllOfflineFiles}
                className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Purge Vault
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 absolute left-3.5 top-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved offline materials..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {/* Files Grid / List */}
      {filteredFiles.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Database className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No offline materials saved in vault
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You can save selected items to your Offline Vault from the <strong>Batch Downloader</strong> tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                    {renderTypeIcon(file.sidecarMetadata.type)}
                    {file.sidecarMetadata.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {(file.fileSizeBytes / 1024).toFixed(0)} KB
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {file.filename}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {file.sidecarMetadata.subject.title} &gt; {file.sidecarMetadata.unit.title}
                </p>

                <p className="font-mono text-[10px] text-slate-400 truncate pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  {file.computedPath}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => openPreview(file)}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview / Run
                </button>

                <button
                  onClick={() => onDeleteOfflineFile(file.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  title="Remove from Offline Vault"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                {renderTypeIcon(previewingFile.sidecarMetadata.type)}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {previewingFile.filename}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {previewingFile.sidecarMetadata.subject.title} • {previewingFile.sidecarMetadata.lesson.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewingFile(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* Interactive Quiz Mode */}
              {previewingFile.sidecarMetadata.type === 'quiz' ? (
                <div className="space-y-4">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-purple-700 dark:text-purple-300 font-medium">
                    Offline Interactive Quiz Player • Oak National Academy Standard
                  </div>

                  {/* Sample Quiz Question Display */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Q1. Which expression or concept is core to this lesson?
                    </p>
                    <div className="space-y-2">
                      {['Core option A (Correct)', 'Distractor B', 'Distractor C', 'Distractor D'].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedQuizAnswers((prev) => ({ ...prev, 0: i }))}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                            selectedQuizAnswers[0] === i
                              ? 'bg-purple-600 text-white border-purple-600 font-bold'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                /* Text / Document Reader */
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-2 border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Lesson Objectives:
                    </p>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                      {previewingFile.sidecarMetadata.lesson.learningObjectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                    {previewingFile.textData || `OAK NATIONAL ACADEMY RESOURCE DOCUMENT
Filename: ${previewingFile.filename}
Path: ${previewingFile.computedPath}
License: ${previewingFile.sidecarMetadata.licensing.licenseName}
Publisher: ${previewingFile.sidecarMetadata.licensing.publisher}

This file is cached offline in your browser for classroom presentation.`}
                  </pre>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end">
              <button
                onClick={() => setPreviewingFile(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300"
              >
                Close Viewer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
