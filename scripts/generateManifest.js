import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

function generateManifestForDir(dirName, outputFileName) {
  const dirPath = path.join(__dirname, `../public/${dirName}`);
  const outputFile = path.join(__dirname, `../public/${outputFileName}`);

  try {
    if (!fs.existsSync(dirPath)) {
      console.warn(`[generateManifest] Directory ${dirPath} does not exist. Created empty ${outputFileName}.`);
      fs.writeFileSync(outputFile, JSON.stringify([]));
      return;
    }

    const files = fs.readdirSync(dirPath);
    const photos = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedExtensions.includes(ext);
    }).map(file => `/${dirName}/${file}`);

    fs.writeFileSync(outputFile, JSON.stringify(photos, null, 2));
    console.log(`[generateManifest] Successfully wrote ${photos.length} photos to ${outputFileName}`);
  } catch (error) {
    console.error(`[generateManifest] Error generating ${outputFileName}:`, error);
  }
}

generateManifestForDir('photos', 'photos.json');
generateManifestForDir('background_photos', 'background_photos.json');
