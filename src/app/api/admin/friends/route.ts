import { NextRequest } from 'next/server';
import {
  errorResponse,
  parseDataArray,
  safeParseJSON,
  successResponse,
  withAuth,
} from '@/lib/api-utils';
import { fileManager } from '@/lib/file-manager';

const FRIEND_URL_LIMIT = 2_000;
const FRIEND_NAME_LIMIT = 120;
const FRIEND_DESCRIPTION_LIMIT = 1_000;
const FRIEND_THEME_COLOR_PATTERN = /^#[0-9a-f]{3,8}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSafeUrl(value: string): boolean {
  return (
    (value.startsWith('/') && !value.startsWith('//')) ||
    /^https?:\/\//i.test(value)
  );
}

function normalizeFriends(value: unknown[]): Record<string, unknown>[] | null {
  const normalized: Record<string, unknown>[] = [];
  const usedIds = new Set<number>();
  let nextId = 1;

  for (const item of value) {
    if (!isRecord(item)) return null;

    if (item.id !== undefined) {
      if (
        typeof item.id !== 'number' ||
        !Number.isSafeInteger(item.id) ||
        item.id < 1
      ) {
        return null;
      }
      if (usedIds.has(item.id)) return null;
      usedIds.add(item.id);
      nextId = Math.max(nextId, item.id + 1);
    }
  }

  for (const item of value) {
    if (!isRecord(item)) return null;

    const rawUrl = item.url !== undefined ? item.url : item.link;
    if (
      item.url !== undefined &&
      typeof item.url !== 'string'
    ) {
      return null;
    }
    if (item.link !== undefined && typeof item.link !== 'string') {
      return null;
    }

    const explicitId = item.id;
    let id: number;

    if (explicitId === undefined) {
      id = nextAvailableId(usedIds, nextId);
      usedIds.add(id);
      nextId = id + 1;
    } else {
      if (
        typeof explicitId !== 'number' ||
        !Number.isSafeInteger(explicitId) ||
        explicitId < 1
      ) {
        return null;
      }
      id = explicitId;
    }

    const themeColor = item.themeColor === undefined ? '#14b8a6' : item.themeColor;
    if (
      typeof item.name !== 'string' ||
      item.name.trim().length === 0 ||
      item.name.length > FRIEND_NAME_LIMIT ||
      typeof rawUrl !== 'string' ||
      rawUrl.length > FRIEND_URL_LIMIT ||
      !isSafeUrl(rawUrl) ||
      typeof item.avatar !== 'string' ||
      item.avatar.length > FRIEND_URL_LIMIT ||
      !isSafeUrl(item.avatar) ||
      typeof item.description !== 'string' ||
      item.description.length > FRIEND_DESCRIPTION_LIMIT ||
      typeof themeColor !== 'string' ||
      !FRIEND_THEME_COLOR_PATTERN.test(themeColor)
    ) {
      return null;
    }

    normalized.push({
      id,
      name: item.name,
      url: rawUrl,
      avatar: item.avatar,
      description: item.description,
      themeColor,
    });
  }

  return normalized;
}

function nextAvailableId(usedIds: Set<number>, start: number): number {
  let id = start;
  while (usedIds.has(id)) id += 1;
  return id;
}

// 获取所有友链
export async function GET() {
  return withAuth(async () => {
    try {
      const fileContents = await fileManager.readFile('src/data/friends.ts');
      const friends = parseDataArray(fileContents, 'friendsData');
      if (!friends) return errorResponse('友链数据格式无效', 500);
      return successResponse({ friends });
    } catch (error) {
      return errorResponse('读取友链失败', 500, error);
    }
  })();
}

// 保存友链数据
export async function POST(request: NextRequest) {
  return withAuth(async () => {
    const body = await safeParseJSON<{ friends?: unknown }>(request);
    if (!body || !Array.isArray(body.friends)) {
      return errorResponse('friends 必须是数组', 400);
    }
    const friends = normalizeFriends(body.friends);
    if (!friends) {
      return errorResponse('友链数据包含无效字段', 400);
    }

    try {
      const fileContent = `export const friendsData = ${JSON.stringify(friends, null, 2)};\n`;
      await fileManager.writeFile('src/data/friends.ts', fileContent, 'chore: update friends via admin panel');
      return successResponse(null, '友链已保存');
    } catch (error) {
      return errorResponse('保存友链失败', 500, error);
    }
  })();
}
