// ユーザーロールの列挙型
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR'
}

// ユーティリティステータスの列挙型
export enum UtilityStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  UNKNOWN = 'UNKNOWN'
}

// 交通状況の列挙型
export enum TrafficStatus {
  NORMAL = 'NORMAL',
  RESTRICTED = 'RESTRICTED',
  CLOSED = 'CLOSED',
  UNKNOWN = 'UNKNOWN'
}

// 商品カテゴリの列挙型
export enum ProductCategory {
  MEDICINE = 'MEDICINE',
  FOOD = 'FOOD',
  WATER = 'WATER',
  HYGIENE = 'HYGIENE',
  TOOLS = 'TOOLS',
  OTHER = 'OTHER'
}

// 優先度の列挙型
export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

// ユーザーDTOの型定義
export interface UserDto {
  id?: number;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  phoneNumber?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
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

// 商品DTOの型定義
export interface ProductDto {
  id?: number;
  productId: string;
  name: string;
  unit: string;
  weightGrams: number;
  recommendedPerPersonPerDay: number;
  imageUrl?: string;
  imageVerified?: boolean;
  category: ProductCategory;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 商品エンティティの型定義
export interface Product {
  id: number;
  productId: string;
  name: string;
  unit: string;
  weightGrams: number;
  recommendedPerPersonPerDay: number;
  imageUrl?: string;
  imageVerified?: boolean;
  category: ProductCategory;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 必要物資リスト項目DTOの型定義
export interface NeedsListItemDto {
  id?: number;
  productId: string;
  productName: string;
  unit: string;
  category: ProductCategory;
  quantity: number;
  priority: Priority;
  notes?: string;
  perUnitWeightGrams: number;
  totalWeightGrams: number;
  droneEligible: boolean;
  droneEligibleWholeOrder: boolean;
  dronePerUnitEligible: boolean;
  droneUnitsPerFlight: number;
  droneFlightsRequired: number;
}

// 必要物資リストDTOの型定義
export interface NeedsListDto {
  id?: number;
  shelterId: number;
  evacueeCount: number;
  targetDays: number;
  totalUnits: number;
  totalWeightGrams: number;
  waterCases: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  items?: NeedsListItemDto[];
}

// 在庫DTOの型定義
export interface InventoryDto {
  id?: number;
  shelterId: number;
  name: string;
  quantity: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

// 避難所状況DTOの型定義
export interface ShelterStatusDto {
  id?: number;
  shelterId: number;
  evacueeCount: number;
  injuredCount: number;
  electricityStatus: UtilityStatus;
  gasStatus: UtilityStatus;
  waterStatus: UtilityStatus;
  trafficStatus: TrafficStatus;
  createdAt?: string;
  updatedAt?: string;
}

// 健康チェックレスポンスの型定義
export interface HealthResponse {
  status: string;
  timestamp: string;
  service?: string;
  version?: string;
  message?: string;
  database?: string;
  system?: {
    javaVersion: string;
    javaVendor: string;
    osName: string;
    osVersion: string;
    totalMemory: number;
    freeMemory: number;
    usedMemory: number;
    maxMemory: number;
  };
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
