import { baseApi } from './base';

export interface OrderItem {
  id?: number;
  orderId?: number;
  productId: string;
  productName: string;
  unit: string;
  category: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id?: number;
  orderNumber?: string;
  userId: number;
  shelterId: number;
  orderStatus?: string;
  totalAmount: number;
  shippingAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[];
}

// 创建订单
export const createOrder = async (order: Order): Promise<Order> => {
  const response = await baseApi.post('/orders', order);
  return response.data;
};

// 获取订单详情
export const getOrderById = async (orderId: number): Promise<Order> => {
  const response = await baseApi.get(`/orders/${orderId}`);
  return response.data;
};

// 获取用户的订单列表
export const getOrdersByUser = async (userId: number): Promise<Order[]> => {
  const response = await baseApi.get(`/orders/user/${userId}`);
  return response.data;
};

// 更新订单状态
export const updateOrderStatus = async (orderId: number, status: string): Promise<Order> => {
  const response = await baseApi.put(`/orders/${orderId}/status?status=${status}`);
  return response.data;
};

// 获取订单项目
export const getOrderItems = async (orderId: number): Promise<OrderItem[]> => {
  const response = await baseApi.get(`/orders/${orderId}/items`);
  return response.data;
};

// 添加订单项目
export const addOrderItem = async (orderId: number, item: OrderItem): Promise<OrderItem> => {
  const response = await baseApi.post(`/orders/${orderId}/items`, item);
  return response.data;
};

// 获取所有订单
export const getAllOrders = async (): Promise<Order[]> => {
  const response = await baseApi.get('/orders');
  return response.data;
};

// 根据状态获取订单
export const getOrdersByStatus = async (status: string): Promise<Order[]> => {
  const response = await baseApi.get(`/orders/status/${status}`);
  return response.data;
};
