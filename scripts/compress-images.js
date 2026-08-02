const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GALLERY_DIR = 'D:\\xvniCpan\\personal web\\public\\gallery';

const categories = ['博物馆', '动物园', '都江堰＆青城山', '二次元', '芙芙', '日常'];

console.log('开始压缩图片...\n');

let totalOriginal = 0;
let totalCompressed = 0;
let fileCount = 0;

for (const category of categories) {
  const categoryPath = path.join(GALLERY_DIR, category);

  if (!fs.existsSync(categoryPath)) continue;

  const files = fs.readdirSync(categoryPath)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file));

  console.log(`📁 ${category} (${files.length} 张)`);

  for (const file of files) {
    const filePath = path.join(categoryPath, file);
    const stat = fs.statSync(filePath);
    const originalSize = stat.size;

    // 使用 ffmpeg 压缩图片
    try {
      const tempPath = filePath + '.tmp.jpg';

      // 压缩为质量 75%，最大宽度 1920px
      execSync(`ffmpeg -i "${filePath}" -vf "scale='min(1920,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease" -q:v 5 "${tempPath}" -y 2>nul`, {
        stdio: 'pipe'
      });

      const compressedStat = fs.statSync(tempPath);
      const compressedSize = compressedStat.size;

      // 如果压缩后更小，则替换原文件
      if (compressedSize < originalSize) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);

        totalOriginal += originalSize;
        totalCompressed += compressedSize;
        fileCount++;

        const savedKB = ((originalSize - compressedSize) / 1024).toFixed(1);
        const percent = ((1 - compressedSize / originalSize) * 100).toFixed(1);
        process.stdout.write(`  ✓ ${file}: -${savedKB}KB (${percent}%)\n`);
      } else {
        fs.unlinkSync(tempPath);
        process.stdout.write(`  ⊙ ${file}: 已是最优\n`);
      }
    } catch (err) {
      process.stdout.write(`  ✗ ${file}: 压缩失败\n`);
    }
  }

  console.log('');
}

const savedMB = ((totalOriginal - totalCompressed) / 1024 / 1024).toFixed(2);
const totalPercent = totalOriginal > 0 ? ((1 - totalCompressed / totalOriginal) * 100).toFixed(1) : 0;

console.log(`\n✅ 压缩完成！`);
console.log(`📊 处理文件: ${fileCount} 个`);
console.log(`💾 节省空间: ${savedMB}MB (${totalPercent}%)`);
