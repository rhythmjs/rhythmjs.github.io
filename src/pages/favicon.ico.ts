import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { APIRoute } from "astro";
import sharp from "sharp";

const SIZE = 48;

export const GET: APIRoute = async () => {
  const svg = readFileSync(join(process.cwd(), "public", "favicon.svg"));
  const png = await sharp(svg, { density: Math.ceil((72 * SIZE) / 32) })
    .resize(SIZE, SIZE)
    .png({ compressionLevel: 9 })
    .toBuffer();

  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(SIZE, 6);
  header.writeUInt8(SIZE, 7);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(header.length, 18);

  return new Response(new Uint8Array(Buffer.concat([header, png])), { headers: { "content-type": "image/x-icon" } });
};
