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
    const projectsPath = path.join(process.cwd(), 'src', 'data', 'index.ts');
    const content = await fs.readFile(projectsPath, 'utf-8');

    // 提取 projectsData 数组
    const projectsMatch = content.match(/export const projectsData: Project\[\] = (\[[\s\S]*?\]);/);
    if (!projectsMatch) {
      return NextResponse.json([]);
    }

    // 使用 eval 解析（仅在服务端安全环境）
    const projectsData = eval(projectsMatch[1]);
    return NextResponse.json(projectsData);
  } catch (error) {
    console.error('Failed to read projects:', error);
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projects = await request.json();
    const projectsPath = path.join(process.cwd(), 'src', 'data', 'index.ts');
    const content = await fs.readFile(projectsPath, 'utf-8');

    // 构建新的项目数组字符串
    const projectsArrayStr = projects.map((p: any) => {
      const parts = [
        `name: '${escapeString(p.name)}'`,
        `desc: '${escapeString(p.desc)}'`,
        `tags: [${p.tags.map((t: string) => `'${escapeString(t)}'`).join(', ')}]`,
        `icon: '${escapeString(p.icon)}'`,
      ];

      if (p.link) {
        parts.push(`link: '${escapeString(p.link)}'`);
      }

      if (p.cover) {
        parts.push(`cover: '${escapeString(p.cover)}'`);
      }

      return `  { ${parts.join(', ')} }`;
    }).join(',\n');

    // 替换项目数组内容
    const newContent = content.replace(
      /export const projectsData: Project\[\] = \[[\s\S]*?\];/,
      `export const projectsData: Project[] = [\n${projectsArrayStr}\n];`
    );

    await fs.writeFile(projectsPath, newContent, 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save projects:', error);
    return NextResponse.json({ error: 'Failed to save projects' }, { status: 500 });
  }
}

function escapeString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}
