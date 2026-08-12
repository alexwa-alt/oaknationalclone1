import React, { useState } from 'react';
import {
  Download,
  FolderArchive,
  Settings2,
  Trash2,
  RefreshCw,
  FolderTree,
  FileJson,
  FileText,
  AlertCircle,
  Database,
  Play,
  CheckCircle2,
} from 'lucide-react';
import {
  DownloadQueueItem,
  FolderStructureConfig,
} from '../types';
import { createZipFromQueue } from '../utils/folderStructure';

interface BatchDownloadManagerProps {
  queueItems: DownloadQueueItem[];
  folderConfig: FolderStructureConfig;
  onUpdateFolderConfig: (config: FolderStructureConfig) => void;
  onClearQueue: () => void;
  onRemoveQueueItem: (id: string) => void;
  onSaveItemsToOfflineVault: (items: DownloadQueueItem[]) => Promise<void>;
}

export const BatchDownloadManager: React.FC<BatchDownloadManagerProps> = ({
  queueItems,
  folderConfig,
  onUpdateFolderConfig,
  onClearQueue,
  onRemoveQueueItem,
  onSaveItemsToOfflineVault,
}) => {
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [zipStatusText, setZipStatusText] = useState('');
  const [isSavingToVault, setIsSavingToVault] = useState(false);
  const [vaultSuccessMessage, setVaultSuccessMessage] = useState('');

  // Total size calculation
  const totalQueueBytes = queueItems.reduce((acc, item) => acc + item.resource.fileSizeBytes, 0);
  const totalQueueMB = (totalQueueBytes / (1024 * 1024)).toFixed(1);

  // Handle Export ZIP Action
  const handleExportZip = async () => {
    if (queueItems.length === 0) return;
    setIsGeneratingZip(true);
    setZipProgress(0);
    setZipStatusText('Initializing folder hierarchy and sidecar metadata...');

    try {
      const zipBlob = await createZipFromQueue(queueItems, folderConfig, (percent, currentPath) => {
        setZipProgress(percent);
        setZipStatusText(`Packaging: ${currentPath.split('/').pop()}`);
      });

      // Trigger download
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderConfig.rootFolderName || 'Oak_KS3'}_Export.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setZipStatusText('ZIP archive successfully downloaded!');
    } catch (err) {
      console.error('Error packaging ZIP archive:', err);
      setZipStatusText('Failed to build ZIP archive. Please try again.');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  // Handle Save to Offline Vault
  const handleSaveToVault = async () => {
    if (queueItems.length === 0) return;
    setIsSavingToVault(true);
    setVaultSuccessMessage('');

    try {
      await onSaveItemsToOfflineVault(queueItems);
      setVaultSuccessMessage(`Successfully saved ${queueItems.length} resources to your browser's Offline Vault!`);
      setTimeout(() => setVaultSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Error saving to vault:', err);
    } finally {
      setIsSavingToVault(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Main Actions */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md border border-slate-700/60 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FolderArchive className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold tracking-tight">Batch Downloader & Folder Exporter</h2>
            </div>
            <p className="text-xs text-slate-300">
              Preserve exact Oak National Academy Key Stage 3 folder hierarchy with sidecar metadata files for offline school access.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToVault}
              disabled={queueItems.length === 0 || isSavingToVault}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 shadow-xs"
            >
              <Database className="w-4 h-4" />
              {isSavingToVault ? 'Saving to Vault...' : 'Save to Offline Vault'}
            </button>

            <button
              onClick={handleExportZip}
              disabled={queueItems.length === 0 || isGeneratingZip}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              {isGeneratingZip ? `Packaging ZIP (${zipProgress}%)...` : 'Export Organized ZIP Archive'}
            </button>
          </div>
        </div>

        {/* Progress Bar for ZIP */}
        {isGeneratingZip && (
          <div className="space-y-1.5 pt-2 border-t border-slate-700/80">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span className="truncate max-w-md">{zipStatusText}</span>
              <span>{zipProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-200"
                style={{ width: `${zipProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Message Banner */}
        {vaultSuccessMessage && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{vaultSuccessMessage}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Folder Hierarchy Configuration Settings */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Settings2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Folder Rules & Structure</h3>
            </div>

            {/* Root Folder Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Root Folder Name
              </label>
              <input
                type="text"
                value={folderConfig.rootFolderName}
                onChange={(e) =>
                  onUpdateFolderConfig({ ...folderConfig, rootFolderName: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Subject Format */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject Folder Naming
              </label>
              <select
                value={folderConfig.subjectFolderFormat}
                onChange={(e) =>
                  onUpdateFolderConfig({
                    ...folderConfig,
                    subjectFolderFormat: e.target.value as FolderStructureConfig['subjectFolderFormat'],
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="Title">Title (e.g. Mathematics)</option>
                <option value="slug">Slug (e.g. maths)</option>
                <option value="Title_Slug">Title + Slug (e.g. Mathematics_(maths))</option>
              </select>
            </div>

            {/* Unit Format */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Unit Folder Naming
              </label>
              <select
                value={folderConfig.unitFolderFormat}
                onChange={(e) =>
                  onUpdateFolderConfig({
                    ...folderConfig,
                    unitFolderFormat: e.target.value as FolderStructureConfig['unitFolderFormat'],
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="UnitNum_Title">Numbered Prefix (e.g. Unit_01_Algebra)</option>
                <option value="Title">Title Only (e.g. Algebra)</option>
                <option value="slug">Slug Only</option>
              </select>
            </div>

            {/* Lesson Format */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Lesson Folder Naming
              </label>
              <select
                value={folderConfig.lessonFolderFormat}
                onChange={(e) =>
                  onUpdateFolderConfig({
                    ...folderConfig,
                    lessonFolderFormat: e.target.value as FolderStructureConfig['lessonFolderFormat'],
                  })
                }
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="LessonNum_Title">Numbered Prefix (e.g. Lesson_01_Intro)</option>
                <option value="Title">Title Only</option>
                <option value="slug">Slug Only</option>
              </select>
            </div>

            {/* Switches for Metadata Sidecars & Folders */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-blue-600" /> Preserved Year Folders (Y7, Y8, Y9)
                </span>
                <input
                  type="checkbox"
                  checked={folderConfig.includeYearFolder !== false}
                  onChange={(e) =>
                    onUpdateFolderConfig({
                      ...folderConfig,
                      includeYearFolder: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileJson className="w-3.5 h-3.5 text-emerald-600" /> Sidecar .metadata.json
                </span>
                <input
                  type="checkbox"
                  checked={folderConfig.generateSidecarMetadata}
                  onChange={(e) =>
                    onUpdateFolderConfig({
                      ...folderConfig,
                      generateSidecarMetadata: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" /> Subject README.md Catalog
                </span>
                <input
                  type="checkbox"
                  checked={folderConfig.generateSubjectReadme}
                  onChange={(e) =>
                    onUpdateFolderConfig({
                      ...folderConfig,
                      generateSubjectReadme: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-purple-600" /> Root manifest.json Index
                </span>
                <input
                  type="checkbox"
                  checked={folderConfig.generateRootManifest}
                  onChange={(e) =>
                    onUpdateFolderConfig({
                      ...folderConfig,
                      generateRootManifest: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>

            </div>

            {/* Directory Live Preview Box */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Live Output Hierarchy Sample:</p>
              <div className="p-3 bg-slate-950 text-slate-300 font-mono text-[10px] rounded-xl leading-relaxed border border-slate-800 space-y-1">
                <div className="text-emerald-400 font-bold">{folderConfig.rootFolderName}/</div>
                <div>├── manifest.json</div>
                <div>└── Mathematics/</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;├── README.md</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;└── Unit_01_Algebra/</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Lesson_01_Intro/</div>
                <div className="text-amber-300">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── slide_deck.pdf</div>
                <div className="text-slate-500">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── slide_deck.pdf.metadata.json</div>
              </div>
            </div>

          </div>
        </div>

        {/* Right 2 Cols: Queue Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            
            {/* Table Header Controls */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Queue</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  {queueItems.length} items • {totalQueueMB} MB
                </span>
              </div>

              {queueItems.length > 0 && (
                <button
                  onClick={onClearQueue}
                  className="px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Queue
                </button>
              )}
            </div>

            {/* Table or Empty State */}
            {queueItems.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <FolderArchive className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Your Download Queue is empty
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Go to the <strong>Curriculum Explorer</strong> tab, select Key Stage 3 subjects, units, or lessons, and click &quot;Add Selected to Batch Downloader Queue&quot;.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[520px] overflow-y-auto">
                {queueItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {item.resource.title}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400 truncate">
                        {item.computedPath}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="capitalize font-bold text-emerald-600 dark:text-emerald-400">{item.resource.type}</span>
                        <span>•</span>
                        <span>{(item.resource.fileSizeBytes / 1024).toFixed(0)} KB</span>
                        <span>•</span>
                        <span>License: OGL v3.0</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveQueueItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Remove from Queue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
