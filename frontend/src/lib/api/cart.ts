import { request } from './base';

export interface CartItem {
  id?: number;
  cartId?: number;
  productId: string;
  productName: string;
  unit: string;
  category: string;
  quantity: number;
  pricePerUnit?: number;
  totalPrice?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  id?: number;
  userId: number;
  shelterId: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  items?: CartItem[];
}

// 获取用户的购物车
export const getCart = (userId: number, shelterId: number): Promise<Cart> =>
  request<Cart>(`/api/cart/${userId}/${shelterId}`);

// 获取用户的所有购物车
export const getUserCarts = (userId: number): Promise<Cart[]> =>
  request<Cart[]>(`/api/cart/${userId}`);

// 添加商品到购物车
export const addItemToCart = (userId: number, shelterId: number, item: CartItem): Promise<CartItem> =>
  request<CartItem>(`/api/cart/${userId}/${shelterId}/items`, {
    method: 'POST',
    body: JSON.stringify(item),
  });

// 更新购物车商品数量
export const updateCartItemQuantity = (
  userId: number,
  shelterId: number,
  productId: string,
  quantity: number
): Promise<CartItem | null> =>
  request<CartItem | null>(`/api/cart/${userId}/${shelterId}/items/${productId}?quantity=${quantity}`, {
    method: 'PUT',
  });

// 从购物车删除商品
export const removeItemFromCart = (userId: number, shelterId: number, productId: string): Promise<void> =>
  request<void>(`/api/cart/${userId}/${shelterId}/items/${productId}`, { method: 'DELETE' });

// 清空购物车
export const clearCart = (userId: number, shelterId: number): Promise<void> =>
  request<void>(`/api/cart/${userId}/${shelterId}`, { method: 'DELETE' });
