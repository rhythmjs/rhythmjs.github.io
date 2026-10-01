const MARKER = /\s*\[#([\w-]+)\]\s*$/;

export interface ParsedHeading {
  id: string;
  text: string;
}

export function splitHeading(raw: string, fallbackId: string): ParsedHeading {
  const match = MARKER.exec(raw);
  if (!match) return { id: fallbackId, text: raw };
  return { id: match[1]!, text: raw.slice(0, match.index) };
}
