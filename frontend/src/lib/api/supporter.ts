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

// 支援者统计信息
export interface SupporterStats {
  ongoing: number;
  completed: number;
  totalAmount: string;
}

// 进行中的支援
export interface ActiveSupport {
  supportedShelterName: string;
  itemName: string;
  status: 'purchased' | 'delivery_drone' | 'delivered' | 'received';
}

// 通知
export interface Notification {
  message: string;
  time: string;
  color: string;
}

// 获取支援者统计数据
export const getSupporterStats = async (supporterId: number): Promise<SupporterStats> => {
  return request(`/api/supporters/${supporterId}/stats`, {
    method: 'GET'
  });
};

// 获取进行中的支援
export const getActiveSupport = async (supporterId: number): Promise<ActiveSupport | null> => {
  return request(`/api/supporters/${supporterId}/active-support`, {
    method: 'GET'
  });
};

// 获取通知
export const getNotifications = async (supporterId: number): Promise<Notification[]> => {
  return request(`/api/supporters/${supporterId}/notifications`, {
    method: 'GET'
  });
};


