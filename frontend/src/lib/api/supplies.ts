import type { ProductDto, NeedsListDto } from '@/types/api';
import { request } from './base';

// === 商品管理 ===

// 全商品取得
export const getAllSupplyProducts = () =>
  request<ProductDto[]>('/api/supplies/products');

// 商品登録
export const createSupplyProduct = (body: ProductDto) =>
  request<ProductDto>('/api/supplies/products', {
    method: 'POST',
    body: JSON.stringify(body),
  });

// 商品更新
export const updateSupplyProduct = (id: number, body: ProductDto) =>
  request<ProductDto>(`/api/supplies/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

// 商品検索
export const searchSupplyProducts = (keyword: string) =>
  request<ProductDto[]>(`/api/supplies/products/search?keyword=${encodeURIComponent(keyword)}`);

// === 必要物資リスト管理 ===

// 必要物資リスト作成
export const createNeedsList = (body: NeedsListDto) =>
  request<NeedsListDto>('/api/supplies/needs-lists', {
    method: 'POST',
    body: JSON.stringify(body),
  });

// 避難所の必要物資リスト取得
export const getNeedsListsByShelter = (shelterId: number) =>
  request<NeedsListDto[]>(`/api/supplies/needs-lists/shelter/${shelterId}`);

// 必要物資リスト詳細取得
export const getNeedsListById = (id: number) =>
  request<NeedsListDto>(`/api/supplies/needs-lists/${id}`);

// 必要物資リスト削除
export const deleteNeedsList = (id: number) =>
  request<void>(`/api/supplies/needs-lists/${id}`, {
    method: 'DELETE',
  });
