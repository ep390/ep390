export type RubricItem = {
  id: string;
  label: string;
  maxPoints: number;
};

export function parseRubricText(rubricMarkdown: string): RubricItem[] {
  const lines = rubricMarkdown.split(/\r?\n/);

  const patterns: RegExp[] = [
    /^\s*[-*]\s+\*\*(\d+)\*\*\s+(.*)$/, // - **20** Description
    /^\s*[-*]\s+(\d+)\s+[-–—:]?\s*(.*)$/ // - 20 Description
  ];

  const items: RubricItem[] = [];
  for (const line of lines) {
    let match: RegExpMatchArray | null = null;
    for (const re of patterns) {
      match = line.match(re);
      if (match) break;
    }
    if (!match) continue;
    const maxPoints = Number(match[1]);
    if (!Number.isFinite(maxPoints)) continue;
    const label = (match[2] || "").trim();
    if (!label) continue;
    items.push({
      id: `${items.length}-${maxPoints}-${label.slice(0, 24)}`,
      label,
      maxPoints
    });
  }

  return items;
}

export function extractRubricSection(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const headingRegex = /^\s*#{1,6}\s+(.+?)\s*$/; // any markdown heading level

  // Find the rubric heading: prefer "Grading Rubric", otherwise any heading containing "Rubric"
  let startIndex = -1;
  let preferredIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(headingRegex);
    if (!m) continue;
    const title = m[1].trim().toLowerCase();
    if (preferredIndex === -1 && /\bgrading\s+rubric\b/.test(title)) {
      preferredIndex = i;
    }
    if (startIndex === -1 && /\brubric\b/.test(title)) {
      startIndex = i;
    }
  }

  const rubricHeadingIndex = preferredIndex !== -1 ? preferredIndex : startIndex;
  if (rubricHeadingIndex === -1) return "";

  // Collect lines until the next heading of any level
  const out: string[] = [];
  for (let i = rubricHeadingIndex + 1; i < lines.length; i++) {
    if (headingRegex.test(lines[i])) break;
    out.push(lines[i]);
  }
  return out.join("\n").trim();
}


