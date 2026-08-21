import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { getGitHubClient } from '@/lib/github';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const siteConfigPath = path.join(process.cwd(), 'src', 'siteConfig.ts');
    const content = await fs.readFile(siteConfigPath, 'utf-8');

    // 解析配置文件内容
    const settings = {
      title: extractValue(content, 'title'),
      authorName: extractValue(content, 'author.name'),
      navTitle: extractValue(content, 'navTitle'),
      bio: extractValue(content, 'bio'),
      avatarUrl: extractValue(content, 'avatarUrl'),
      email: extractValue(content, 'social.email'),
      github: extractValue(content, 'social.github'),
      musicIds: extractArrayValue(content, 'musicIds'),
      danmakuList: extractArrayValue(content, 'danmakuList'),
      buildDate: extractValue(content, 'buildDate'),
      icpName: extractValue(content, 'icpConfig.name'),
      icpLink: extractValue(content, 'icpConfig.link'),
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to read site config:', error);
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await request.json();

    // 验证必填字段
    if (!settings.title || !settings.authorName || !settings.navTitle) {
      return NextResponse.json({ error: 'Title, author name, and nav title are required' }, { status: 400 });
    }

    // 构建新的配置文件内容
    const newContent = `export const siteConfig = {
  title: "${escapeString(settings.title)}",
  author: {
    name: "${escapeString(settings.authorName)}",
  },
  navTitle: "${escapeString(settings.navTitle)}",
  bio: "${escapeString(settings.bio || '')}",
  avatarUrl: "${escapeString(settings.avatarUrl || '')}",
  social: {
    email: "${escapeString(settings.email || '')}",
    github: "${escapeString(settings.github || '')}",
  },
  musicIds: [${settings.musicIds && settings.musicIds.length > 0 ? settings.musicIds.map((id: string) => `"${escapeString(id)}"`).join(', ') : ''}],
  danmakuList: [${settings.danmakuList && settings.danmakuList.length > 0 ? settings.danmakuList.map((text: string) => `"${escapeString(text)}"`).join(', ') : ''}],
  buildDate: "${escapeString(settings.buildDate || new Date().toISOString())}",
  icpConfig: {
    name: "${escapeString(settings.icpName || '')}",
    link: "${escapeString(settings.icpLink || '')}"
  }
};
`;

    const filePath = 'src/siteConfig.ts';
    const githubClient = getGitHubClient();

    if (githubClient) {
      // 生产环境：通过 GitHub API 更新
      try {
        const { sha } = await githubClient.getFile(filePath);
        await githubClient.updateFile(
          filePath,
          newContent,
          'chore: update site configuration via admin panel',
          sha
        );

        return NextResponse.json({
          success: true,
          message: '配置已保存到 GitHub，Vercel 将自动重新部署（约 1-2 分钟）'
        });
      } catch (error) {
        console.error('GitHub API error:', error);
        return NextResponse.json({
          error: 'Failed to update via GitHub API',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
      }
    } else {
      // 本地环境：直接写入文件
      const siteConfigPath = path.join(process.cwd(), filePath);
      await fs.writeFile(siteConfigPath, newContent, 'utf-8');

      return NextResponse.json({
        success: true,
        message: '配置已保存，请重启开发服务器以应用更改'
      });
    }
  } catch (error) {
    console.error('Failed to save site config:', error);
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}

// 辅助函数：从配置内容中提取值
function extractValue(content: string, key: string): string {
  const parts = key.split('.');
  let regex;

  if (parts.length === 1) {
    regex = new RegExp(`${parts[0]}:\\s*["']([^"']+)["']`);
  } else if (parts.length === 2) {
    const sectionRegex = new RegExp(`${parts[0]}:\\s*\\{([^}]+)\\}`);
    const sectionMatch = content.match(sectionRegex);
    if (sectionMatch) {
      const section = sectionMatch[1];
      regex = new RegExp(`${parts[1]}:\\s*["']([^"']+)["']`);
      const match = section.match(regex);
      return match ? match[1] : '';
    }
    return '';
  }

  const match = content.match(regex!);
  return match ? match[1] : '';
}

// 辅助函数：从配置内容中提取数组值
function extractArrayValue(content: string, key: string): string[] {
  const regex = new RegExp(`${key}:\\s*\\[([^\\]]+)\\]`);
  const match = content.match(regex);
  if (!match) return [];

  const arrayContent = match[1];
  const items = arrayContent.match(/["']([^"']+)["']/g);
  return items ? items.map(item => item.replace(/["']/g, '')) : [];
}

// 辅助函数：转义字符串中的特殊字符
function escapeString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}
