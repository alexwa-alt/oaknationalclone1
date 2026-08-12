import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Search,
  CheckSquare,
  Square,
  FileText,
  FileCode,
  FileQuestion,
  FileVideo,
  BookOpen,
  Filter,
  Layers,
  ArrowRight,
  Calculator,
  Atom,
  Globe,
  Code,
  Languages,
  Landmark,
  Eye,
  Info,
  Sparkles,
  Download,
  Columns,
  LayoutGrid,
  Table,
  FolderArchive,
  FolderTree,
  CheckCircle2,
} from 'lucide-react';
import {
  OakSubject,
  OakUnit,
  OakLesson,
  OakResource,
  ResourceType,
  FolderStructureConfig,
  UiCustomizationConfig,
} from '../types';
import {
  createHierarchyZip,
  sanitizeFilename,
} from '../utils/folderStructure';

interface CurriculumExplorerProps {
  subjects: OakSubject[];
  selectedResourceIds: Set<string>;
  onToggleResourceSelect: (resourceId: string) => void;
  onSelectAllResources: (resourceIds: string[]) => void;
  onDeselectAllResources: () => void;
  onAddToQueue: (selectedItems: Array<{ subject: OakSubject; unit: OakUnit; lesson: OakLesson; resource: OakResource }>) => void;
  folderConfig: FolderStructureConfig;
  onPreviewResource?: (resource: OakResource, lesson: OakLesson, unit: OakUnit, subject: OakSubject) => void;
  uiConfig?: UiCustomizationConfig;
  setUiConfig?: React.Dispatch<React.SetStateAction<UiCustomizationConfig>>;
}

