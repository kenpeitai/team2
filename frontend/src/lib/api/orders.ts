import { request } from './base';

export interface OrderItem {
  id?: number;
  orderId?: number;
  productId: string;
  productName: string;
  unit: string;
  category: string;
  quantity: number;
  pricePerUnit?: number;
  totalPrice?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id?: number;
  userId: number;
  shelterId: number;
  orderNumber?: string;
  status?: string;
  paymentStatus?: string;
  totalAmount?: number;
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
export const createOrder = (userId: number, shelterId: number, orderData: Partial<Order>): Promise<Order> =>
  request<Order>(`/api/orders/${userId}/${shelterId}`, {
    method: 'POST',
    body: JSON.stringify(orderData),
  });

// 获取用户的订单列表
export const getUserOrders = (userId: number): Promise<Order[]> =>
  request<Order[]>(`/api/orders/${userId}`);

// 获取特定订单详情
export const getOrder = (userId: number, orderId: number): Promise<Order> =>
  request<Order>(`/api/orders/${userId}/${orderId}`);

// 更新订单状态
export const updateOrderStatus = (userId: number, orderId: number, status: string): Promise<Order> =>
  request<Order>(`/api/orders/${userId}/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });

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
