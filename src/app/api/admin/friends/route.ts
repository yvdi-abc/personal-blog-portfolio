import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const friendsFilePath = path.join(process.cwd(), 'src/data/friends.ts');

// 获取所有友链
export async function GET() {
  try {
    const fileContents = fs.readFileSync(friendsFilePath, 'utf8');
    const match = fileContents.match(/export const friendsData = (\[[\s\S]*?\]);/);
    if (match) {
      const friends = eval(match[1]);
      return NextResponse.json({ friends });
    }
    return NextResponse.json({ friends: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read friends' }, { status: 500 });
  }
}

// 保存友链数据
export async function POST(request: NextRequest) {
  try {
    const { friends } = await request.json();

    const fileContent = `export const friendsData = ${JSON.stringify(friends, null, 2)};
`;

    fs.writeFileSync(friendsFilePath, fileContent, 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save friends' }, { status: 500 });
  }
}
