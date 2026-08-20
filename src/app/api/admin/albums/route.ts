import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const albumsPath = path.join(process.cwd(), 'src', 'data', 'albums.ts');
    const content = await fs.readFile(albumsPath, 'utf-8');

    // 提取 albums 数组
    const albumsMatch = content.match(/export const albums: Album\[\] = (\[[\s\S]*?\]);/);
    if (!albumsMatch) {
      return NextResponse.json([]);
    }

    // 使用 eval 解析
    const albums = eval(albumsMatch[1]);
    return NextResponse.json(albums);
  } catch (error) {
    console.error('Failed to read albums:', error);
    return NextResponse.json({ error: 'Failed to read albums' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const albums = await request.json();
    const albumsPath = path.join(process.cwd(), 'src', 'data', 'albums.ts');

    // 构建相册数组 JSON 字符串（格式化）
    const albumsJson = JSON.stringify(albums, null, 2);

    // 构建完整文件内容
    const newContent = `export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = ${albumsJson};
`;

    await fs.writeFile(albumsPath, newContent, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save albums:', error);
    return NextResponse.json({ error: 'Failed to save albums' }, { status: 500 });
  }
}
