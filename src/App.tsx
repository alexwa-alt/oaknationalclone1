import React, { useState, useEffect } from 'react';
import {
  OakSubject,
  OakUnit,
  OakLesson,
  OakResource,
  FolderStructureConfig,
  DownloadQueueItem,
  StoredOfflineFile,
  ApiConnectionState,
  UiCustomizationConfig,
} from './types';
import { MOCK_KS3_CURRICULUM } from './data/ks3Curriculum';
import {
  DEFAULT_FOLDER_CONFIG,
  buildQueueItemPathAndMetadata,
} from './utils/folderStructure';
import {
  getAllOfflineFiles,
  saveOfflineFile,
  deleteOfflineFile,
  clearAllOfflineFiles,
} from './utils/indexedDb';

import { Header, AppTab } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { UiOptionsModal } from './components/UiOptionsModal';
import { CurriculumExplorer } from './components/CurriculumExplorer';
import { BatchDownloadManager } from './components/BatchDownloadManager';
import { OfflineVault } from './components/OfflineVault';
import { StructureAuditor } from './components/StructureAuditor';

import { X, Sparkles, Download, FileText, FileQuestion, FileCode, Palette } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AppTab>('explorer');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isUiModalOpen, setIsUiModalOpen] = useState(false);

  // UI Theme & Customization State
  const [uiConfig, setUiConfig] = useState<UiCustomizationConfig>({
    themePreset: 'emerald',
    layoutMode: 'split_explorer',
    density: 'comfortable',
    fontFamily: 'sans',
    showFileSizes: true,
    accentGlow: true,
  });

  // Curriculum Data
  const [subjects, setSubjects] = useState<OakSubject[]>(MOCK_KS3_CURRICULUM);

  // Selection & Queue
  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(new Set());
  const [queueItems, setQueueItems] = useState<DownloadQueueItem[]>([]);
  const [folderConfig, setFolderConfig] = useState<FolderStructureConfig>(DEFAULT_FOLDER_CONFIG);

  // Offline Library Vault
  const [offlineFiles, setOfflineFiles] = useState<StoredOfflineFile[]>([]);

  // API State
  const [apiState, setApiState] = useState<ApiConnectionState>({
    apiKey: '',
    isCustomKey: false,
    isValidating: false,
    isValid: null,
    endpointUrl: 'https://open-api.thenational.academy/api/v0',
  });

  // School Notes for sidecars
  const [customSchoolNote, setCustomSchoolNote] = useState<string>('');

  // Resource Preview Modal
  const [previewingResourceItem, setPreviewingResourceItem] = useState<{
    resource: OakResource;
    lesson: OakLesson;
    unit: OakUnit;
    subject: OakSubject;
  } | null>(null);

  // Initial load
  useEffect(() => {
    loadOfflineFiles();
    testApiHealth('');
  }, []);

  // Sync UI Theme & Customization Config to Document Root
  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('theme-emerald', 'theme-navy', 'theme-dark_classroom', 'theme-warm_library', 'theme-high_contrast');
    root.classList.add(`theme-${uiConfig.themePreset}`);

    // Toggle Tailwind dark mode
    if (['dark_classroom', 'navy', 'high_contrast'].includes(uiConfig.themePreset)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply font family
    root.classList.remove('font-sans', 'font-serif', 'font-mono');
    root.classList.add(`font-${uiConfig.fontFamily}`);

    // Apply density
    root.classList.remove('density-comfortable', 'density-compact');
    root.classList.add(`density-${uiConfig.density}`);
  }, [uiConfig]);

  const loadOfflineFiles = async () => {
    try {
      const files = await getAllOfflineFiles();
      setOfflineFiles(files);
    } catch (err) {
      console.warn('Failed to load IndexedDB offline files:', err);
    }
  };

  const testApiHealth = async (key: string) => {
    setApiState((prev) => ({ ...prev, isValidating: true }));
    try {
      const headers: Record<string, string> = {};
      if (key) headers['x-api-key'] = key;

      const res = await fetch('/api/oak/health', { headers });
      const data = await res.json();

      setApiState((prev) => ({
        ...prev,
        isValidating: false,
        isValid: data.status === 'connected' || data.status === 'demo_mode',
        errorMessage: data.status === 'demo_mode' ? undefined : data.message,
        lastTestedAt: new Date().toLocaleTimeString(),
      }));

      // Fetch curriculum data
      const currRes = await fetch('/api/oak/curriculum', { headers });
      const currData = await currRes.json();
      if (currData.subjects && currData.subjects.length > 0) {
        setSubjects(currData.subjects);
      }
    } catch (err) {
      console.warn('API health check error:', err);
      setApiState((prev) => ({
        ...prev,
        isValidating: false,
        isValid: false,
        errorMessage: 'Network error connecting to Oak API proxy. Using offline dataset.',
      }));
    }
  };

  const handleSaveApiKey = async (key: string) => {
    setApiState((prev) => ({ ...prev, apiKey: key, isCustomKey: Boolean(key) }));
  };

  const handleToggleResourceSelect = (resourceId: string) => {
    setSelectedResourceIds((prev) => {
      const next = new Set(prev);
      if (next.has(resourceId)) next.delete(resourceId);
      else next.add(resourceId);
      return next;
    });
  };

  const handleSelectAllResources = (resourceIds: string[]) => {
    setSelectedResourceIds((prev) => {
      const next = new Set(prev);
      resourceIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const handleDeselectAllResources = () => {
    setSelectedResourceIds(new Set());
  };

  // Convert selected resources into Queue Items
  const handleAddToQueue = (
    selectedItems: Array<{ subject: OakSubject; unit: OakUnit; lesson: OakLesson; resource: OakResource }>
  ) => {
    const newItems: DownloadQueueItem[] = selectedItems.map(({ subject, unit, lesson, resource }) => {
      const { computedPath, sidecarPath, sidecarMetadata } = buildQueueItemPathAndMetadata(
        subject,
        unit,
        lesson,
        resource,
        folderConfig
      );

      // Append custom teacher note if provided
      if (customSchoolNote.trim()) {
        (sidecarMetadata as unknown as Record<string, string>).teacherCustomNotes = customSchoolNote.trim();
      }

      return {
        id: `${resource.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        subjectSlug: subject.slug,
        subjectTitle: subject.title,
        unitSlug: unit.slug,
        unitTitle: unit.title,
        unitNumber: unit.unitNumber,
        lessonSlug: lesson.slug,
        lessonTitle: lesson.title,
        lessonNumber: lesson.lessonNumber,
        resource,
        computedPath,
        sidecarPath,
        sidecarMetadata,
        status: 'queued',
        progressPercent: 0,
        bytesDownloaded: 0,
        totalBytes: resource.fileSizeBytes,
        addedAt: Date.now(),
      };
    });

    setQueueItems((prev) => [...prev, ...newItems]);
    setActiveTab('queue');
  };

  // Recalculate queue item paths when config updates
  const handleUpdateFolderConfig = (newConfig: FolderStructureConfig) => {
    setFolderConfig(newConfig);
    setQueueItems((prev) =>
      prev.map((item) => {
        const dummySubject = subjects.find((s) => s.slug === item.subjectSlug) || {
          slug: item.subjectSlug,
          title: item.subjectTitle,
        } as OakSubject;
        const dummyUnit = {
          slug: item.unitSlug,
          title: item.unitTitle,
          unitNumber: item.unitNumber,
        } as OakUnit;
        const dummyLesson = {
          slug: item.lessonSlug,
          title: item.lessonTitle,
          lessonNumber: item.lessonNumber,
        } as OakLesson;

        const { computedPath, sidecarPath, sidecarMetadata } = buildQueueItemPathAndMetadata(
          dummySubject,
          dummyUnit,
          dummyLesson,
          item.resource,
          newConfig
        );

        return { ...item, computedPath, sidecarPath, sidecarMetadata };
      })
    );
  };

  const handleClearQueue = () => {
    setQueueItems([]);
  };

  const handleRemoveQueueItem = (id: string) => {
    setQueueItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSaveItemsToOfflineVault = async (itemsToSave: DownloadQueueItem[]) => {
    for (const item of itemsToSave) {
      const offlineFile: StoredOfflineFile = {
        id: item.id,
        computedPath: item.computedPath,
        filename: item.resource.title,
        mimeType: item.resource.mimeType,
        fileSizeBytes: item.resource.fileSizeBytes,
        downloadedAt: new Date().toISOString(),
        sidecarMetadata: item.sidecarMetadata,
      };
      await saveOfflineFile(offlineFile);
    }
    await loadOfflineFiles();
  };

  const handleDeleteOfflineFile = async (id: string) => {
    await deleteOfflineFile(id);
    await loadOfflineFiles();
  };

  const handleClearAllOfflineFiles = async () => {
    await clearAllOfflineFiles();
    await loadOfflineFiles();
  };

  // Font family helper
  const getFontFamilyClass = () => {
    switch (uiConfig.fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      default:
        return 'font-sans';
    }
  };

  // Theme preset helper
  const getThemePresetClass = () => {
    switch (uiConfig.themePreset) {
      case 'dark_classroom':
        return 'dark bg-slate-950 text-slate-100';
      case 'navy':
        return 'bg-slate-900 text-slate-100';
      case 'warm_library':
        return 'bg-amber-50/40 text-stone-900';
      case 'high_contrast':
        return 'bg-slate-950 text-white';
      default:
        return 'bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col antialiased transition-colors ${getFontFamilyClass()} ${getThemePresetClass()}`}>
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiState={apiState}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenUiOptionsModal={() => setIsUiModalOpen(true)}
        selectedResourceCount={selectedResourceIds.size}
        queueCount={queueItems.length}
        offlineCount={offlineFiles.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {activeTab === 'explorer' && (
          <CurriculumExplorer
            subjects={subjects}
            selectedResourceIds={selectedResourceIds}
            onToggleResourceSelect={handleToggleResourceSelect}
            onSelectAllResources={handleSelectAllResources}
            onDeselectAllResources={handleDeselectAllResources}
            onAddToQueue={handleAddToQueue}
            folderConfig={folderConfig}
            uiConfig={uiConfig}
            setUiConfig={setUiConfig}
            onPreviewResource={(resource, lesson, unit, subject) =>
              setPreviewingResourceItem({ resource, lesson, unit, subject })
            }
          />
        )}

        {activeTab === 'queue' && (
          <BatchDownloadManager
            subjects={subjects}
            folderConfig={folderConfig}
            onUpdateFolderConfig={handleUpdateFolderConfig}
          />
        )}

        {activeTab === 'vault' && (
          <OfflineVault
            offlineFiles={offlineFiles}
            onDeleteOfflineFile={handleDeleteOfflineFile}
            onClearAllOfflineFiles={handleClearAllOfflineFiles}
          />
        )}

        {activeTab === 'auditor' && (
          <StructureAuditor
            queueItems={queueItems}
            folderConfig={folderConfig}
            customSchoolNote={customSchoolNote}
            setCustomSchoolNote={setCustomSchoolNote}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Oak National Academy Curriculum Materials • Key Stage 3 (KS3) • Open Government Licence v3.0
          </p>
          <p className="font-mono text-[11px] text-slate-400">
            Path Engine: Root/Subject/Unit/Lesson/Resource + .metadata.json
          </p>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiState={apiState}
        onSaveKey={handleSaveApiKey}
        onTestConnection={() => testApiHealth(apiState.apiKey)}
      />

      {/* UI & Theme Customization Modal */}
      <UiOptionsModal
        isOpen={isUiModalOpen}
        onClose={() => setIsUiModalOpen(false)}
        uiConfig={uiConfig}
        setUiConfig={setUiConfig}
      />

      {/* Quick Resource Preview Modal */}
      {previewingResourceItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {previewingResourceItem.resource.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewingResourceItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs space-y-1">
                <p className="font-bold text-emerald-700 dark:text-emerald-300">
                  {previewingResourceItem.subject.title} &gt; Unit {previewingResourceItem.unit.unitNumber}: {previewingResourceItem.unit.title}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Lesson {previewingResourceItem.lesson.lessonNumber}: {previewingResourceItem.lesson.title} ({previewingResourceItem.lesson.yearGroup})
                </p>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-700 dark:text-slate-300">Learning Objectives:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  {previewingResourceItem.lesson.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              <p className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2.5 text-center text-xs text-slate-600 dark:text-slate-300">
                Resource downloads are not included in the hierarchy-only export.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
