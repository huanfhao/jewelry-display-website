import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const IMAGES = {
  'hero-bg.jpg': 'https://your-image-url/hero-bg.jpg',
  'about.jpg': 'https://your-image-url/about.jpg',
  'og-image.jpg': 'https://your-image-url/og-image.jpg',
  // 添加更多图片...
};

async function downloadImage(url: string, filepath: string) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFileSync(filepath, buffer);
}

async function main() {
  const imagesDir = path.join(process.cwd(), 'public/images');
  
  // 创建目录
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // 下载图片
  for (const [filename, url] of Object.entries(IMAGES)) {
    const filepath = path.join(imagesDir, filename);
    await downloadImage(url, filepath);
    console.log(`Downloaded: ${filename}`);
  }
}

main().catch(console.error); 