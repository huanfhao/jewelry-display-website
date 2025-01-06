const sharp = require('sharp');
const path = require('path');

async function createTempImages() {
  const targetDir = path.join(process.cwd(), 'public/images');

  // 创建轮播图
  const bannerTexts = [
    '精美珠宝 - 独特设计，匠心之作',
    '奢华体验 - 为您的优雅生活增添光彩',
    '完美礼物 - 为特别的日子准备完美礼物'
  ];

  for (let i = 0; i < 3; i++) {
    const svg = Buffer.from(`
      <svg width="1920" height="500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad${i + 1}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#818cf8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="1920" height="500" fill="url(#grad${i + 1})"/>
        <text x="960" y="250" font-family="Arial" font-size="48" fill="white" text-anchor="middle">
          ${bannerTexts[i]}
        </text>
      </svg>
    `);

    await sharp(svg)
      .toFile(path.join(targetDir, `banner${i + 1}.jpg`));
    console.log(`✓ 已创建 banner${i + 1}.jpg`);
  }

  // 创建公司介绍图
  const companySvg = Buffer.from(`
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradCompany" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#818cf8;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#gradCompany)"/>
      <text x="400" y="300" font-family="Arial" font-size="36" fill="white" text-anchor="middle">
        SY Jewelry 工作室
      </text>
    </svg>
  `);

  await sharp(companySvg)
    .toFile(path.join(targetDir, 'company.jpg'));
  console.log('✓ 已创建 company.jpg');
}

createTempImages().catch(console.error); 