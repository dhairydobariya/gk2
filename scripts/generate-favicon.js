/**
 * Generate square favicon from logo
 * Places logo centered on a blue square background
 * Run: node scripts/generate-favicon.js
 */
import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

async function run() {
  const size = 512;
  const padding = 80;
  const innerSize = size - padding * 2;

  // Create blue square background
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="80" fill="#1e3a8a"/>
    </svg>`
  );

  // Resize logo to fit inside with padding, keep aspect ratio
  const logoResized = await sharp(join(root, 'public/logo.png'))
    .resize(innerSize, Math.round(innerSize * (358 / 696)), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .negate({ alpha: false }) // invert to white
    .toBuffer();

  // Get actual dimensions after resize
  const meta = await sharp(logoResized).metadata();
  const logoH = meta.height || Math.round(innerSize * (358 / 696));
  const top = Math.round((size - logoH) / 2);
  const left = padding;

  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 30, g: 58, b: 138, alpha: 255 } } })
    .composite([
      { input: Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="80" fill="#1e3a8a"/></svg>`), top: 0, left: 0 },
      { input: logoResized, top, left },
    ])
    .png()
    .toFile(join(root, 'public/favicon-512.png'));

  // Also generate 32x32 ICO-compatible PNG
  await sharp(join(root, 'public/favicon-512.png'))
    .resize(32, 32)
    .png()
    .toFile(join(root, 'public/favicon-32.png'));

  await sharp(join(root, 'public/favicon-512.png'))
    .resize(180, 180)
    .png()
    .toFile(join(root, 'public/apple-touch-icon.png'));

  console.log('Generated: favicon-512.png, favicon-32.png, apple-touch-icon.png');
}

run().catch(console.error);
