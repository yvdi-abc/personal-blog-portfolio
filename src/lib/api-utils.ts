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
