import { baseApi } from './base';

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
export const getCart = async (userId: number, shelterId: number): Promise<Cart> => {
  const response = await baseApi.get(`/cart/${userId}/${shelterId}`);
  return response.data;
};

// 获取用户的所有购物车
export const getUserCarts = async (userId: number): Promise<Cart[]> => {
  const response = await baseApi.get(`/cart/${userId}`);
  return response.data;
};

// 添加商品到购物车
export const addItemToCart = async (userId: number, shelterId: number, item: CartItem): Promise<CartItem> => {
  const response = await baseApi.post(`/cart/${userId}/${shelterId}/items`, item);
  return response.data;
};

// 更新购物车商品数量
export const updateCartItemQuantity = async (
  userId: number, 
  shelterId: number, 
  productId: string, 
  quantity: number
): Promise<CartItem | null> => {
  const response = await baseApi.put(`/cart/${userId}/${shelterId}/items/${productId}?quantity=${quantity}`);
  return response.data;
};

// 从购物车删除商品
export const removeItemFromCart = async (userId: number, shelterId: number, productId: string): Promise<void> => {
  await baseApi.delete(`/cart/${userId}/${shelterId}/items/${productId}`);
};

// 清空购物车
export const clearCart = async (userId: number, shelterId: number): Promise<void> => {
  await baseApi.delete(`/cart/${userId}/${shelterId}`);
};
