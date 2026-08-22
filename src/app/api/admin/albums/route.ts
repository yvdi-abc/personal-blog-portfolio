import {
  errorResponse,
  parseDataArray,
  safeParseJSON,
  successResponse,
  withAuth,
} from '@/lib/api-utils';
import { fileManager } from '@/lib/file-manager';

const ALBUM_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ALBUM_DATE_PATTERN = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;
const MAX_ALBUMS = 200;
const MAX_PHOTOS_PER_ALBUM = 500;
const URL_LIMIT = 2_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSafeUrl(value: string): boolean {
  return (
    (value.startsWith('/') && !value.startsWith('//')) ||
    /^https?:\/\//i.test(value)
  );
}

function normalizeAlbums(value: unknown[]): Record<string, unknown>[] | null {
  const normalized: Record<string, unknown>[] = [];
  const ids = new Set<string>();

  for (const item of value) {
    if (!isRecord(item)) return null;

    const { id, title, description, cover, date, photos } = item;
    if (
      typeof id !== 'string' ||
      !ALBUM_ID_PATTERN.test(id) ||
      id.length > 120 ||
      ids.has(id) ||
      typeof title !== 'string' ||
      title.trim().length === 0 ||
      title.length > 200 ||
      typeof description !== 'string' ||
      description.length > 1_000 ||
      typeof cover !== 'string' ||
      cover.length > URL_LIMIT ||
      !isSafeUrl(cover) ||
      typeof date !== 'string' ||
      !ALBUM_DATE_PATTERN.test(date) ||
      !Array.isArray(photos) ||
      photos.length > MAX_PHOTOS_PER_ALBUM
    ) {
      return null;
    }

    const normalizedPhotos: Record<string, unknown>[] = [];
    for (const photo of photos) {
      if (!isRecord(photo)) return null;
      if (
        typeof photo.url !== 'string' ||
        photo.url.length > URL_LIMIT ||
        !isSafeUrl(photo.url) ||
        (photo.caption !== undefined &&
          (typeof photo.caption !== 'string' || photo.caption.length > 300))
      ) {
        return null;
      }

      normalizedPhotos.push({
        url: photo.url,
        ...(photo.caption === undefined ? {} : { caption: photo.caption }),
      });
    }

    ids.add(id);
    normalized.push({
      id,
      title,
      description,
      cover,
      date,
      photos: normalizedPhotos,
    });
  }

  return normalized;
}

export async function GET() {
  return withAuth(async () => {
    try {
      const content = await fileManager.readFile('src/data/albums.ts');
      const albums = parseDataArray(content, 'albums');
      if (!albums) return errorResponse('相册数据格式无效', 500);
      return successResponse(albums);
    } catch (error) {
      console.error('Failed to read albums:', error);
      return errorResponse('读取相册失败', 500, error);
    }
  })();
}

export async function POST(request: Request) {
  return withAuth(async () => {
    const albums = await safeParseJSON<unknown>(request);
    if (!Array.isArray(albums)) return errorResponse('相册数据必须是数组', 400);
    if (albums.length > MAX_ALBUMS) {
      return errorResponse('相册数量超过限制', 400);
    }

    const normalizedAlbums = normalizeAlbums(albums);
    if (!normalizedAlbums) {
      return errorResponse('相册数据包含无效字段', 400);
    }

    try {
      const albumsJson = JSON.stringify(normalizedAlbums, null, 2);
      const newContent = `export interface Photo { url: string; caption?: string; }\nexport interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }\n\nexport const albums: Album[] = ${albumsJson};\n`;
      await fileManager.writeFile('src/data/albums.ts', newContent, 'chore: update albums via admin panel');
      return successResponse(null, '相册已保存');
    } catch (error) {
      console.error('Failed to save albums:', error);
      return errorResponse('保存相册失败', 500, error);
    }
  })();
}
