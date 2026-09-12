/**
 * Rasterises the Yogella mark into the PNG sizes a PWA install needs.
 *
 * Run with `node scripts/generate-icons.mjs` after changing the mark.
 * The SVG source lives here rather than in a file so the two variants
 * stay in lockstep: they differ only in whether the ground is a rounded
 * square or full-bleed, and drifting them apart is the usual way an app
 * ends up with a differently-shaped icon on Android than on iOS.
 *
 * Why three variants rather than one scaled file:
 *
 *  * standard (rounded square) is drawn as-is by the browser, so it has
 *    to carry its own corner radius.
 *  * maskable is cropped by the platform to whatever shape it prefers —
 *    circle, squircle, teardrop. It must be full-bleed, and the mark has
 *    to sit inside the inner 80% "safe zone" or the crop eats it. Giving
 *    it rounded corners would show as pale slivers at the edges.
 *  * apple-touch is rounded by iOS itself and must be fully opaque;
 *    transparency there renders as black.
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const SAGE = "#5f6b4f";
const CREAM = "#faf6ef";

/**
 * The mark, in a 32-unit square. A letterform rather than a leaf: at the
 * 16px a browser tab actually renders, a botanical silhouette collapses
 * into a blob while a Y keeps its shape. Stroked with round caps to echo
 * the app's pill-shaped buttons.
 */
function mark(scale = 1) {
  const path = `<path d="M10 9.5 16 17.5 22 9.5 M16 17.5 16 23.5" fill="none" stroke="${CREAM}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`;
  return scale === 1
    ? path
    : `<g transform="translate(16 16) scale(${scale}) translate(-16 -16)">${path}</g>`;
}

/**
 * width/height are set explicitly, not just a viewBox: sharp rasterises
 * an SVG at its intrinsic size, so a viewBox-only source would render at
 * 32x32 and then be upscaled into a blurry mess.
 */
function svg({ size, radius, scale }) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">` +
      `<rect width="32" height="32" rx="${radius}" fill="${SAGE}" />` +
      mark(scale) +
      `</svg>`,
  );
}

const TARGETS = [
  // Standard icons: rounded square, mark at its natural size.
  { out: "public/icons/icon-192.png", size: 192, radius: 8, scale: 1 },
  { out: "public/icons/icon-512.png", size: 512, radius: 8, scale: 1 },
  // Maskable: full-bleed, mark enlarged to fill the safe zone without
  // leaving it (the mark reaches ~9.2 units from centre at scale 1, and
  // the safe radius is 12.8, so 1.25 keeps a comfortable margin).
  { out: "public/icons/maskable-512.png", size: 512, radius: 0, scale: 1.25 },
  // iOS home screen: opaque, full-bleed, rounded by the platform.
  { out: "app/apple-icon.png", size: 180, radius: 0, scale: 1.15 },
];

await mkdir("public/icons", { recursive: true });

for (const { out, size, radius, scale } of TARGETS) {
  const info = await sharp(svg({ size, radius, scale }))
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`${out} — ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB`);
}
