import { readdir, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

const sourceDir = '../banana.images';
const targetDir = './public/timeline-images';

async function main() {
  try {
    // Create target directory if it doesn't exist
    await mkdir(targetDir, { recursive: true });
    
    // Get all files from source directory
    const files = await readdir(sourceDir);
    
    // Process each file
    for (const file of files) {
      const inputPath = join(sourceDir, file);
      const outputPath = join(targetDir, file.replace(/\.(heic|jpg|jpeg)$/i, '.jpg'));
      
      try {
        await sharp(inputPath)
          .jpeg({ quality: 85 })
          .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
          .toFile(outputPath);
        
        console.log(`Converted: ${file} -> ${outputPath}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
    
    console.log('All images processed!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 