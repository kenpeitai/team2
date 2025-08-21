import type { UserDto } from '@/types/api';
import { request } from './base';

// 支援者プロフィール取得
export const getSupporterProfile = (userId: number) =>
  request<UserDto>(`/api/supporter/profile/${userId}`);

// 支援者プロフィール更新
export const updateSupporterProfile = (userId: number, body: Partial<UserDto>) =>
  request<UserDto>(`/api/supporter/profile/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

// 支援可能避難所一覧
export const getAvailableSheltersForSupporter = () =>
  request<any[]>(`/api/supporter/available-shelters`);

// 支援履歴取得
export const getSupportHistory = (userId: number) =>
  request<any[]>(`/api/supporter/support-history/${userId}`);

// 支援者統計情報
export const getSupporterStatistics = (userId: number) =>
  request<any>(`/api/supporter/statistics/${userId}`);

// 通知設定取得
export const getNotificationSettings = (userId: number) =>
  request<any>(`/api/supporter/notifications/${userId}`);

// 通知設定更新
export const updateNotificationSettings = (userId: number, settings: any) =>
  request<any>(`/api/supporter/notifications/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(settings),
  });


