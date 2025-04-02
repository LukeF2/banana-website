import fs from 'fs/promises';
import path from 'path';
import heicConvert from 'heic-convert';

const sourceDir = './public/timeline-images';
const targetDir = './public/timeline-images';

async function convertHeicToJpg(inputPath, outputPath) {
  try {
    const inputBuffer = await fs.readFile(inputPath);
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9
    });
    await fs.writeFile(outputPath, outputBuffer);
    console.log(`Converted ${path.basename(inputPath)} to ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
}

async function processImages() {
  try {
    const files = await fs.readdir(sourceDir);
    
    for (const file of files) {
      if (file.toLowerCase().endsWith('.heic')) {
        const inputPath = path.join(sourceDir, file);
        const outputPath = path.join(targetDir, file.replace(/\.heic$/i, '.jpg'));
        await convertHeicToJpg(inputPath, outputPath);
      }
    }
    
    console.log('All conversions completed!');
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

processImages(); 