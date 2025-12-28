import { DocumentVersion, MarkdownDiff, MarkdownSection } from '@/types/document';

export const MAX_VERSION_HISTORY = 10;

export function stableHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash;
  }
  return Math.abs(hash).toString(36);
}

export function sanitizeMarkdown(markdown: string): string {
  const withoutScripts = markdown.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  // Strip any raw HTML tags to avoid structural breakage
  return withoutScripts.replace(/<\/?[^>]+>/g, '');
}

export function enforceHeadingHierarchy(markdown: string): string {
  let lastLevel = 0;

  return markdown
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(/^(#{1,6})\s+(.*)$/);
      if (!match) return line;

      const desiredLevel = Math.min(3, match[1].length);
      const nextLevel = lastLevel === 0 ? 1 : Math.min(desiredLevel, lastLevel + 1);
      lastLevel = nextLevel;

      return `${'#'.repeat(nextLevel)} ${match[2].trim()}`;
    })
    .join('\n');
}

export function normalizeMarkdown(markdown: string): string {
  return enforceHeadingHierarchy(sanitizeMarkdown(markdown));
}

export function parseMarkdownSections(markdown: string): MarkdownSection[] {
  const lines = markdown.split(/\r?\n/);
  const sections: MarkdownSection[] = [];
  let buffer: string[] = [];
  let bufferStart = 1;

  const flushParagraph = (endLine: number) => {
    if (!buffer.length) return;
    const content = buffer.join('\n');
    sections.push({
      id: stableHash(`paragraph-${content}-${sections.length}`),
      type: 'paragraph',
      content,
      startLine: bufferStart,
      endLine,
    });
    buffer = [];
  };

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);

    if (headingMatch) {
      flushParagraph(lineNumber - 1);
      const level = headingMatch[1].length as 1 | 2 | 3;
      const title = headingMatch[2].trim();
      sections.push({
        id: stableHash(`heading-${title}-${sections.length}`),
        type: 'heading',
        level,
        title,
        content: title,
        startLine: lineNumber,
        endLine: lineNumber,
      });
      bufferStart = lineNumber + 1;
      return;
    }

    if (line.trim() === '') {
      flushParagraph(lineNumber - 1);
      bufferStart = lineNumber + 1;
      return;
    }

    if (buffer.length === 0) {
      bufferStart = lineNumber;
    }
    buffer.push(line);
  });

  flushParagraph(lines.length);

  return sections;
}

export function addVersionSnapshot(
  versions: DocumentVersion[],
  markdown: string,
  sections: MarkdownSection[],
  limit = MAX_VERSION_HISTORY,
  versionNumber?: number
): DocumentVersion[] {
  const latest = versions[versions.length - 1];
  if (latest && latest.markdown === markdown) {
    return versions.slice(-limit);
  }

  const nextVersion: DocumentVersion = {
    id: stableHash(`${Date.now()}-${markdown.length}-${versions.length}`),
    markdown,
    sections,
    version: versionNumber ?? ((versions[versions.length - 1]?.version || 0) + 1),
    timestamp: new Date().toISOString(),
  };

  return [...versions, nextVersion].slice(-limit);
}

export function restoreVersion(
  versions: DocumentVersion[],
  versionId: string
): DocumentVersion | undefined {
  return versions.find((version) => version.id === versionId);
}

export function diffMarkdown(oldMd: string, newMd: string): MarkdownDiff {
  const oldSections = parseMarkdownSections(normalizeMarkdown(oldMd));
  const newSections = parseMarkdownSections(normalizeMarkdown(newMd));

  const added: MarkdownSection[] = [];
  const removed: MarkdownSection[] = [];
  const modified: MarkdownDiff['modified'] = [];
  const matchedOld = new Set<number>();

  const normalizeContent = (section: MarkdownSection) =>
    section.content.trim().replace(/\s+/g, ' ').toLowerCase();

  newSections.forEach((section) => {
    const matchIndex = oldSections.findIndex((candidate, idx) => {
      if (matchedOld.has(idx) || candidate.type !== section.type) return false;

      if (section.type === 'heading') {
        return candidate.title?.trim().toLowerCase() === section.title?.trim().toLowerCase();
      }

      return normalizeContent(candidate) === normalizeContent(section);
    });

    if (matchIndex === -1) {
      added.push(section);
      return;
    }

    matchedOld.add(matchIndex);
    const oldSection = oldSections[matchIndex];
    if (oldSection.content !== section.content || oldSection.level !== section.level) {
      modified.push({ from: oldSection, to: section });
    }
  });

  oldSections.forEach((section, idx) => {
    if (!matchedOld.has(idx)) {
      removed.push(section);
    }
  });

  return { added, removed, modified };
}
