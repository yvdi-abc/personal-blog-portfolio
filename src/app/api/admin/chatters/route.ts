import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const chattersFilePath = path.join(process.cwd(), 'src/data/chatters.ts');

// 获取所有碎语
export async function GET() {
  try {
    const fileContents = fs.readFileSync(chattersFilePath, 'utf8');
    // 简单解析 TypeScript 文件中的数据
    const match = fileContents.match(/export const chattersData = (\[[\s\S]*?\]);/);
    if (match) {
      // 使用 eval 解析（仅用于开发环境）
      const chatters = eval(match[1]);
      return NextResponse.json({ chatters });
    }
    return NextResponse.json({ chatters: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read chatters' }, { status: 500 });
  }
}

// 保存碎语数据
export async function POST(request: NextRequest) {
  try {
    const { chatters } = await request.json();

    const fileContent = `export const chattersData = ${JSON.stringify(chatters, null, 2)};
`;

    fs.writeFileSync(chattersFilePath, fileContent, 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save chatters' }, { status: 500 });
  }
}
