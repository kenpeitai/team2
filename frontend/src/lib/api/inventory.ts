import type { InventoryDto } from '@/types/api';
import { request } from './base';

// 在庫一覧取得
export const getInventoryByShelter = (shelterId: number) =>
  request<InventoryDto[]>(`/api/inventory/${shelterId}`);

// 在庫数量更新
export const updateInventoryQuantity = (id: number, quantity: number) =>
  request<InventoryDto>(`/api/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });

// 在庫アイテム追加
export const addInventoryItem = (body: InventoryDto) =>
  request<InventoryDto>('/api/inventory', {
    method: 'POST',
    body: JSON.stringify(body),
  });

// 在庫アイテム削除
export const deleteInventoryItem = (id: number) =>
  request<void>(`/api/inventory/${id}`, { method: 'DELETE' });

// 在庫検索
export const searchInventory = (
  shelterId: number,
  params: { keyword?: string; category?: string }
) => {
  const q = new URLSearchParams();
  if (params.keyword) q.set('keyword', params.keyword);
  if (params.category) q.set('category', params.category);
  const query = q.toString();
  return request<InventoryDto[]>(`/api/inventory/${shelterId}/search?${query}`);
};


