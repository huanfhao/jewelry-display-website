const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function processImages() {
  const sourceDir = path.join(process.cwd(), 'public/images/original');
  const targetDir = path.join(process.cwd(), 'public/images');

  // 确保目标目录存在
  await fs.mkdir(targetDir, { recursive: true });

  // 处理轮播图
  const bannerSizes = { width: 1920, height: 500 };
  for (let i = 1; i <= 3; i++) {
    try {
      await sharp(path.join(sourceDir, `banner${i}.jpg`))
        .resize(bannerSizes.width, bannerSizes.height, {
          fit: 'cover',
          position: 'center'
        })
        .toFile(path.join(targetDir, `banner${i}.jpg`));
      console.log(`✓ 已处理 banner${i}.jpg`);
    } catch (error) {
      console.error(`✗ 处理 banner${i}.jpg 失败:`, error.message);
    }
  }

  // 处理公司图片
  try {
    await sharp(path.join(sourceDir, 'company.jpg'))
      .resize(800, 600, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(path.join(targetDir, 'company.jpg'));
    console.log('✓ 已处理 company.jpg');
  } catch (error) {
    console.error('✗ 处理 company.jpg 失败:', error.message);
  }

  // 创建占位图
  try {
    await sharp({
      create: {
        width: 400,
        height: 400,
        channels: 4,
        background: { r: 200, g: 200, b: 200, alpha: 1 }
      }
    })
      .composite([
        {
          input: Buffer.from(
            '<svg><rect width="400" height="400" fill="#CCCCCC"/><text x="50%" y="50%" text-anchor="middle" font-size="20" fill="#666666">暂无图片</text></svg>'
          ),
          top: 0,
          left: 0,
        },
      ])
      .toFile(path.join(targetDir, 'placeholder.jpg'));
    console.log('✓ 已创建 placeholder.jpg');
  } catch (error) {
    console.error('✗ 创建 placeholder.jpg 失败:', error.message);
  }
}

processImages().catch(console.error); 