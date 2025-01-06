const sharp = require('sharp');
const path = require('path');

async function createCompanyImage() {
  const svg = Buffer.from(`
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#grad)"/>
      <text x="400" y="280" font-family="Arial" font-size="48" fill="white" text-anchor="middle">
        SY Jewelry
      </text>
      <text x="400" y="340" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
        匠心之作，精致生活
      </text>
    </svg>
  `);

  await sharp(svg)
    .toFile(path.join(process.cwd(), 'public/images/company.jpg'));
  
  console.log('✓ 已创建临时公司介绍图片');
}

createCompanyImage().catch(console.error); 