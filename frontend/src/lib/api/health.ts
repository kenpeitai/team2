import type { HealthResponse } from '@/types/api';
import { request } from './base';

// システム健康チェック
export const checkHealth = () =>
  request<HealthResponse>('/api/health');

// データベース健康チェック
export const checkDatabaseHealth = () =>
  request<HealthResponse>('/api/health/database');

// システム全体の状態確認
export const checkSystemHealth = () =>
  request<HealthResponse>('/api/health/system');
