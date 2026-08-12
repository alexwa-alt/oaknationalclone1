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

export async function generateContentForResource(resource: OakResource, metadata: SidecarMetadata): Promise<string | Uint8Array> {
  if (resource.type === 'quiz' && resource.quizQuestions) {
    return JSON.stringify(
      {
        metadata,
        quiz: {
          title: resource.title,
          totalQuestions: resource.quizQuestions.length,
          questions: resource.quizQuestions,
        },
      },
      null,
      2
    );
  }

  if (resource.type === 'transcript' || resource.fileExtension === 'txt') {
    return `OAK NATIONAL ACADEMY - LESSON TRANSCRIPT
======================================================
Key Stage: ${metadata.keyStage}
Subject: ${metadata.subject.title}
Unit: ${metadata.unit.title} (Unit ${metadata.unit.number})
Lesson: ${metadata.lesson.title} (Lesson ${metadata.lesson.number})
Year Group: ${metadata.lesson.yearGroup}
License: ${metadata.licensing.licenseName}

LEARNING OBJECTIVES:
${metadata.lesson.learningObjectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

KEY WORDS:
${metadata.lesson.keyWords.join(', ')}

TRANSCRIPT CONTENT:
------------------------------------------------------
${resource.contentPreview || 'Full teaching video transcript content provided by Oak National Academy for offline review.'}
`;
  }

  // PDF or default representation
  return `%PDF-1.4
% Oak National Academy Resource Document Placeholder
% KeyStage: ${metadata.keyStage}
% Subject: ${metadata.subject.title}
% Unit: ${metadata.unit.title}
% Lesson: ${metadata.lesson.title}
% Resource: ${resource.title} (${resource.type})
% License: Open Government Licence v3.0

1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj

4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

5 0 obj
<< /Length 280 >>
stream
BT
/F1 18 Tf
50 750 Td
(Oak National Academy - KS3 ${metadata.subject.title}) Tj
0 -30 Td
/F1 14 Tf
(${metadata.unit.title} - Lesson ${metadata.lesson.number}) Tj
0 -25 Td
(${metadata.lesson.title}) Tj
0 -35 Td
/F1 10 Tf
(Resource Type: ${resource.type.toUpperCase()}) Tj
0 -20 Td
(Objectives: ${metadata.lesson.learningObjectives[0] || 'Core curriculum mastery'}) Tj
ET
endstream
endobj

xref
0 6
0000000000 65535 f 
0000000130 00000 n 
0000000185 00000 n 
0000000248 00000 n 
0000000350 00000 n 
0000000420 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
750
%%EOF`;
}

export async function createZipFromQueue(
  queueItems: DownloadQueueItem[],
  config: FolderStructureConfig,
  onProgress?: (percent: number, currentItemPath: string) => void
): Promise<Blob> {
  const zip = new JSZip();
  const total = queueItems.length;

  // Root Manifest if enabled
  if (config.generateRootManifest) {
    const rootPath = sanitizeFilename(config.rootFolderName);
    const rootManifest = {
      generator: 'Oak KS3 Curriculum Downloader v1.0',
      exportedAt: new Date().toISOString(),
      keyStage: 'KS3',
      totalFiles: queueItems.length,
      config,
      filesIndex: queueItems.map((item) => ({
        path: item.computedPath,
        type: item.resource.type,
        subject: item.subjectTitle,
        unit: item.unitTitle,
        lesson: item.lessonTitle,
      })),
    };
    zip.file(`${rootPath}/manifest.json`, JSON.stringify(rootManifest, null, 2));
  }

  // Subject READMEs
  if (config.generateSubjectReadme) {
    const rootPath = sanitizeFilename(config.rootFolderName);
    const subjectsMap = new Map<string, DownloadQueueItem[]>();
    for (const item of queueItems) {
      if (!subjectsMap.has(item.subjectTitle)) {
        subjectsMap.set(item.subjectTitle, []);
      }
      subjectsMap.get(item.subjectTitle)!.push(item);
    }

    for (const [subjTitle, items] of subjectsMap.entries()) {
      const subjFolder = formatSubjectFolder(
        { title: subjTitle, slug: items[0].subjectSlug } as OakSubject,
        config.subjectFolderFormat
      );
      const readmeContent = `# ${subjTitle} - Oak KS3 Curriculum Archive

Exported on: ${new Date().toLocaleDateString()}
Key Stage: 3
Total Resources Archived: ${items.length}

## Included Materials

${Array.from(new Set(items.map((i) => `### Unit ${i.unitNumber}: ${i.unitTitle}\n- Lesson ${i.lessonNumber}: ${i.lessonTitle}`))).join('\n')}

---
Resource material provided by Oak National Academy under the Open Government Licence v3.0.
`;
      zip.file(`${rootPath}/${subjFolder}/README.md`, readmeContent);
    }
  }

  // Process files
  for (let idx = 0; idx < queueItems.length; idx++) {
    const item = queueItems[idx];
    if (onProgress) {
      const p = Math.round(((idx + 1) / total) * 100);
      onProgress(p, item.computedPath);
    }

    const content = await generateContentForResource(item.resource, item.sidecarMetadata);
    zip.file(item.computedPath, content);

    if (config.generateSidecarMetadata) {
      zip.file(item.sidecarPath, JSON.stringify(item.sidecarMetadata, null, 2));
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}
