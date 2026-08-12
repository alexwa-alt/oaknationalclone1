import JSZip from 'jszip';
import {
  FolderStructureConfig,
  OakSubject,
  OakUnit,
  OakLesson,
  OakResource,
  SidecarMetadata,
  DownloadQueueItem,
} from '../types';

export const DEFAULT_FOLDER_CONFIG: FolderStructureConfig = {
  rootFolderName: 'Oak_National_Academy_KS3',
  subjectFolderFormat: 'Title',
  includeYearFolder: true,
  unitFolderFormat: 'UnitNum_Title',
  lessonFolderFormat: 'LessonNum_Title',
  fileNamingFormat: 'Standard',
  sanitizeFilenames: true,
  generateSidecarMetadata: true,
  generateRootManifest: true,
  generateSubjectReadme: true,
};

export function sanitizeFilename(str: string): string {
  return str
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/__+/g, '_')
    .replace(/^_|_$/g, '');
}

export function formatSubjectFolder(subject: OakSubject, format: FolderStructureConfig['subjectFolderFormat']): string {
  switch (format) {
    case 'slug':
      return sanitizeFilename(subject.slug);
    case 'Title_Slug':
      return sanitizeFilename(`${subject.title}_(${subject.slug})`);
    case 'Title':
    default:
      return sanitizeFilename(subject.title);
  }
}

export function formatUnitFolder(unit: OakUnit, format: FolderStructureConfig['unitFolderFormat']): string {
  const numStr = String(unit.unitNumber).padStart(2, '0');
  switch (format) {
    case 'slug':
      return sanitizeFilename(unit.slug);
    case 'Title':
      return sanitizeFilename(unit.title);
    case 'UnitNum_Title':
    default:
      return sanitizeFilename(`Unit_${numStr}_${unit.title}`);
  }
}

export function formatLessonFolder(lesson: OakLesson, format: FolderStructureConfig['lessonFolderFormat']): string {
  const numStr = String(lesson.lessonNumber).padStart(2, '0');
  switch (format) {
    case 'slug':
      return sanitizeFilename(lesson.slug);
    case 'Title':
      return sanitizeFilename(lesson.title);
    case 'LessonNum_Title':
    default:
      return sanitizeFilename(`Lesson_${numStr}_${lesson.title}`);
  }
}

export function formatResourceFilename(
  lesson: OakLesson,
  resource: OakResource,
  format: FolderStructureConfig['fileNamingFormat']
): string {
  const ext = resource.fileExtension;
  switch (format) {
    case 'Type_Only':
      return sanitizeFilename(`${resource.type}.${ext}`);
    case 'Descriptive':
      return sanitizeFilename(`${lesson.title}_-${resource.type}_(${resource.id}).${ext}`);
    case 'Standard':
    default: {
      const titleClean = sanitizeFilename(resource.title);
      return `${titleClean}.${ext}`;
    }
  }
}

export function createSidecarMetadata(
  subject: OakSubject,
  unit: OakUnit,
  lesson: OakLesson,
  resource: OakResource,
  filename: string
): SidecarMetadata {
  return {
    schemaVersion: '1.0.0',
    title: resource.title,
    type: resource.type,
    keyStage: 'Key Stage 3 (KS3)',
    subject: {
      slug: subject.slug,
      title: subject.title,
    },
    unit: {
      slug: unit.slug,
      title: unit.title,
      number: unit.unitNumber,
    },
    lesson: {
      slug: lesson.slug,
      title: lesson.title,
      number: lesson.lessonNumber,
      yearGroup: lesson.yearGroup,
      learningObjectives: lesson.learningObjectives,
      keyWords: lesson.keyWords,
    },
    fileInfo: {
      filename,
      originalExtension: resource.fileExtension,
      mimeType: resource.mimeType,
      fileSizeBytes: resource.fileSizeBytes,
      checksumSha256: `sha256-${resource.id}-${resource.fileSizeBytes}`,
      downloadTimestamp: new Date().toISOString(),
    },
    licensing: {
      licenseName: 'Open Government Licence v3.0 (OGL)',
      licenseUrl: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
      attribution: 'Oak National Academy (https://www.thenational.academy)',
      publisher: 'Oak National Academy',
    },
  };
}

export function buildQueueItemPathAndMetadata(
  subject: OakSubject,
  unit: OakUnit,
  lesson: OakLesson,
  resource: OakResource,
  config: FolderStructureConfig = DEFAULT_FOLDER_CONFIG
): { computedPath: string; sidecarPath: string; sidecarMetadata: SidecarMetadata } {
  const rootDir = sanitizeFilename(config.rootFolderName);
  const subjDir = formatSubjectFolder(subject, config.subjectFolderFormat);
  
  // Preserve Year Group folder (e.g. Year_7, Year_8, Year_9) if enabled
  const yearGroupRaw = unit.yearGroup || lesson.yearGroup || 'Year_7';
  const yearDir = config.includeYearFolder !== false ? sanitizeFilename(yearGroupRaw) : '';
  
  const unitDir = formatUnitFolder(unit, config.unitFolderFormat);
  const lessonDir = formatLessonFolder(lesson, config.lessonFolderFormat);
  const filename = formatResourceFilename(lesson, resource, config.fileNamingFormat);

  const pathParts = [rootDir, subjDir, yearDir, unitDir, lessonDir, filename].filter(Boolean);
  const computedPath = pathParts.join('/');
  const sidecarPath = `${computedPath}.metadata.json`;

  const sidecarMetadata = createSidecarMetadata(subject, unit, lesson, resource, filename);

  return { computedPath, sidecarPath, sidecarMetadata };
}

export async function createHierarchyZip(
  subjects: OakSubject[],
  config: FolderStructureConfig,
  onProgress?: (percent: number, currentFolderPath: string) => void
): Promise<Blob> {
  const zip = new JSZip();
  const rootPath = sanitizeFilename(config.rootFolderName);
  const lessons = subjects.flatMap((subject) =>
    subject.units.flatMap((unit) => unit.lessons.map((lesson) => ({ unit, lesson })))
  );

  zip.folder(rootPath);

  for (let index = 0; index < lessons.length; index++) {
    const { unit, lesson } = lessons[index];
    const yearPath = config.includeYearFolder === false ? '' : sanitizeFilename(unit.yearGroup || lesson.yearGroup);
    const folderPath = [
      rootPath,
      yearPath,
      formatUnitFolder(unit, config.unitFolderFormat),
      formatLessonFolder(lesson, config.lessonFolderFormat),
    ].filter(Boolean).join('/');

    // Explicitly add each leaf so the ZIP extracts to empty lesson folders.
    zip.folder(folderPath);

    if (onProgress) {
      onProgress(Math.round(((index + 1) / lessons.length) * 100), folderPath);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}
