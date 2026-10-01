import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { APIRoute, GetStaticPaths } from "astro";
import sharp from "sharp";

const sizes = [180, 192, 512];

export const getStaticPaths: GetStaticPaths = () => sizes.map((size) => ({ params: { size: String(size) } }));

export const GET: APIRoute = async ({ params }) => {
  const size = Number(params.size);
  const svg = readFileSync(join(process.cwd(), "public", "favicon.svg"));
  const png = await sharp(svg, { density: Math.ceil((72 * size) / 32) })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();
  return new Response(new Uint8Array(png), { headers: { "content-type": "image/png" } });
};
