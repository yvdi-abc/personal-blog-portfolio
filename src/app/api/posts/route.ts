import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const postsDirectory = path.join(process.cwd(), 'posts');

    if (!fs.existsSync(postsDirectory)) {
      return NextResponse.json([]);
    }

    const filenames = fs.readdirSync(postsDirectory);

    const posts = filenames
      .filter(name => name.endsWith('.md'))
      .map(filename => {
        const slug = filename.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, filename);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug,
          title: data.title || '无标题',
          description: data.description || '',
          date: data.date || '未知日期',
          tags: data.tags && Array.isArray(data.tags) ? data.tags : [],
          cover: data.cover || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error loading posts:', error);
    return NextResponse.json([]);
  }
}
