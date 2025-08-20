import type { UserDto, UserRole } from '@/types/api';
import { request } from './base';

// ユーザー
export const createUser = (body: UserDto) =>
  request<UserDto>('/api/users', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const getAllUsers = () => request<UserDto[]>('/api/users');

export const getUserById = (id: number) => request<UserDto>(`/api/users/${id}`);
export const getUserByUsername = (username: string) => request<UserDto>(`/api/users/username/${encodeURIComponent(username)}`);
export const getUserByEmail = (email: string) => request<UserDto>(`/api/users/email/${encodeURIComponent(email)}`);
export const getUsersByRole = (role: UserRole) => request<UserDto[]>(`/api/users/role/${role}`);
export const searchUsers = (keyword: string) => request<UserDto[]>(`/api/users/search?keyword=${encodeURIComponent(keyword)}`);
export const searchUsersAdvanced = (params: { username?: string; email?: string; role?: UserRole; isActive?: boolean }) => {
  const q = new URLSearchParams();
  if (params.username) q.set('username', params.username);
  if (params.email) q.set('email', params.email);
  if (params.role) q.set('role', params.role);
  if (typeof params.isActive === 'boolean') q.set('isActive', String(params.isActive));
  return request<UserDto[]>(`/api/users/search/advanced?${q.toString()}`);
};
export const updateUser = (id: number, body: UserDto) => request<UserDto>(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const updatePassword = (id: number, newPassword: string) => request<UserDto>(`/api/users/${id}/password?newPassword=${encodeURIComponent(newPassword)}`, { method: 'PUT' });
export const deleteUser = (id: number) => request<void>(`/api/users/${id}`, { method: 'DELETE' });
