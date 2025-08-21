import { request } from './base';

export interface UserPaymentInfo {
  userId: number;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  fullName?: string;
  cardHolder?: string;
}

// 获取用户的支付信息
export const getUserPaymentInfo = async (userId: number): Promise<UserPaymentInfo> => {
  return request(`/api/users/${userId}/payment-info`, {
    method: 'GET'
  });
};

// 更新用户的支付信息
export const updateUserPaymentInfo = async (userId: number, paymentInfo: Partial<UserPaymentInfo>): Promise<{ message: string }> => {
  return request(`/api/users/${userId}/payment-info`, {
    method: 'PUT',
    body: JSON.stringify(paymentInfo)
  });
};

// 删除用户的支付信息
export const deleteUserPaymentInfo = async (userId: number): Promise<{ message: string }> => {
  return request(`/api/users/${userId}/payment-info`, {
    method: 'DELETE'
  });
};
