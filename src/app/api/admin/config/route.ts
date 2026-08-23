import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const configFilePath = path.join(process.cwd(), 'src/siteConfig.ts');
const aboutFilePath = path.join(process.cwd(), 'src/app/about/about.md');

// 获取配置
export async function GET() {
  try {
    const configContent = fs.readFileSync(configFilePath, 'utf8');

    // 解析配置对象
    const config = {
      title: extractValue(configContent, 'title'),
      authorName: extractNestedValue(configContent, 'author', 'name'),
      bio: extractValue(configContent, 'bio'),
      avatarUrl: extractValue(configContent, 'avatarUrl'),
      githubUrl: extractNestedValue(configContent, 'social', 'github'),
      email: extractNestedValue(configContent, 'social', 'email'),
    };

    // 读取关于页面内容
    let aboutContent = '';
    if (fs.existsSync(aboutFilePath)) {
      aboutContent = fs.readFileSync(aboutFilePath, 'utf8');
    }

    return NextResponse.json({ config, aboutContent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

// 保存配置
export async function POST(request: NextRequest) {
  try {
    const { config, aboutContent } = await request.json();

    // 读取原始配置文件
    let configContent = fs.readFileSync(configFilePath, 'utf8');

    // 更新顶层配置值
    configContent = replaceValue(configContent, 'title', config.title);
    configContent = replaceValue(configContent, 'bio', config.bio);
    configContent = replaceValue(configContent, 'avatarUrl', config.avatarUrl);

    // 更新嵌套的 author.name
    configContent = replaceNestedValue(configContent, 'author', 'name', config.authorName);

    // 更新嵌套的 social.github 和 social.email
    configContent = replaceNestedValue(configContent, 'social', 'github', config.githubUrl);
    configContent = replaceNestedValue(configContent, 'social', 'email', config.email);

    // 写回配置文件
    fs.writeFileSync(configFilePath, configContent, 'utf8');

    // 保存关于页面内容
    if (aboutContent !== undefined) {
      fs.writeFileSync(aboutFilePath, aboutContent, 'utf8');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 });
  }
}

// 辅助函数：提取配置值
function extractValue(content: string, key: string): string {
  const patterns = [
    new RegExp(`${key}:\\s*"([^"]*)"`, 'i'),
    new RegExp(`${key}:\\s*'([^']*)'`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return match[1];
  }

  return '';
}

// 辅助函数：提取嵌套配置值
function extractNestedValue(content: string, parent: string, key: string): string {
  // 匹配 parent: { ... key: "value" ... }
  const parentRegex = new RegExp(`${parent}:\\s*\\{([^}]+)\\}`, 'is');
  const parentMatch = content.match(parentRegex);

  if (parentMatch) {
    const innerContent = parentMatch[1];
    return extractValue(innerContent, key);
  }

  return '';
}

// 辅助函数：替换配置值
function replaceValue(content: string, key: string, value: string): string {
  const patterns = [
    { regex: new RegExp(`(${key}:\\s*)"[^"]*"`, 'gi'), replacement: `$1"${value}"` },
    { regex: new RegExp(`(${key}:\\s*)'[^']*'`, 'gi'), replacement: `$1"${value}"` },
  ];

  for (const { regex, replacement } of patterns) {
    if (regex.test(content)) {
      return content.replace(regex, replacement);
    }
  }

  return content;
}

// 辅助函数：替换嵌套配置值
function replaceNestedValue(content: string, parent: string, key: string, value: string): string {
  // 匹配整个 parent: { ... } 块
  const parentRegex = new RegExp(`(${parent}:\\s*\\{)([^}]+)(\\})`, 'is');
  const match = content.match(parentRegex);

  if (match) {
    const before = match[1];
    const innerContent = match[2];
    const after = match[3];

    // 在内部内容中替换键值
    const updatedInner = replaceValue(innerContent, key, value);

    return content.replace(parentRegex, before + updatedInner + after);
  }

  return content;
}
