export type KeyStageId = 'ks3';

export interface KeyStageInfo {
  id: KeyStageId;
  title: string;
  description: string;
  ageGroup: string;
  years: string[];
}

export type ResourceType = 'slidedeck' | 'worksheet' | 'quiz' | 'transcript' | 'video' | 'teacher_guide';

export interface OakResource {
  id: string;
  type: ResourceType;
  title: string;
  fileExtension: 'pdf' | 'pptx' | 'json' | 'txt' | 'mp4' | 'vtt';
  fileSizeBytes: number;
  downloadUrl: string;
  mimeType: string;
  contentPreview?: string;
  quizQuestions?: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation?: string;
  }>;
}

export interface OakLesson {
  slug: string;
  title: string;
  unitSlug: string;
  subjectSlug: string;
  keyStageSlug: 'ks3';
  lessonNumber: number;
  yearGroup: string;
  durationMinutes: number;
  learningObjectives: string[];
  pupilOutcome: string;
  keyWords: string[];
  resources: OakResource[];
}

export interface OakUnit {
  slug: string;
  title: string;
  subjectSlug: string;
  keyStageSlug: 'ks3';
  unitNumber: number;
  yearGroup: string;
  description: string;
  tier?: 'Core' | 'Higher' | 'Foundation' | 'All Tiers';
  lessons: OakLesson[];
}

export interface OakSubject {
  slug: string;
  title: string;
  keyStageSlug: 'ks3';
  description: string;
  iconName: string;
  colourClass: string;
  units: OakUnit[];
}

export interface SidecarMetadata {
  schemaVersion: string;
  title: string;
  type: string;
  keyStage: string;
  subject: {
    slug: string;
    title: string;
  };
  unit: {
    slug: string;
    title: string;
    number: number;
  };
  lesson: {
    slug: string;
    title: string;
    number: number;
    yearGroup: string;
    learningObjectives: string[];
    keyWords: string[];
  };
  fileInfo: {
    filename: string;
    originalExtension: string;
    mimeType: string;
    fileSizeBytes: number;
    checksumSha256: string;
    downloadTimestamp: string;
  };
  licensing: {
    licenseName: string;
    licenseUrl: string;
    attribution: string;
    publisher: string;
  };
}

export interface FolderStructureConfig {
  rootFolderName: string; // default "Oak_National_Academy_KS3"
  subjectFolderFormat: 'Title' | 'slug' | 'Title_Slug';
  includeYearFolder: boolean; // default true -> "Year_7", "Year_8", "Year_9"
  unitFolderFormat: 'UnitNum_Title' | 'Title' | 'slug';
  lessonFolderFormat: 'LessonNum_Title' | 'Title' | 'slug';
  fileNamingFormat: 'Standard' | 'Descriptive' | 'Type_Only';
  sanitizeFilenames: boolean;
  generateSidecarMetadata: boolean;
  generateRootManifest: boolean;
  generateSubjectReadme: boolean;
}

export type DownloadStatus = 'queued' | 'downloading' | 'completed' | 'failed' | 'paused';

export interface DownloadQueueItem {
  id: string;
  subjectSlug: string;
  subjectTitle: string;
  unitSlug: string;
  unitTitle: string;
  unitNumber: number;
  lessonSlug: string;
  lessonTitle: string;
  lessonNumber: number;
  resource: OakResource;
  computedPath: string; // e.g. "Oak_KS3/Mathematics/Unit_01_Algebra/Lesson_01_Intro/slide_deck.pdf"
  sidecarPath: string;  // e.g. "Oak_KS3/Mathematics/Unit_01_Algebra/Lesson_01_Intro/slide_deck.pdf.metadata.json"
  sidecarMetadata: SidecarMetadata;
  status: DownloadStatus;
  progressPercent: number;
  bytesDownloaded: number;
  totalBytes: number;
  errorMessage?: string;
  addedAt: number;
  completedAt?: number;
}

export interface StoredOfflineFile {
  id: string;
  computedPath: string;
  filename: string;
  mimeType: string;
  fileSizeBytes: number;
  downloadedAt: string;
  sidecarMetadata: SidecarMetadata;
  blobData?: Blob;
  textData?: string;
}

export interface ApiConnectionState {
  apiKey: string;
  isCustomKey: boolean;
  isValidating: boolean;
  isValid: boolean | null;
  lastTestedAt?: string;
  endpointUrl: string;
  errorMessage?: string;
  rateLimitRemaining?: number;
}

export type UiThemePreset = 'emerald' | 'navy' | 'dark_classroom' | 'warm_library' | 'high_contrast';
export type UiLayoutMode = 'split_explorer' | 'bento_grid' | 'dense_matrix';
export type UiDensity = 'comfortable' | 'compact';
export type UiFontFamily = 'sans' | 'serif' | 'mono';

export interface UiCustomizationConfig {
  themePreset: UiThemePreset;
  layoutMode: UiLayoutMode;
  density: UiDensity;
  fontFamily: UiFontFamily;
  showFileSizes: boolean;
  accentGlow: boolean;
}
