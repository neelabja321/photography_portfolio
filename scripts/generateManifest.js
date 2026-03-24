import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const photosDir = path.join(__dirname, '../public/photos');
const outputFile = path.join(__dirname, '../public/photos.json');

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

try {
  if (!fs.existsSync(photosDir)) {
    console.warn(`[generateManifest] Directory ${photosDir} does not exist. Created empty photos.json.`);
    fs.writeFileSync(outputFile, JSON.stringify([]));
    process.exit(0);
  }

  const files = fs.readdirSync(photosDir);
  const photos = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return supportedExtensions.includes(ext);
  }).map(file => `/photos/${file}`); // Output absolute paths from public root

  fs.writeFileSync(outputFile, JSON.stringify(photos, null, 2));
  console.log(`[generateManifest] Successfully wrote ${photos.length} photos to photos.json`);
} catch (error) {
  console.error('[generateManifest] Error generating photos manifest:', error);
}
