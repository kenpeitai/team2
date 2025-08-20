import { baseApi } from './base';

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
export const createPayment = async (payment: Payment): Promise<Payment> => {
  const response = await baseApi.post('/payments', payment);
  return response.data;
};

// 处理支付
export const processPayment = async (paymentId: number): Promise<Payment> => {
  const response = await baseApi.post(`/payments/${paymentId}/process`);
  return response.data;
};

// 更新支付状态
export const updatePaymentStatus = async (paymentId: number, status: string): Promise<Payment> => {
  const response = await baseApi.put(`/payments/${paymentId}/status?status=${status}`);
  return response.data;
};

// 获取支付记录
export const getPaymentById = async (paymentId: number): Promise<Payment> => {
  const response = await baseApi.get(`/payments/${paymentId}`);
  return response.data;
};

// 根据订单ID获取支付记录
export const getPaymentsByOrderId = async (orderId: number): Promise<Payment[]> => {
  const response = await baseApi.get(`/payments/order/${orderId}`);
  return response.data;
};

// 根据用户ID获取支付记录
export const getPaymentsByUserId = async (userId: number): Promise<Payment[]> => {
  const response = await baseApi.get(`/payments/user/${userId}`);
  return response.data;
};

// 根据支付状态获取支付记录
export const getPaymentsByStatus = async (status: string): Promise<Payment[]> => {
  const response = await baseApi.get(`/payments/status/${status}`);
  return response.data;
};

// 获取所有支付记录
export const getAllPayments = async (): Promise<Payment[]> => {
  const response = await baseApi.get('/payments');
  return response.data;
};

// 获取订单的总支付金额
export const getTotalPaidAmount = async (orderId: number): Promise<number> => {
  const response = await baseApi.get(`/payments/order/${orderId}/total`);
  return response.data;
};

// 检查订单是否已完全支付
export const isOrderFullyPaid = async (orderId: number): Promise<boolean> => {
  const response = await baseApi.get(`/payments/order/${orderId}/fully-paid`);
  return response.data;
};
