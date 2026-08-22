const fs = require('fs');

function parseDataArray(content, exportName) {
  try {
    // 匹配导出的数组变量，支持 const/let/export const 等形式
    const regex = new RegExp(
      `(?:export\\s+)?(?:const|let|var)\\s+${exportName}\\s*(?::\\s*[^=]+)?\\s*=\\s*([\\s\\S]*?)(?:;\\s*(?:\\n|$))`,
      'm'
    );
    const match = content.match(regex);

    if (!match || !match[1]) {
      console.log('No match found');
      return null;
    }

    console.log('Match found:', match[1].substring(0, 200));

    // 提取数组部分
    let arrayStr = match[1].trim();

    // 移除可能的尾随分号
    if (arrayStr.endsWith(';')) {
      arrayStr = arrayStr.slice(0, -1).trim();
    }

    // 处理 JSON5 风格的数据：
    // 1. 移除尾随逗号
    arrayStr = arrayStr.replace(/,(\s*[}\]])/g, '$1');

    // 2. 处理单引号（只在不是已经是双引号的情况下）
    arrayStr = arrayStr.replace(/'/g, '"');

    // 3. 为没有引号的对象属性名添加引号
    arrayStr = arrayStr.replace(/([{,]\s*)(\w+)(\s*):/g, '$1"$2"$3:');

    console.log('Processed string:', arrayStr.substring(0, 300));

    const parsed = JSON.parse(arrayStr);

    if (!Array.isArray(parsed)) {
      console.log('Not an array');
      return null;
    }

    console.log('Success! Parsed', parsed.length, 'items');
    return parsed;
  } catch (error) {
    console.error(`Failed to parse data array "${exportName}":`, error.message);
    return null;
  }
}

const content = fs.readFileSync('src/data/index.ts', 'utf-8');
console.log('Testing parseDataArray with projectsData...\n');
const result = parseDataArray(content, 'projectsData');
console.log('\nResult:', result ? 'SUCCESS' : 'FAILED');
if (result) {
  console.log('First item:', JSON.stringify(result[0], null, 2));
}
