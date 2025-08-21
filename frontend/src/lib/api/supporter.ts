import { request } from './base';



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
  const result = await request<SupporterStats>(`/api/supporters/${supporterId}/stats`, {
    method: 'GET'
  });
  return result || { ongoing: 0, completed: 0, totalAmount: '¥0' };
};

// 获取进行中的支援
export const getActiveSupport = async (supporterId: number): Promise<ActiveSupport | null> => {
  const result = await request<ActiveSupport | null>(`/api/supporters/${supporterId}/active-support`, {
    method: 'GET'
  });
  return result;
};

// 获取通知
export const getNotifications = async (supporterId: number): Promise<Notification[]> => {
  const result = await request<Notification[]>(`/api/supporters/${supporterId}/notifications`, {
    method: 'GET'
  });
  return result || [];
};


