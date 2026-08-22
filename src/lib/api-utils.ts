/**
 * 管理后台 API 工具函数
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * 验证管理员认证
 */
export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated';
}

/**
 * 返回未授权响应
 */
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized', message: '请先登录' },
    { status: 401 }
  );
}

/**
 * 返回成功响应
 */
export function successResponse<T>(data: T, message?: string) {
  const response: Record<string, any> = {
    success: true,
  };

  if (message) {
    response.message = message;
  }

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return NextResponse.json(response);
}

/**
 * 返回错误响应
 */
export function errorResponse(
  message: string,
  status: number = 500,
  details?: unknown
) {
  const response: Record<string, any> = {
    error: true,
    message,
  };

  if (details && process.env.NODE_ENV === 'development') {
    response.details = details;
  }

  return NextResponse.json(response, { status });
}

/**
 * 验证必填字段
 */
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): string | null {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      return `字段 "${String(field)}" 是必填的`;
    }
  }
  return null;
}

/**
 * 安全地解析 JSON 请求体
 */
export async function safeParseJSON<T>(request: Request): Promise<T | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/**
 * 包装 API 处理器，自动处理认证和错误
 */
export function withAuth(
  handler: () => Promise<NextResponse>
): () => Promise<NextResponse> {
  return async () => {
    try {
      const isAuthed = await verifyAdminAuth();
      if (!isAuthed) {
        return unauthorizedResponse();
      }
      return await handler();
    } catch (error) {
      console.error('API Error:', error);
      return errorResponse(
        error instanceof Error ? error.message : '服务器内部错误'
      );
    }
  };
}

/**
 * 从 TypeScript 数据文件内容中解析导出的数组
 * @param content - 文件内容字符串
 * @param exportName - 导出变量名
 * @returns 解析后的数组，如果解析失败则返回 null
 */
export function parseDataArray(content: string, exportName: string): unknown[] | null {
  try {
    // 匹配导出的数组变量，支持 const/let/export const 等形式
    const regex = new RegExp(
      `(?:export\\s+)?(?:const|let|var)\\s+${exportName}\\s*[:=]\\s*([\\s\\S]*?)(?:;\\s*$|\\n\\n|$)`,
      'm'
    );
    const match = content.match(regex);

    if (!match || !match[1]) {
      return null;
    }

    // 提取数组部分，去除类型标注
    let arrayStr = match[1].trim();

    // 移除 TypeScript 类型标注 (例如: Array[] = [...])
    arrayStr = arrayStr.replace(/^[^[{]*/, '');

    // 使用 JSON5 兼容的方式解析 (移除尾随逗号等)
    arrayStr = arrayStr
      .replace(/,(\s*[}\]])/g, '$1') // 移除尾随逗号
      .replace(/'/g, '"') // 单引号转双引号
      .replace(/(\w+):/g, '"$1":'); // 属性名加引号

    const parsed = JSON.parse(arrayStr);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error(`Failed to parse data array "${exportName}":`, error);
    return null;
  }
}
