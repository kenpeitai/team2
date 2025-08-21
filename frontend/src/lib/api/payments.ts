import { request } from './base';

export interface Payment {
  id?: number;
  orderId: number;
  paymentMethod: string;
  paymentStatus?: string;
  amount: number;
  transactionId?: string;
  paymentDate?: string;
  receiptUrl?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 创建支付记录
export const createPayment = (payment: Payment): Promise<Payment> =>
  request<Payment>('/api/payments', {
    method: 'POST',
    body: JSON.stringify(payment),
  });

// 处理支付
export const processPayment = (paymentId: number): Promise<Payment> =>
  request<Payment>(`/api/payments/${paymentId}/process`, { method: 'POST' });

// 更新支付状态
export const updatePaymentStatus = (paymentId: number, status: string): Promise<Payment> =>
  request<Payment>(`/api/payments/${paymentId}/status?status=${status}`, { method: 'PUT' });

// 获取支付记录
export const getPaymentById = (paymentId: number): Promise<Payment> =>
  request<Payment>(`/api/payments/${paymentId}`);

// 根据订单ID获取支付记录
export const getPaymentsByOrderId = (orderId: number): Promise<Payment[]> =>
  request<Payment[]>(`/api/payments/order/${orderId}`);

// 根据用户ID获取支付记录
export const getPaymentsByUserId = (userId: number): Promise<Payment[]> =>
  request<Payment[]>(`/api/payments/user/${userId}`);

// 根据支付状态获取支付记录
export const getPaymentsByStatus = (status: string): Promise<Payment[]> =>
  request<Payment[]>(`/api/payments/status/${status}`);

// 获取所有支付记录
export const getAllPayments = (): Promise<Payment[]> =>
  request<Payment[]>('/api/payments');

// 获取订单的总支付金额
export const getTotalPaidAmount = (orderId: number): Promise<number> =>
  request<number>(`/api/payments/order/${orderId}/total`);

// 检查订单是否已完全支付
export const isOrderFullyPaid = (orderId: number): Promise<boolean> =>
  request<boolean>(`/api/payments/order/${orderId}/fully-paid`);
