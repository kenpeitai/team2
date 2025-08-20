// ユーザーロールの列挙型
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

// ユーティリティステータスの列挙型
export enum UtilityStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
}

// 交通状況の列挙型
export enum TrafficStatus {
  NORMAL = 'NORMAL',
  RESTRICTED = 'RESTRICTED',
  CLOSED = 'CLOSED'
}

// ユーザーDTOの型定義
export interface UserDto {
  id?: number;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  role?: UserRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 避難所DTOの型定義
export interface ShelterDto {
  id?: number;
  shelterName: string;
  shelterAddress: string;
  representativeLastName: string;
  representativeFirstName: string;
  phoneNumber: string;
  email: string;
  password?: string;
  evacueeCount?: number;
  injuredCount?: number;
  electricityStatus?: UtilityStatus;
  gasStatus?: UtilityStatus;
  waterStatus?: UtilityStatus;
  trafficStatus?: TrafficStatus;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 避難所エンティティの型定義（ShelterDtoと同様だが、IDは必須）
export interface Shelter {
  id: number;
  shelterName: string;
  shelterAddress: string;
  representativeLastName: string;
  representativeFirstName: string;
  phoneNumber: string;
  email: string;
  evacueeCount?: number;
  injuredCount?: number;
  electricityStatus?: UtilityStatus;
  gasStatus?: UtilityStatus;
  waterStatus?: UtilityStatus;
  trafficStatus?: TrafficStatus;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 認証レスポンスの型定義
export interface AuthResponse {
  token?: string;
  message?: string;
  user?: UserDto;
  timestamp?: string;
}

// ログインリクエストの型定義
export interface LoginRequest {
  email: string;
  password: string;
}

// APIエラーの型定義
export interface ApiError {
  message: string;
  status?: number;
  timestamp?: string;
}
