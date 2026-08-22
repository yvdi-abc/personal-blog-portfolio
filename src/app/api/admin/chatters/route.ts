import { NextRequest } from 'next/server';
import {
  errorResponse,
  parseDataArray,
  safeParseJSON,
  successResponse,
  withAuth,
} from '@/lib/api-utils';
import { fileManager } from '@/lib/file-manager';

const CHATTER_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CHATTER_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSafeUrl(value: string): boolean {
  return value.startsWith('/') && !value.startsWith('//') || /^https?:\/\//i.test(value);
}

function normalizeChatters(value: unknown[]): Record<string, unknown>[] | null {
  const normalized: Record<string, unknown>[] = [];
  const usedSlugs = new Set<string>();

  for (const item of value) {
    if (!isRecord(item)) return null;

    const { slug, title, content, date, tags, mood, cover } = item;
    if (
      typeof slug !== 'string' ||
      !CHATTER_SLUG_PATTERN.test(slug) ||
      slug.length > 120 ||
      usedSlugs.has(slug) ||
      typeof title !== 'string' ||
      title.trim().length === 0 ||
      title.length > 200 ||
      typeof content !== 'string' ||
      content.length > 20_000 ||
      typeof date !== 'string' ||
      !CHATTER_DATE_PATTERN.test(date)
    ) {
      return null;
    }

    usedSlugs.add(slug);

    if (
      tags !== undefined &&
      (!Array.isArray(tags) ||
        tags.length > 20 ||
        tags.some((tag) => typeof tag !== 'string' || tag.length > 50))
    ) {
      return null;
    }

    if (mood !== undefined && (typeof mood !== 'string' || mood.length > 50)) {
      return null;
    }

    if (
      cover !== undefined &&
      (typeof cover !== 'string' || cover.length > 2_000 || !isSafeUrl(cover))
    ) {
      return null;
    }

    normalized.push({
      slug,
      title,
      content,
      date,
      ...(tags === undefined ? {} : { tags }),
      ...(mood === undefined ? {} : { mood }),
      ...(cover === undefined ? {} : { cover }),
    });
  }

  return normalized;
}

// 获取所有碎语
export async function GET() {
  return withAuth(async () => {
    try {
      const fileContents = await fileManager.readFile('src/data/chatters.ts');
      const chatters = parseDataArray(fileContents, 'chattersData');
      if (!chatters) return errorResponse('碎语数据格式无效', 500);
      return successResponse({ chatters });
    } catch (error) {
      return errorResponse('读取碎语失败', 500, error);
    }
  })();
}

// 保存碎语数据
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    const body = await safeParseJSON<{ chatters?: unknown }>(request);
    if (!body || !Array.isArray(body.chatters)) {
      return errorResponse('chatters 必须是数组', 400);
    }
    if (body.chatters.length > 500) {
      return errorResponse('碎语数量超过限制', 400);
    }

    const chatters = normalizeChatters(body.chatters);
    if (!chatters) {
      return errorResponse('碎语数据包含无效字段', 400);
    }

    try {
      const fileContent = `export const chattersData = ${JSON.stringify(chatters, null, 2)};\n`;
      await fileManager.writeFile('src/data/chatters.ts', fileContent, 'chore: update chatters via admin panel');
      return successResponse(null, '碎语已保存');
    } catch (error) {
      return errorResponse('保存碎语失败', 500, error);
    }
  })();
}
