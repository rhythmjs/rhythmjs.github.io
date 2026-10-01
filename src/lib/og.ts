import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";
import sharp from "sharp";

export interface OgCard {
  eyebrow: string;
  title: string;
  lead: string;
  badge?: string;
  footer: string;
}

const WIDTH = 1200;
const HEIGHT = 630;

const colors = {
  background: "#141a1a",
  foreground: "#edf7f3",
  muted: "#a5b9b1",
  accent: "#5ee9bc",
  line: "#27352f",
};

const font = (pkg: string, file: string) => readFileSync(join(process.cwd(), "node_modules", pkg, "files", file));

let fonts: { name: string; data: Buffer; weight: 400 | 500 | 600; style: "normal" }[] | undefined;

function loadFonts() {
  fonts ??= [
    { name: "Geist", data: font("@fontsource/geist", "geist-latin-400-normal.woff"), weight: 400, style: "normal" },
    { name: "Geist", data: font("@fontsource/geist", "geist-latin-600-normal.woff"), weight: 600, style: "normal" },
    {
      name: "JetBrains Mono",
      data: font("@fontsource/jetbrains-mono", "jetbrains-mono-latin-500-normal.woff"),
      weight: 500,
      style: "normal",
    },
  ];
  return fonts;
}

type Style = Record<string, string | number>;
type Node = { type: string; props: { style?: Style; children?: Node | string | (Node | string)[] } };

const h = (type: string, style: Style, ...children: (Node | string | undefined)[]): Node => ({
  type,
  props: {
    style: { display: "flex", ...style },
    children: children.filter((child) => child !== undefined) as (Node | string)[],
  },
});

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

const titleSize = (title: string) => (title.length <= 28 ? 84 : title.length <= 48 ? 72 : title.length <= 70 ? 60 : 50);

const mark = () =>
  h(
    "div",
    { display: "flex", alignItems: "flex-end", gap: 5, height: 36 },
    ...[20, 36, 14, 28].map((height) => h("div", { width: 7, height, background: colors.accent })),
  );

function tree(source: OgCard): Node {
  const card = { ...source, title: clip(source.title, 90), lead: clip(source.lead, 120) };
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: WIDTH,
      height: HEIGHT,
      padding: "64px 72px",
      background: colors.background,
      color: colors.foreground,
      fontFamily: "Geist",
    },
    h(
      "div",
      { display: "flex", alignItems: "center", justifyContent: "space-between" },
      h(
        "div",
        { display: "flex", alignItems: "center", gap: 18 },
        mark(),
        h("div", { fontSize: 34, fontWeight: 600 }, "RhythmJS"),
      ),
      card.badge
        ? h(
            "div",
            {
              display: "flex",
              padding: "8px 18px",
              border: `2px solid ${colors.line}`,
              color: colors.accent,
              fontFamily: "JetBrains Mono",
              fontWeight: 500,
              fontSize: 24,
            },
            card.badge,
          )
        : undefined,
    ),
    h(
      "div",
      { display: "flex", flexDirection: "column", gap: 24 },
      h(
        "div",
        { fontSize: 26, fontWeight: 600, color: colors.accent, textTransform: "uppercase", letterSpacing: 3 },
        card.eyebrow,
      ),
      h("div", { fontSize: titleSize(card.title), fontWeight: 600, lineHeight: 1.08, letterSpacing: -2 }, card.title),
      h("div", { fontSize: 32, lineHeight: 1.35, color: colors.muted }, card.lead),
    ),
    h(
      "div",
      { display: "flex", alignItems: "center", borderTop: `2px solid ${colors.line}`, paddingTop: 28 },
      h("div", { fontFamily: "JetBrains Mono", fontWeight: 500, fontSize: 26, color: colors.muted }, card.footer),
    ),
  );
}

export async function renderCard(card: OgCard): Promise<Buffer> {
  const svg = await satori(tree(card) as never, { width: WIDTH, height: HEIGHT, fonts: loadFonts() });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
