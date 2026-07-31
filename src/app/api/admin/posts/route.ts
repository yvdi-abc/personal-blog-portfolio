import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

// 获取所有文章列表
export async function GET() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
      .filter(name => name.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title || '',
          date: data.date || '',
          description: data.description || '',
          cover: data.cover || '',
          tags: data.tags || [],
          content,
        };
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read posts' }, { status: 500 });
  }
}

// 创建或更新文章
export async function POST(request: NextRequest) {
  try {
    const { slug, title, date, description, cover, tags, content } = await request.json();

    const frontMatter = {
      title,
      date,
      description,
      cover: cover || '',
      tags: tags || [],
    };

    const fileContent = matter.stringify(content, frontMatter);
    const filePath = path.join(postsDirectory, `${slug}.md`);

    fs.writeFileSync(filePath, fileContent, 'utf8');

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}

// 删除文章
export async function DELETE(request: NextRequest) {
  try {
    const { slug } = await request.json();
    const filePath = path.join(postsDirectory, `${slug}.md`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
