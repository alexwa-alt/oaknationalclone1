import React, { useState } from 'react';
import {
  Download,
  FolderArchive,
  Settings2,
  FolderTree,
} from 'lucide-react';
import {
  FolderStructureConfig,
  OakSubject,
} from '../types';
import { createHierarchyZip } from '../utils/folderStructure';

interface BatchDownloadManagerProps {
  subjects: OakSubject[];
  folderConfig: FolderStructureConfig;
  onUpdateFolderConfig: (config: FolderStructureConfig) => void;
}

export const BatchDownloadManager: React.FC<BatchDownloadManagerProps> = ({
  subjects,
  folderConfig,
  onUpdateFolderConfig,
}) => {
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [zipStatusText, setZipStatusText] = useState('');

  // Handle Export ZIP Action
  const handleExportZip = async () => {
    setIsGeneratingZip(true);
    setZipProgress(0);
    setZipStatusText('Initializing empty lesson folders...');

    try {
      const zipBlob = await createHierarchyZip(subjects, folderConfig, (percent, currentPath) => {
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
              Export the Key Stage 3 folder hierarchy. Lesson folders are intentionally empty; no resource files or metadata are included.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportZip}
              disabled={subjects.length === 0 || isGeneratingZip}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              {isGeneratingZip ? `Packaging ZIP (${zipProgress}%)...` : 'Export Empty Folder Hierarchy'}
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

            {/* Folder options */}
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

            </div>

            {/* Directory Live Preview Box */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Live Output Hierarchy Sample:</p>
              <div className="p-3 bg-slate-950 text-slate-300 font-mono text-[10px] rounded-xl leading-relaxed border border-slate-800 space-y-1">
                <div className="text-emerald-400 font-bold">{folderConfig.rootFolderName}/</div>
                <div>└── Year_7/</div>
                <div>&nbsp;&nbsp;&nbsp;&nbsp;└── Unit_01_Algebra/</div>
                <div className="text-amber-300">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Lesson_01_Intro/</div>
                <div className="text-slate-500">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(empty)</div>
              </div>
            </div>

          </div>
        </div>

        {/* Hierarchy scope */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-8 text-center space-y-3">
              <FolderArchive className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Ready to export {subjects.length} curriculum subject{subjects.length === 1 ? '' : 's'}
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                The archive contains only Year, Unit, and Lesson folders. No lesson resources, sidecars, manifests, or README files are generated.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
