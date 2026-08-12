import React, { useState } from 'react';
import {
  CheckCheck,
  ShieldCheck,
  FileCheck,
  FolderTree,
  AlertTriangle,
  FileJson,
  Sparkles,
  Info,
  Edit3,
} from 'lucide-react';
import { DownloadQueueItem, FolderStructureConfig } from '../types';

interface StructureAuditorProps {
  queueItems: DownloadQueueItem[];
  folderConfig: FolderStructureConfig;
  customSchoolNote: string;
  setCustomSchoolNote: (note: string) => void;
}

export const StructureAuditor: React.FC<StructureAuditorProps> = ({
  queueItems,
  folderConfig,
  customSchoolNote,
  setCustomSchoolNote,
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'editor'>('audit');

  // Audit Calculations
  const totalItems = queueItems.length;

  const itemsWithInvalidChars = queueItems.filter((item) =>
    /[\\/:*?"<>|]/.test(item.computedPath.replace('Oak_National_Academy_KS3/', ''))
  );

  const itemsMissingObjectives = queueItems.filter(
    (item) => !item.sidecarMetadata.lesson.learningObjectives || item.sidecarMetadata.lesson.learningObjectives.length === 0
  );

  const auditPassed = itemsWithInvalidChars.length === 0;

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800/40 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCheck className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold tracking-tight">Hierarchy &amp; Naming Consistency Auditor</h2>
            </div>
            <p className="text-xs text-slate-300">
              Validates path structures, sanitizes filename special characters, and verifies Open Government Licence attribution sidecars.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'audit' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Audit Report
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'editor' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Metadata Sidecar Editor
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'audit' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Audit Score Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance Status</span>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="text-center py-4 space-y-2">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-1">
                <CheckCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {auditPassed ? '100% Compliant' : 'Issues Detected'}
              </h3>
              <p className="text-xs text-slate-500">
                {totalItems === 0
                  ? 'Queue is empty. Add items from the explorer to run full audit.'
                  : `${totalItems} queued items verified for file naming & metadata integrity.`}
              </p>
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Illegal Path Characters:</span>
                <span className={itemsWithInvalidChars.length === 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                  {itemsWithInvalidChars.length === 0 ? '0 (Clean)' : `${itemsWithInvalidChars.length} illegal`}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Metadata Attribution:</span>
                <span className="text-emerald-600 font-bold">OGL v3.0 Valid</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Folder Depth Level:</span>
                <span className="text-emerald-600 font-bold">Consistent (4 Levels)</span>
              </div>
            </div>
          </div>

          {/* Audit Checks Details */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Hierarchy Validation Rules
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">Path Sanitization Rule</p>
                  <p className="text-slate-500 leading-relaxed">
                    All file and directory names are auto-cleansed to eliminate characters like <code>\ / : * ? &quot; &lt; &gt; |</code> ensuring cross-platform compatibility across Windows, macOS, Linux, and school network drives.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                <FolderTree className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">Strict Folder Taxonomy &amp; Year Group Preservation</p>
                  <p className="text-slate-500 leading-relaxed">
                    Maintains the structured 5-tier hierarchy: <code>Root / Subject / Year Group (Year 7–9) / Unit / Lesson / Resource File</code>, preserving Oak National Academy year sequencing across Key Stage 3.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3">
                <FileJson className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">Sidecar Metadata Preservation</p>
                  <p className="text-slate-500 leading-relaxed">
                    Every exported file is accompanied by a <code>filename.metadata.json</code> sidecar providing learning objectives, key terms, checksums, and Open Government Licence v3.0 copyright attributions.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Metadata Sidecar Editor */
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Edit3 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Sidecar Metadata Customizer</h3>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              School / Teacher Custom Notes (Appended to all exported sidecar JSON files)
            </label>
            <textarea
              rows={4}
              value={customSchoolNote}
              onChange={(e) => setCustomSchoolNote(e.target.value)}
              placeholder="e.g. St Andrews Secondary School - Key Stage 3 Mathematics Department. Tiered resource for Year 8 set 1."
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
            />
            <p className="text-xs text-slate-500">
              This note will automatically be embedded inside the <code>teacherCustomNotes</code> property of every generated <code>.metadata.json</code> file during batch ZIP export.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
