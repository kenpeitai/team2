import { request } from './base';

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
export const createOrder = (order: Order): Promise<Order> =>
  request<Order>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });

// 获取订单详情
export const getOrderById = (orderId: number): Promise<Order> =>
  request<Order>(`/api/orders/${orderId}`);

// 获取用户的订单列表
export const getOrdersByUser = (userId: number): Promise<Order[]> =>
  request<Order[]>(`/api/orders/user/${userId}`);

// 更新订单状态
export const updateOrderStatus = (orderId: number, status: string): Promise<Order> =>
  request<Order>(`/api/orders/${orderId}/status?status=${status}`, { method: 'PUT' });

// 获取订单项目
export const getOrderItems = (orderId: number): Promise<OrderItem[]> =>
  request<OrderItem[]>(`/api/orders/${orderId}/items`);

// 添加订单项目
export const addOrderItem = (orderId: number, item: OrderItem): Promise<OrderItem> =>
  request<OrderItem>(`/api/orders/${orderId}/items`, {
    method: 'POST',
    body: JSON.stringify(item),
  });

// 获取所有订单
export const getAllOrders = (): Promise<Order[]> =>
  request<Order[]>('/api/orders');

// 根据状态获取订单
export const getOrdersByStatus = (status: string): Promise<Order[]> =>
  request<Order[]>(`/api/orders/status/${status}`);
