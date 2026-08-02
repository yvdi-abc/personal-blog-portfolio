const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

const SOURCE_DIR = 'D:\\xvniCpan\\素材图';
const TARGET_DIR = 'D:\\xvniCpan\\personal web\\public\\gallery';

const categories = [
  { folder: '博物馆', title: '博物馆', description: '历史与文化的静默对话' },
  { folder: '动物园', title: '动物园', description: '可爱生灵的欢乐时光' },
  { folder: '都江堰＆青城山', title: '都江堰 & 青城山', description: '山水之间，心灵的归处' },
  { folder: '二次元', title: '二次元', description: '纸片人的梦幻世界' },
  { folder: '芙芙', title: '芙芙', description: '我的小可爱' },
  { folder: '日常', title: '日常', description: '生活中的点滴美好' }
];

async function processImages() {
  console.log('开始处理图片...\n');

  const albumsData = [];

  for (const category of categories) {
    const sourceFolder = path.join(SOURCE_DIR, category.folder);
    const targetFolder = path.join(TARGET_DIR, category.folder);

    if (!fs.existsSync(sourceFolder)) {
      console.log(`⚠ 跳过: ${category.folder} (源文件夹不存在)`);
      continue;
    }

    const files = fs.readdirSync(sourceFolder)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort();

    if (files.length === 0) {
      console.log(`⚠ 跳过: ${category.folder} (没有图片文件)`);
      continue;
    }

    console.log(`📁 处理 ${category.folder} (${files.length} 张图片)`);

    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const photos = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sourcePath = path.join(sourceFolder, file);
      const targetPath = path.join(targetFolder, file);

      // 复制并压缩图片 (使用 Node.js fs 直接复制)
      fs.copyFileSync(sourcePath, targetPath);

      const photoUrl = `/gallery/${category.folder}/${file}`;
      photos.push({
        url: photoUrl,
        caption: undefined
      });

      process.stdout.write(`  ✓ ${i + 1}/${files.length}\r`);
    }

    console.log(`  ✓ 完成 ${files.length} 张\n`);

    // 生成唯一的 ID
    const pinyinMap = {
      '博': 'bo', '物': 'wu', '馆': 'guan',
      '动': 'dong', '园': 'yuan',
      '都': 'du', '江': 'jiang', '堰': 'yan',
      '青': 'qing', '城': 'cheng', '山': 'shan',
      '二': 'er', '次': 'ci', '元': 'yuan',
      '芙': 'fu',
      '日': 'ri', '常': 'chang'
    };

    const albumId = category.folder
      .toLowerCase()
      .replace(/[一-龥]/g, (char) => pinyinMap[char] || char)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    albumsData.push({
      id: albumId,
      title: category.title,
      description: category.description,
      cover: photos[0]?.url || '',
      date: '2026',
      photos: photos
    });
  }

  // 生成 albums.ts 文件
  const albumsCode = `export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = ${JSON.stringify(albumsData, null, 2)};
`;

  const albumsPath = path.join('D:\\xvniCpan\\personal web\\src\\data', 'albums.ts');
  fs.writeFileSync(albumsPath, albumsCode, 'utf8');

  console.log(`\n✅ 所有图片处理完成！`);
  console.log(`📊 共创建 ${albumsData.length} 个相册`);
  console.log(`💾 数据已写入: ${albumsPath}`);
}

processImages().catch(console.error);
