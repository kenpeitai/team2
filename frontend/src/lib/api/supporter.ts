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


