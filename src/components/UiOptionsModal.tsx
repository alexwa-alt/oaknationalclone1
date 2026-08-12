import React from 'react';
import {
  Palette,
  LayoutGrid,
  Maximize2,
  Type,
  X,
  Check,
  Sparkles,
  Sun,
  Moon,
  Sliders,
  Table,
  Columns,
  Eye,
  Layers,
} from 'lucide-react';
import {
  UiCustomizationConfig,
  UiThemePreset,
  UiLayoutMode,
  UiDensity,
  UiFontFamily,
} from '../types';

interface UiOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  uiConfig: UiCustomizationConfig;
  setUiConfig: React.Dispatch<React.SetStateAction<UiCustomizationConfig>>;
}

export const UiOptionsModal: React.FC<UiOptionsModalProps> = ({
  isOpen,
  onClose,
  uiConfig,
  setUiConfig,
}) => {
  if (!isOpen) return null;

  const themes: Array<{
    id: UiThemePreset;
    name: string;
    description: string;
    badgeBg: string;
    previewBg: string;
    accentColor: string;
  }> = [
    {
      id: 'emerald',
      name: 'Academic Emerald',
      description: 'Oak National default style with emerald teal accents and clean slate backgrounds.',
      badgeBg: 'bg-emerald-500',
      previewBg: 'bg-emerald-950/20 border-emerald-500/30',
      accentColor: 'emerald',
    },
    {
      id: 'navy',
      name: 'School Network Classic',
      description: 'Professional royal navy & indigo tone, modeled on official UK school intranets.',
      badgeBg: 'bg-blue-600',
      previewBg: 'bg-blue-950/20 border-blue-500/30',
      accentColor: 'blue',
    },
    {
      id: 'dark_classroom',
      name: 'Classroom Night Mode',
      description: 'Low-light dark obsidian background with high-contrast amber highlights for projectors.',
      badgeBg: 'bg-amber-500',
      previewBg: 'bg-slate-950 border-amber-500/40',
      accentColor: 'amber',
    },
    {
      id: 'warm_library',
      name: 'Warm Library Parchment',
      description: 'Warm cream canvas with rich walnut borders and burgundy highlights.',
      badgeBg: 'bg-rose-600',
      previewBg: 'bg-amber-100/30 dark:bg-amber-950/20 border-amber-600/30',
      accentColor: 'rose',
    },
    {
      id: 'high_contrast',
      name: 'High Contrast Accessibility',
      description: 'Monochrome high-contrast layout optimized for readability & accessibility standards.',
      badgeBg: 'bg-slate-900 dark:bg-white',
      previewBg: 'bg-slate-900 border-white',
      accentColor: 'slate',
    },
  ];

  const layoutModes: Array<{
    id: UiLayoutMode;
    name: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'split_explorer',
      name: 'Nested Tree Explorer',
      description: 'Interactive tree hierarchy on left + detailed resource metadata inspector on right.',
      icon: <Columns className="w-5 h-5 text-emerald-500" />,
    },
    {
      id: 'bento_grid',
      name: 'Visual Bento Cards',
      description: 'High-impact grid of subject cards with quick selection pills & progress chips.',
      icon: <LayoutGrid className="w-5 h-5 text-blue-500" />,
    },
    {
      id: 'dense_matrix',
      name: 'Compact Teacher Matrix',
      description: 'Tabular overview matrix allowing fast row/column selection across Key Stage 3.',
      icon: <Table className="w-5 h-5 text-purple-500" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                UI &amp; Visual Display Options
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  Live Customizer
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch themes, explorer layouts, visual density, and typography styling.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Section 1: Color Themes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-500" />
                Color Palette &amp; Atmosphere
              </h3>
              <span className="text-xs text-slate-400">5 Themes Available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {themes.map((t) => {
                const isActive = uiConfig.themePreset === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() =>
                      setUiConfig((prev) => ({ ...prev, themePreset: t.id }))
                    }
                    className={`p-3.5 rounded-2xl border text-left transition-all relative space-y-2 ${
                      t.previewBg
                    } ${
                      isActive
                        ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-md bg-white dark:bg-slate-800'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${t.badgeBg}`} />
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {t.name}
                        </span>
                      </div>
                      {isActive && (
                        <span className="p-1 rounded-full bg-emerald-500 text-slate-950">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {t.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Explorer Layout Mode */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-blue-500" />
                Curriculum Explorer Layout
              </h3>
              <span className="text-xs text-slate-400">3 View Modes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {layoutModes.map((m) => {
                const isActive = uiConfig.layoutMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() =>
                      setUiConfig((prev) => ({ ...prev, layoutMode: m.id }))
                    }
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                      isActive
                        ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/50'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {m.icon}
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          {m.name}
                        </span>
                      </div>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {m.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Density & Typography */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            
            {/* Density Selector */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-purple-500" />
                Information Density
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setUiConfig((prev) => ({ ...prev, density: 'comfortable' }))}
                  className={`flex-1 p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                    uiConfig.density === 'comfortable'
                      ? 'bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Comfortable
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Spacious paddings</span>
                </button>
                <button
                  onClick={() => setUiConfig((prev) => ({ ...prev, density: 'compact' }))}
                  className={`flex-1 p-3 rounded-xl border text-xs font-semibold transition-all text-center ${
                    uiConfig.density === 'compact'
                      ? 'bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Compact
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">High info density</span>
                </button>
              </div>
            </div>

            {/* Typography Selector */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-amber-500" />
                Typography Pairing
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setUiConfig((prev) => ({ ...prev, fontFamily: 'sans' }))}
                  className={`flex-1 p-3 rounded-xl border text-xs font-semibold transition-all text-center font-sans ${
                    uiConfig.fontFamily === 'sans'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Sans Serif
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Modern Sans</span>
                </button>
                <button
                  onClick={() => setUiConfig((prev) => ({ ...prev, fontFamily: 'serif' }))}
                  className={`flex-1 p-3 rounded-xl border text-xs font-semibold transition-all text-center font-serif ${
                    uiConfig.fontFamily === 'serif'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Serif Editorial
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Textbook Style</span>
                </button>
                <button
                  onClick={() => setUiConfig((prev) => ({ ...prev, fontFamily: 'mono' }))}
                  className={`flex-1 p-3 rounded-xl border text-xs font-semibold transition-all text-center font-mono ${
                    uiConfig.fontFamily === 'mono'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Monospace
                  <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Tech / CLI</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Selected: <strong className="text-slate-900 dark:text-white capitalize">{uiConfig.themePreset.replace('_', ' ')}</strong> theme with <strong className="text-slate-900 dark:text-white capitalize">{uiConfig.layoutMode.replace('_', ' ')}</strong> layout.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            Apply UI Preference
          </button>
        </div>

      </div>
    </div>
  );
};
