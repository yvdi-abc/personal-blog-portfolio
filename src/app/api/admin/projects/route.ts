import {
  errorResponse,
  parseDataArray,
  safeParseJSON,
  successResponse,
  withAuth,
} from '@/lib/api-utils';
import { fileManager } from '@/lib/file-manager';

const PROJECT_URL_LIMIT = 2_000;
const PROJECT_NAME_LIMIT = 160;
const PROJECT_DESCRIPTION_LIMIT = 2_000;
const PROJECT_ICON_LIMIT = 16;
const PROJECT_TAG_LIMIT = 50;
const MAX_PROJECTS = 200;
const MAX_TAGS = 30;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSafeUrl(value: string): boolean {
  return (
    (value.startsWith('/') && !value.startsWith('//')) ||
    /^https?:\/\//i.test(value)
  );
}

function normalizeProjects(value: unknown[]): Record<string, unknown>[] | null {
  const normalized: Record<string, unknown>[] = [];

  for (const item of value) {
    if (!isRecord(item)) return null;

    const { name, desc, tags, icon, link } = item;
    if (
      typeof name !== 'string' ||
      name.trim().length === 0 ||
      name.length > PROJECT_NAME_LIMIT ||
      typeof desc !== 'string' ||
      desc.length > PROJECT_DESCRIPTION_LIMIT ||
      !Array.isArray(tags) ||
      tags.length > MAX_TAGS ||
      tags.some(
        (tag) =>
          typeof tag !== 'string' ||
          tag.trim().length === 0 ||
          tag.length > PROJECT_TAG_LIMIT
      ) ||
      typeof icon !== 'string' ||
      icon.length === 0 ||
      icon.length > PROJECT_ICON_LIMIT ||
      (link !== undefined &&
        (typeof link !== 'string' ||
          link.length > PROJECT_URL_LIMIT ||
          !isSafeUrl(link)))
    ) {
      return null;
    }

    normalized.push({
      name,
      desc,
      tags,
      icon,
      ...(link === undefined ? {} : { link }),
    });
  }

  return normalized;
}

export async function GET() {
  return withAuth(async () => {
    try {
      const content = await fileManager.readFile('src/data/index.ts');
      const projectsData = parseDataArray(content, 'projectsData');
      if (!projectsData) return errorResponse('项目数据格式无效', 500);
      return successResponse(projectsData);
    } catch (error) {
      console.error('Failed to read projects:', error);
      return errorResponse('读取项目失败', 500, error);
    }
  })();
}

export async function POST(request: Request) {
  return withAuth(async () => {
    const projects = await safeParseJSON<unknown>(request);
    if (!Array.isArray(projects)) return errorResponse('项目数据必须是数组', 400);
    if (projects.length > MAX_PROJECTS) {
      return errorResponse('项目数量超过限制', 400);
    }

    const normalizedProjects = normalizeProjects(projects);
    if (!normalizedProjects) {
      return errorResponse('项目数据包含无效字段', 400);
    }

    try {
      const content = await fileManager.readFile('src/data/index.ts');
      const projectsJson = JSON.stringify(normalizedProjects, null, 2);
      const newContent = content.replace(
        /export const projectsData: Project\[\] = \[[\s\S]*?\];/,
        `export const projectsData: Project[] = ${projectsJson};`
      );
      if (newContent === content) return errorResponse('未找到项目数据定义', 500);
      await fileManager.writeFile('src/data/index.ts', newContent, 'chore: update projects via admin panel');
      return successResponse(null, '项目已保存');
    } catch (error) {
      console.error('Failed to save projects:', error);
      return errorResponse('保存项目失败', 500, error);
    }
  })();
}
