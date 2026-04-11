/**
 * Convert all product JPEG images to WebP
 * Run: node scripts/optimize-products.js
 */

import sharp from 'sharp';
import { readdirSync, existsSync } from 'fs';
import { join, basename, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const productsDir = join(root, 'public/products');

async function run() {
  const files = readdirSync(productsDir).filter(f =>
    ['.jpeg', '.jpg', '.png'].includes(extname(f).toLowerCase())
  );

  let converted = 0;
  for (const file of files) {
    const inputPath = join(productsDir, file);
    const outputName = basename(file, extname(file)) + '.webp';
    const outputPath = join(productsDir, outputName);

    try {
      const info = await sharp(inputPath)
        .resize({ width: 600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outputPath);
      console.log(`✅ ${file} → ${outputName} (${Math.round(info.size / 1024)}KB)`);
      converted++;
    } catch (err) {
      console.error(`❌ ${file}: ${err.message}`);
    }
  }

  // Also convert logo
  const logoIn = join(root, 'public/logo.png');
  const logoOut = join(root, 'public/logo.webp');
  if (existsSync(logoIn) && !existsSync(logoOut)) {
    const info = await sharp(logoIn).resize({ width: 400 }).webp({ quality: 85 }).toFile(logoOut);
    console.log(`✅ logo.png → logo.webp (${Math.round(info.size / 1024)}KB)`);
  }

  console.log(`\nDone: ${converted} product images converted.`);
}

run();
