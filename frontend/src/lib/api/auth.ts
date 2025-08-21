import type { AuthResponse, LoginRequest, UserDto, ShelterDto } from '@/types/api';
import { request } from './base';

// 認証
export const registerUser = (body: UserDto) =>
  request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const loginUser = (body: LoginRequest) =>
  request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const loginShelter = (body: LoginRequest) =>
  request<AuthResponse>('/api/auth/login-shelter', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const registerShelter = (body: ShelterDto) =>
  request<AuthResponse>('/api/auth/register-shelter', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const logout = () =>
  request<AuthResponse>('/api/auth/logout', {
    method: 'POST',
  });
