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
      const err = new Error(text ?? `HTTP ${res.status}`);
      (err as { cause?: unknown }).cause = { status: res.status } satisfies Partial<ApiError>;
      throw err;
    }
  }
  return (await res.json()) as T;
}
