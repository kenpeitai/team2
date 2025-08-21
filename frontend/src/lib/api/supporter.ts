import type { UserDto, UtilityStatus, TrafficStatus } from '@/types/api';
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
export interface AvailableShelterSummary {
  id: number;
  shelterName: string;
  address: string;
  evacueeCount?: number;
  injuredCount?: number;
  electricityStatus?: UtilityStatus;
  gasStatus?: UtilityStatus;
  waterStatus?: UtilityStatus;
  trafficStatus?: TrafficStatus;
  lastUpdated?: string;
}

export const getAvailableSheltersForSupporter = () =>
  request<AvailableShelterSummary[]>(`/api/supporter/available-shelters`);

// 支援履歴取得
export interface SupportHistoryItem {
  id: number;
  shelterName: string;
  supportDate: string;
  supportType: string;
  status: string;
}

export const getSupportHistory = (userId: number) =>
  request<SupportHistoryItem[]>(`/api/supporter/support-history/${userId}`);

// 支援者統計情報
export interface SupporterStatistics {
  totalSupports: number;
  totalShelters: number;
  totalHours: number;
  currentMonthSupports: number;
  favoriteShelter: string;
}

export const getSupporterStatistics = (userId: number) =>
  request<SupporterStatistics>(`/api/supporter/statistics/${userId}`);

// 通知設定取得
export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  emergencyAlerts: boolean;
  weeklyDigest: boolean;
  shelterUpdates: boolean;
}

export const getNotificationSettings = (userId: number) =>
  request<NotificationSettings>(`/api/supporter/notifications/${userId}`);

// 通知設定更新
export const updateNotificationSettings = (userId: number, settings: NotificationSettings) =>
  request<NotificationSettings>(`/api/supporter/notifications/${userId}`, {
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