export const CurriculumExplorer: React.FC<CurriculumExplorerProps> = ({
  subjects,
  selectedResourceIds,
  onToggleResourceSelect,
  onSelectAllResources,
  onDeselectAllResources,
  onAddToQueue,
  folderConfig,
  onPreviewResource,
  uiConfig,
  setUiConfig,
}) => {
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string>('all');
  const [selectedYearGroup, setSelectedYearGroup] = useState<string>('all');
  const [enabledResourceTypes, setEnabledResourceTypes] = useState<Record<ResourceType, boolean>>({
    slidedeck: true,
    worksheet: true,
    quiz: true,
    transcript: true,
    video: true,
    teacher_guide: true,
  });

  // Accordion Expand/Collapse States
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set(subjects.map((s) => s.slug)));
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set(subjects.flatMap((s) => s.units.map((u) => `${s.slug}-${u.slug}`))));
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  // Currently inspected item
  const [inspectedItem, setInspectedItem] = useState<{
    subject: OakSubject;
    unit: OakUnit;
    lesson: OakLesson;
    resource: OakResource;
  } | null>(null);

  // Quick Subject Packaging Progress State
  const [packagingSubject, setPackagingSubject] = useState<{
    subjectTitle: string;
    progress: number;
    statusText: string;
  } | null>(null);

  // Download entire curriculum for a subject across all of KS3 (Years 7, 8, 9) preserving Year folders
  const handleDownloadSubjectArchive = async (subjectToDownload: OakSubject) => {
    setPackagingSubject({
      subjectTitle: subjectToDownload.title,
      progress: 0,
      statusText: `Collecting all Year groups (Y7, Y8, Y9) and units for ${subjectToDownload.title}...`,
    });

    try {
      setPackagingSubject({
        subjectTitle: subjectToDownload.title,
        progress: 10,
        statusText: `Building folder hierarchy with preserved Year subfolders...`,
      });

      const zipBlob = await createHierarchyZip([subjectToDownload], folderConfig, (percent, currentPath) => {
        setPackagingSubject({
          subjectTitle: subjectToDownload.title,
          progress: Math.max(10, percent),
          statusText: `Packaging: ${currentPath.split('/').pop()}`,
        });
      });

      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Oak_KS3_${sanitizeFilename(subjectToDownload.title)}_Full_Curriculum.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setPackagingSubject({
        subjectTitle: subjectToDownload.title,
        progress: 100,
        statusText: `Successfully downloaded ${subjectToDownload.title} KS3 curriculum (.zip)!`,
      });

      setTimeout(() => {
        setPackagingSubject(null);
      }, 3500);
    } catch (err) {
      console.error('Failed to generate subject ZIP archive:', err);
      setPackagingSubject(null);
    }
  };

  const handleQueueEntireSubject = (subjectToQueue: OakSubject) => {
    const items: Array<{ subject: OakSubject; unit: OakUnit; lesson: OakLesson; resource: OakResource }> = [];
    for (const unit of subjectToQueue.units) {
      for (const lesson of unit.lessons) {
        for (const resource of lesson.resources) {
          items.push({ subject: subjectToQueue, unit, lesson, resource });
        }
      }
    }
    onAddToQueue(items);
  };

  // Helper Icon Resolver
  const renderSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'Languages':
        return <Languages className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      default:
        return <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  const renderTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'slidedeck':
        return <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'worksheet':
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'quiz':
        return <FileQuestion className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'transcript':
        return <FileCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'video':
        return <FileVideo className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  // Filtered Hierarchy Computation
  const filteredHierarchy = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return subjects
      .filter((subj) => selectedSubjectSlug === 'all' || subj.slug === selectedSubjectSlug)
      .map((subj) => {
        const filteredUnits = subj.units
          .filter((unit) => selectedYearGroup === 'all' || unit.yearGroup === selectedYearGroup)
          .map((unit) => {
            const filteredLessons = unit.lessons.map((lesson) => {
              const filteredResources = lesson.resources.filter((res) => {
                const matchesType = enabledResourceTypes[res.type] ?? true;
                if (!matchesType) return false;

                if (!term) return true;

                const matchSubj = subj.title.toLowerCase().includes(term);
                const matchUnit = unit.title.toLowerCase().includes(term);
                const matchLesson = lesson.title.toLowerCase().includes(term);
                const matchRes = res.title.toLowerCase().includes(term);
                const matchWords = lesson.keyWords.some((w) => w.toLowerCase().includes(term));
                const matchObj = lesson.learningObjectives.some((o) => o.toLowerCase().includes(term));

                return matchSubj || matchUnit || matchLesson || matchRes || matchWords || matchObj;
              });

              return { ...lesson, resources: filteredResources };
            }).filter((l) => l.resources.length > 0 || (!term && enabledResourceTypes.slidedeck));

            return { ...unit, lessons: filteredLessons };
          }).filter((u) => u.lessons.length > 0);

        return { ...subj, units: filteredUnits };
      }).filter((s) => s.units.length > 0);
  }, [subjects, selectedSubjectSlug, selectedYearGroup, enabledResourceTypes, searchTerm]);

  // Flattened array of all visible resource items
  const allFilteredItems = useMemo(() => {
    const items: Array<{ subject: OakSubject; unit: OakUnit; lesson: OakLesson; resource: OakResource }> = [];
    filteredHierarchy.forEach((subj) => {
      subj.units.forEach((unit) => {
        unit.lessons.forEach((lesson) => {
          lesson.resources.forEach((resource) => {
            items.push({ subject: subj, unit, lesson, resource });
          });
        });
      });
    });
    return items;
  }, [filteredHierarchy]);

  // Total selected size calculation
  const totalSelectedBytes = useMemo(() => {
    let bytes = 0;
    subjects.forEach((s) => {
      s.units.forEach((u) => {
        u.lessons.forEach((l) => {
          l.resources.forEach((r) => {
            if (selectedResourceIds.has(r.id)) {
              bytes += r.fileSizeBytes;
            }
          });
        });
      });
    });
    return bytes;
  }, [subjects, selectedResourceIds]);

  const formattedTotalMB = (totalSelectedBytes / (1024 * 1024)).toFixed(1);

  // Toggle helpers
  const toggleSubjectExpand = (slug: string) => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const toggleUnitExpand = (key: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleLessonExpand = (key: string) => {
    setExpandedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    const ids = allFilteredItems.map((item) => item.resource.id);
    onSelectAllResources(ids);
  };

  const handleSendSelectedToQueue = () => {
    const selectedItems = allFilteredItems.filter((item) => selectedResourceIds.has(item.resource.id));
    if (selectedItems.length > 0) {
      onAddToQueue(selectedItems);
    }
  };

  // Checkbox helpers for subject/unit level multi-select
  const isSubjectFullySelected = (subj: OakSubject) => {
    const ids = subj.units.flatMap((u) => u.lessons.flatMap((l) => l.resources.map((r) => r.id)));
    return ids.length > 0 && ids.every((id) => selectedResourceIds.has(id));
  };

  const toggleSubjectSelect = (subj: OakSubject) => {
    const ids = subj.units.flatMap((u) => u.lessons.flatMap((l) => l.resources.map((r) => r.id)));
    const fullySelected = isSubjectFullySelected(subj);
    if (fullySelected) {
      ids.forEach((id) => {
        if (selectedResourceIds.has(id)) onToggleResourceSelect(id);
      });
    } else {
      ids.forEach((id) => {
        if (!selectedResourceIds.has(id)) onToggleResourceSelect(id);
      });
    }
  };

  const isUnitFullySelected = (unit: OakUnit) => {
    const ids = unit.lessons.flatMap((l) => l.resources.map((r) => r.id));
    return ids.length > 0 && ids.every((id) => selectedResourceIds.has(id));
  };

  const toggleUnitSelect = (unit: OakUnit) => {
    const ids = unit.lessons.flatMap((l) => l.resources.map((r) => r.id));
    const fullySelected = isUnitFullySelected(unit);
    if (fullySelected) {
      ids.forEach((id) => {
        if (selectedResourceIds.has(id)) onToggleResourceSelect(id);
      });
    } else {
      ids.forEach((id) => {
        if (!selectedResourceIds.has(id)) onToggleResourceSelect(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Subject Archive Packaging Progress Banner */}
      {packagingSubject && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-5 border border-emerald-500/40 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 animate-pulse">
                <FolderArchive className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  Packaging Full {packagingSubject.subjectTitle} KS3 Curriculum Archive
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Preserving Years 7–9 Folders
                  </span>
                </h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  {packagingSubject.statusText}
                </p>
              </div>
            </div>
            <span className="text-lg font-black font-mono text-emerald-400">
              {packagingSubject.progress}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-300"
              style={{ width: `${packagingSubject.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Quick Subject Bundle Downloader Highlight Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-4 sm:p-5 rounded-2xl border border-emerald-500/30 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">Download Complete Subject Bundle Across KS3</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Preserves Year Folders
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Instantly download all units &amp; lessons for an entire subject organized by <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded">Year 7 / Year 8 / Year 9</code> folders.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedSubjectSlug === 'all' ? subjects[0]?.slug || '' : selectedSubjectSlug}
            onChange={(e) => setSelectedSubjectSlug(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {subjects.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title} ({s.units.length} Units)
              </option>
            ))}
          </select>

          {(() => {
            const targetSubj = subjects.find((s) => s.slug === (selectedSubjectSlug === 'all' ? subjects[0]?.slug : selectedSubjectSlug)) || subjects[0];
            return (
              <button
                onClick={() => targetSubj && handleDownloadSubjectArchive(targetSubj)}
                disabled={!targetSubj || (packagingSubject !== null && packagingSubject.progress < 100)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Download {targetSubj?.title || 'Subject'} (.zip)</span>
              </button>
            );
          })()}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search KS3 subjects, units, topics, or learning objectives (e.g., 'Algebra', 'Cell', 'Macbeth')..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Subject Dropdown Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSubjectSlug}
              onChange={(e) => setSelectedSubjectSlug(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="all">All KS3 Subjects ({subjects.length})</option>
              {subjects.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>

            {/* Year Group Dropdown */}
            <select
              value={selectedYearGroup}
              onChange={(e) => setSelectedYearGroup(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="all">All Years (Y7–Y9)</option>
              <option value="Year 7">Year 7</option>
              <option value="Year 8">Year 8</option>
              <option value="Year 9">Year 9</option>
            </select>
          </div>

        </div>

        {/* View Mode & Resource Type Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Resource Types:
            </span>

            {(['slidedeck', 'worksheet', 'quiz', 'transcript'] as ResourceType[]).map((type) => (
              <button
                key={type}
                onClick={() =>
                  setEnabledResourceTypes((prev) => ({
                    ...prev,
                    [type]: !prev[type],
                  }))
                }
                className={`px-2.5 py-1 rounded-lg border font-medium capitalize transition-all flex items-center gap-1.5 ${
                  enabledResourceTypes[type]
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-800 line-through'
                }`}
              >
                {renderTypeIcon(type)}
                {type === 'slidedeck' ? 'Slide Decks' : type === 'worksheet' ? 'Worksheets' : type === 'quiz' ? 'Quizzes' : 'Transcripts'}
              </button>
            ))}
          </div>

          {/* Quick Layout Mode Buttons */}
          {setUiConfig && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
              <span className="text-[10px] text-slate-500 font-bold px-1.5 hidden md:inline">
                Layout:
              </span>
              <button
                onClick={() => setUiConfig((prev) => ({ ...prev, layoutMode: 'split_explorer' }))}
                className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
                  uiConfig?.layoutMode === 'split_explorer'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Nested Tree Explorer"
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">Tree</span>
              </button>
              <button
                onClick={() => setUiConfig((prev) => ({ ...prev, layoutMode: 'bento_grid' }))}
                className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
                  uiConfig?.layoutMode === 'bento_grid'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Visual Bento Cards"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">Bento</span>
              </button>
              <button
                onClick={() => setUiConfig((prev) => ({ ...prev, layoutMode: 'dense_matrix' }))}
                className={`p-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
                  uiConfig?.layoutMode === 'dense_matrix'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Compact Teacher Matrix"
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">Matrix</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Action Bar & Selection Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-emerald-950/5 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-500/20">
        
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4" />
            <span>{selectedResourceIds.size} Selected</span>
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Estimated archive size: <strong className="text-slate-900 dark:text-white">{formattedTotalMB} MB</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSelectAllFiltered}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            Select All Visible ({allFilteredItems.length})
          </button>
          <button
            onClick={onDeselectAllResources}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Clear Selection
          </button>
          <button
            onClick={handleSendSelectedToQueue}
            disabled={selectedResourceIds.size === 0}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 ml-1"
          >
            Add Selected to Batch Downloader Queue
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Layout Mode 1: Dense Matrix Table */}
      {uiConfig?.layoutMode === 'dense_matrix' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Compact Teacher Matrix Table</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {allFilteredItems.length} resources available
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
                  <th className="p-3 w-10 text-center">Sel</th>
                  <th className="p-3">Subject &amp; Unit</th>
                  <th className="p-3">Lesson Details</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Resource Type</th>
                  <th className="p-3">Size</th>
                  <th className="p-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allFilteredItems.map(({ subject, unit, lesson, resource }) => {
                  const isSelected = selectedResourceIds.has(resource.id);
                  return (
                    <tr
                      key={resource.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-emerald-500/5' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleResourceSelect(resource.id)}
                          className="text-slate-400 hover:text-emerald-600"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="p-3 font-medium text-slate-900 dark:text-white">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 mr-2">
                          {subject.title}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          U{unit.unitNumber}: {unit.title}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          L{lesson.lessonNumber}: {lesson.title}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {lesson.yearGroup}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 font-medium capitalize text-slate-800 dark:text-slate-200">
                          {renderTypeIcon(resource.type)}
                          {resource.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-500">
                        {(resource.fileSizeBytes / 1024).toFixed(0)} KB
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() =>
                            setInspectedItem({
                              subject,
                              unit,
                              lesson,
                              resource,
                            })
                          }
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-[11px] font-medium text-slate-700 dark:text-slate-300"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : uiConfig?.layoutMode === 'bento_grid' ? (
        /* Layout Mode 2: Visual Bento Cards */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHierarchy.map((subject) => {
              const totalResourcesInSubj = subject.units.flatMap((u) => u.lessons.flatMap((l) => l.resources)).length;
              const selectedInSubj = subject.units.flatMap((u) => u.lessons.flatMap((l) => l.resources.map((r) => r.id))).filter((id) => selectedResourceIds.has(id)).length;

              return (
                <div
                  key={subject.slug}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {renderSubjectIcon(subject.iconName)}
                      </div>
                      <button
                        onClick={() => toggleSubjectSelect(subject)}
                        className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/20 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        {selectedInSubj === totalResourcesInSubj ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {subject.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {subject.description}
                      </p>
                    </div>

                    {/* Units Mini-List inside Bento Card */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {subject.units.map((unit) => (
                        <div
                          key={unit.slug}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 mr-1.5">
                              U{unit.unitNumber}
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {unit.title}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleUnitSelect(unit)}
                            className="text-[11px] font-bold text-emerald-600 hover:underline"
                          >
                            Select Unit
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{subject.units.length} Units</span>
                      <span className="font-bold text-emerald-600">
                        {selectedInSubj} / {totalResourcesInSubj} Selected
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleDownloadSubjectArchive(subject)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Subject (.zip)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQueueEntireSubject(subject)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors shrink-0"
                        title="Queue entire subject"
                      >
                        <FolderArchive className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Layout Mode 3 (Default): Main Split Layout Explorer Tree + Inspector Sidebar */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Hierarchical Accordion Tree */}
          <div className="lg:col-span-2 space-y-4">
            {filteredHierarchy.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No matching KS3 curriculum items found
                </p>
                <p className="text-xs text-slate-500">
                  Try adjusting your search terms or enabling additional resource types.
                </p>
              </div>
            ) : (
              filteredHierarchy.map((subject) => {
                const isSubjExpanded = expandedSubjects.has(subject.slug);
                const isSubjSelected = isSubjectFullySelected(subject);

                return (
                  <div
                    key={subject.slug}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-2xs transition-all"
                  >

                  
                  {/* Subject Accordion Header */}
                  <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                    
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleSubjectSelect(subject)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {isSubjSelected ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>

                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                        {renderSubjectIcon(subject.iconName)}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleSubjectExpand(subject.slug)}
                        className="text-left group"
                      >
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                          {subject.title}
                          <span className="text-xs font-normal text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            {subject.units.length} Units
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {subject.description}
                        </p>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadSubjectArchive(subject)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                        title={`Download entire ${subject.title} curriculum across KS3 Years 7-9 with preserved Year subfolders`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download Full Subject (.zip)</span>
                        <span className="sm:hidden">.zip</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQueueEntireSubject(subject)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors hidden md:flex items-center gap-1 shrink-0"
                        title={`Queue all units and lessons for ${subject.title}`}
                      >
                        <FolderArchive className="w-3.5 h-3.5" />
                        Queue Subject
                      </button>

                      <button
                        onClick={() => toggleSubjectExpand(subject.slug)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {isSubjExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>
                    </div>

                  </div>

                  {/* Units Level */}
                  {isSubjExpanded && (
                    <div className="p-3 sm:p-4 space-y-3 bg-slate-50/20 dark:bg-slate-900/40">
                      {subject.units.map((unit) => {
                        const unitKey = `${subject.slug}-${unit.slug}`;
                        const isUnitExpanded = expandedUnits.has(unitKey);
                        const isUnitSelected = isUnitFullySelected(unit);

                        return (
                          <div
                            key={unit.slug}
                            className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 overflow-hidden"
                          >
                            
                            {/* Unit Accordion Header */}
                            <div className="flex items-center justify-between p-3 bg-slate-100/40 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/60">
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => toggleUnitSelect(unit)}
                                  className="text-slate-400 hover:text-emerald-600 transition-colors"
                                >
                                  {isUnitSelected ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>

                                <button
                                  onClick={() => toggleUnitExpand(unitKey)}
                                  className="text-left flex items-center gap-2"
                                >
                                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 shrink-0">
                                    Unit {unit.unitNumber}
                                  </span>
                                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 transition-colors">
                                    {unit.title}
                                  </span>
                                  <span className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                    {unit.yearGroup}
                                  </span>
                                </button>
                              </div>

                              <button
                                onClick={() => toggleUnitExpand(unitKey)}
                                className="p-1 rounded text-slate-400 hover:text-slate-600"
                              >
                                {isUnitExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              </button>
                            </div>

                            {/* Lessons Level */}
                            {isUnitExpanded && (
                              <div className="p-3 space-y-2.5">
                                {unit.lessons.map((lesson) => {
                                  const lessonKey = `${unitKey}-${lesson.slug}`;
                                  const isLessonExpanded = expandedLessons.has(lessonKey);

                                  return (
                                    <div
                                      key={lesson.slug}
                                      className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                            Lesson {lesson.lessonNumber}
                                          </span>
                                          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                                            {lesson.title}
                                          </h4>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                          {lesson.durationMinutes} mins
                                        </span>
                                      </div>

                                      {/* Resource Files Buttons */}
                                      <div className="flex flex-wrap items-center gap-2 pt-1">
                                        {lesson.resources.map((resource) => {
                                          const isSelected = selectedResourceIds.has(resource.id);
                                          const isInspected = inspectedItem?.resource.id === resource.id;

                                          return (
                                            <div
                                              key={resource.id}
                                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                                                isSelected
                                                  ? 'bg-emerald-500/15 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-semibold'
                                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                                              } ${isInspected ? 'ring-2 ring-emerald-500' : ''}`}
                                            >
                                              <button
                                                type="button"
                                                onClick={() => onToggleResourceSelect(resource.id)}
                                                className="text-slate-400 hover:text-emerald-600"
                                              >
                                                {isSelected ? (
                                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                ) : (
                                                  <Square className="w-3.5 h-3.5" />
                                                )}
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() =>
                                                  setInspectedItem({
                                                    subject,
                                                    unit,
                                                    lesson,
                                                    resource,
                                                  })
                                                }
                                                className="flex items-center gap-1 hover:underline"
                                              >
                                                {renderTypeIcon(resource.type)}
                                                <span className="capitalize">{resource.type}</span>
                                                <span className="text-[10px] opacity-70">
                                                  ({(resource.fileSizeBytes / 1024).toFixed(0)} KB)
                                                </span>
                                              </button>

                                              {onPreviewResource && (
                                                <button
                                                  type="button"
                                                  onClick={() => onPreviewResource(resource, lesson, unit, subject)}
                                                  className="p-0.5 text-slate-400 hover:text-emerald-600 ml-1"
                                                  title="Preview Resource"
                                                >
                                                  <Eye className="w-3 h-3" />
                                                </button>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>

                                    </div>
                                  );
                                })}
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Right Col: Detailed Metadata Inspector */}
        <div className="lg:col-span-1 space-y-4">
          <div className="sticky top-20 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Resource Inspector</h3>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Metadata Preview</span>
            </div>

            {inspectedItem ? (
              <div className="space-y-4">
                
                {/* Resource Title & Type Badge */}
                <div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 mb-1">
                    {inspectedItem.resource.type} • .{inspectedItem.resource.fileExtension}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {inspectedItem.resource.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {inspectedItem.subject.title} &gt; Unit {inspectedItem.unit.unitNumber}: {inspectedItem.unit.title} &gt; Lesson {inspectedItem.lesson.lessonNumber}
                  </p>
                </div>

                {/* Objectives */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1.5 border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Learning Objectives:
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside leading-relaxed">
                    {inspectedItem.lesson.learningObjectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                {/* Keywords */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">Key Terminology:</p>
                  <div className="flex flex-wrap gap-1">
                    {inspectedItem.lesson.keyWords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="rounded-xl bg-slate-100 dark:bg-slate-950 p-3 text-xs text-slate-600 dark:text-slate-300">
                  The current export creates empty Year, Unit, and Lesson folders only. Resource files and metadata are not generated.
                </p>

              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <Info className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">
                  Click on any resource pill in the left tree to inspect its lesson context.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    )}

  </div>
);
};
