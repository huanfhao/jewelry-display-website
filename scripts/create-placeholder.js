const sharp = require('sharp');
const path = require('path');

async function createPlaceholder() {
  try {
    const svg = Buffer.from(`
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#f3f4f6"/>
        <text x="200" y="200" font-family="Arial" font-size="24" fill="#9ca3af" text-anchor="middle">暂无图片</text>
      </svg>
    `);

    await sharp(svg)
      .toFile(path.join(process.cwd(), 'public/images/placeholder.jpg'));
    
    console.log('✓ 已创建 placeholder.jpg');
  } catch (error) {
    console.error('✗ 创建 placeholder.jpg 失败:', error.message);
  }
}

createPlaceholder().catch(console.error); 