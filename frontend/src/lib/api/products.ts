import type { Product, ProductCategory } from '@/types/api';
import { request } from './base';

// 商品作成
export const createProduct = (body: Product) =>
  request<Product>('/api/products', {
    method: 'POST',
    body: JSON.stringify(body),
  });

// 商品更新
export const updateProduct = (id: number, body: Product) =>
  request<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

// 商品削除（ソフト削除）
export const deleteProduct = (id: number) =>
  request<Product>(`/api/products/${id}`, {
    method: 'DELETE',
  });

// 商品詳細取得
export const getProductById = (id: number) =>
  request<Product>(`/api/products/${id}`);

// 商品IDで取得
export const getProductByProductId = (productId: string) =>
  request<Product>(`/api/products/product-id/${encodeURIComponent(productId)}`);

// 全商品取得（アクティブのみ）
export const getAllActiveProducts = () =>
  request<Product[]>('/api/products');

// カテゴリ別商品取得
export const getProductsByCategory = (category: ProductCategory) =>
  request<Product[]>(`/api/products/category/${category}`);

// キーワード検索
export const searchProductsByKeyword = (keyword: string) =>
  request<Product[]>(`/api/products/search?keyword=${encodeURIComponent(keyword)}`);

// カテゴリとキーワード検索
export const searchProductsByCategoryAndKeyword = (category: ProductCategory, keyword: string) =>
  request<Product[]>(`/api/products/search/category?category=${category}&keyword=${encodeURIComponent(keyword)}`);

// 画像検証状態更新
export const updateImageVerification = (id: number, verified: boolean) =>
  request<Product>(`/api/products/${id}/image-verification?verified=${verified}`, {
    method: 'PUT',
  });

// 推奨使用量範囲で商品取得
export const getProductsByRecommendedUsage = (minUsage: number, maxUsage: number) =>
  request<Product[]>(`/api/products/recommended-usage?minUsage=${minUsage}&maxUsage=${maxUsage}`);

// 重量範囲で商品取得
export const getProductsByWeightRange = (minWeight: number, maxWeight: number) =>
  request<Product[]>(`/api/products/weight-range?minWeight=${minWeight}&maxWeight=${maxWeight}`);
