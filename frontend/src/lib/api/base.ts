import type { ApiError } from '@/types/api';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    try {
      const parsed = JSON.parse(text) as ApiError;
      const err = new Error(parsed.message || `HTTP ${res.status}`);
      (err as { cause?: unknown }).cause = parsed;
      throw err;
    } catch {
      const err = new Error(text || `HTTP ${res.status}`);
      (err as { cause?: unknown }).cause = { status: res.status } satisfies Partial<ApiError>;
      throw err;
    }
  }
  
  // 检查响应体是否为空
  const contentType = res.headers.get('content-type');
  const contentLength = res.headers.get('content-length');
  
  // 如果响应体为空或没有内容类型，直接返回
  if (contentLength === '0' || !contentType || contentType.includes('text/plain')) {
    return {} as T;
  }
  
  // 尝试解析JSON，如果失败则返回空对象
  try {
    return (await res.json()) as T;
  } catch (error) {
    console.warn('Failed to parse JSON response:', error);
    return {} as T;
  }
}
