import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { slug } = await params;
    const postsDirectory = path.join(process.cwd(), 'posts');
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return NextResponse.json({
      title: data.title || '无标题',
      date: data.date || '未知日期',
      tags: data.tags && Array.isArray(data.tags) ? data.tags : [],
      cover: data.cover || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop',
      description: data.description || '',
      content: content
    });
  } catch (error) {
    console.error('Error loading post:', error);
    return NextResponse.json({ error: 'Failed to load post' }, { status: 500 });
  }
}
