import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const sourceDir = '../banana.images';
const targetDir = './public/timeline-images';

async function convertImage(inputPath, outputPath) {
  try {
    // Read the input file
    const inputBuffer = await fs.readFile(inputPath);
    
    // Use sharp to convert and optimize the image
    await sharp(inputBuffer)
      .jpeg({ quality: 85, mozjpeg: true })
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .toFile(outputPath);
    
    console.log(`Processed ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
  }
}

async function processImages() {
  try {
    // Ensure target directory exists
    await fs.mkdir(targetDir, { recursive: true });
    
    // Get all files from source directory
    const files = await fs.readdir(sourceDir);
    
    // Process each file
    for (const file of files) {
      const inputPath = path.join(sourceDir, file);
      const outputPath = path.join(targetDir, path.basename(file).replace(/\.(heic|jpg|jpeg)$/i, '.jpg'));
      
      await convertImage(inputPath, outputPath);
    }
    
    console.log('All images processed successfully!');
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

processImages(); 