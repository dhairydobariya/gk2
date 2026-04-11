/**
 * Image optimization script using sharp
 * Run: node scripts/optimize-images.js
 *
 * Converts banner PNGs and product JPEGs to WebP
 * and resizes them to appropriate display dimensions.
 */

import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const tasks = [
  // Banner images — resize to 900px wide (enough for full-width hero)
  { input: 'public/banners/banner-1.png', output: 'public/banners/banner-1.webp', width: 900, quality: 82 },
  { input: 'public/banners/banner-2.png', output: 'public/banners/banner-2.webp', width: 900, quality: 82 },
  { input: 'public/banners/banner-3.png', output: 'public/banners/banner-3.webp', width: 900, quality: 82 },
  { input: 'public/banners/banner-4.png', output: 'public/banners/banner-4.webp', width: 900, quality: 82 },

  // Blog banner images
  { input: 'public/banners/blog-what-is-switchgear.png',        output: 'public/banners/blog-what-is-switchgear.webp',        width: 800, quality: 80 },
  { input: 'public/banners/blog-types-of-switchgear.png',       output: 'public/banners/blog-types-of-switchgear.webp',       width: 800, quality: 80 },
  { input: 'public/banners/blog-mcb-vs-mccb.png',               output: 'public/banners/blog-mcb-vs-mccb.webp',               width: 800, quality: 80 },
  { input: 'public/banners/blog-importance-of-switchgear.png',  output: 'public/banners/blog-importance-of-switchgear.webp',  width: 800, quality: 80 },
  { input: 'public/banners/blog-best-switchgear-manufacturer.png', output: 'public/banners/blog-best-switchgear-manufacturer.webp', width: 800, quality: 80 },

  // Logo
  { input: 'public/logo.png', output: 'public/logo.webp', width: 400, quality: 85 },

  // OG image
  { input: 'public/og-image.png', output: 'public/og-image.webp', width: 1200, quality: 85 },
];

async function run() {
  let converted = 0;
  let skipped = 0;

  for (const task of tasks) {
    const inputPath = join(root, task.input);
    const outputPath = join(root, task.output);

    if (!existsSync(inputPath)) {
      console.log(`⚠️  Skipped (not found): ${task.input}`);
      skipped++;
      continue;
    }

    try {
      const info = await sharp(inputPath)
        .resize({ width: task.width, withoutEnlargement: true })
        .webp({ quality: task.quality })
        .toFile(outputPath);

      const inputSize = (await sharp(inputPath).metadata()).size || 0;
      console.log(`✅ ${task.input} → ${task.output} (${Math.round(info.size / 1024)}KB)`);
      converted++;
    } catch (err) {
      console.error(`❌ Failed: ${task.input} — ${err.message}`);
    }
  }

  console.log(`\nDone: ${converted} converted, ${skipped} skipped.`);
  console.log('\nNext step: Update banners.json and blog.js to use .webp extensions.');
}

run();
