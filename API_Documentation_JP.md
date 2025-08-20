# フロントエンド開発者向け API ドキュメント

## 概要
このドキュメントは、フロントエンド開発者がバックエンドAPIを使用するためのガイドです。

**ベースURL**: `http://localhost:8080`

**注意**: 現在のシステムでは以下の2つのユーザータイプが存在します：
- **避難所**: 避難所専用のログインAPIを使用
- **支援者**: 一般ユーザーログインAPIを使用

**更新日**: 2024年8月20日（支援者専用API・在庫管理・避難所状況管理機能追加）
**更新日**: 2025年1月16日（ショッピングカート・注文・支払い機能追加）
**バージョン**: 3.0

## 認証関連 API

### 1. 支援者登録（一般ユーザー登録）
**エンドポイント**: `POST /api/auth/register`

**リクエストボディ**:
```json
{
  "username": "supporter001",
  "email": "supporter@example.com",
  "password": "password123",
  "fullName": "支援者 太郎",
  "phoneNumber": "090-1234-5678",
  "cardNumber": "1234567890123456",
  "cardExpiry": "12/25",
  "cardCvc": "123"
}
```

**レスポンス**:
```json
{
  "message": "登録が完了しました",
  "description": "ユーザー登録が正常に完了しました",
  "user": {
    "id": 1,
    "username": "supporter001",
    "email": "supporter@example.com",
    "fullName": "支援者 太郎",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

### 2. 支援者ログイン（一般ユーザーログイン）
**エンドポイント**: `POST /api/auth/login`

**リクエストボディ**:
```json
{
  "email": "supporter@example.com",
  "password": "password123"
}
```

**レスポンス**:
```json
{
  "token": "dummy-token-1",
  "message": "ログインが完了しました",
  "user": {
    "id": 1,
    "username": "supporter001",
    "email": "supporter@example.com",
    "fullName": "支援者 太郎",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

### 3. 避難所登録
**エンドポイント**: `POST /api/auth/register-shelter`

**リクエストボディ**:
```json
{
  "shelterName": "テスト避難所",
  "shelterAddress": "東京都渋谷区テスト1-1-1",
  "representativeLastName": "田中",
  "representativeFirstName": "太郎",
  "phoneNumber": "03-1234-5678",
  "email": "shelter@example.com",
  "password": "password123",
  "evacueeCount": 50,
  "injuredCount": 5,
  "electricityStatus": "AVAILABLE",
  "gasStatus": "AVAILABLE",
  "waterStatus": "AVAILABLE",
  "trafficStatus": "ACCESSIBLE"
}
```

**レスポンス**:
```json
{
  "message": "避難所登録が完了しました"
}
```

### 4. 避難所ログイン
**エンドポイント**: `POST /api/auth/login-shelter`

**リクエストボディ**:
```json
{
  "email": "shelter@example.com",
  "password": "password123"
}
```

**レスポンス**:
```json
{
  "token": "dummy-token-1",
  "message": "避難所ログインが完了しました"
}
```

### 5. ログアウト
**エンドポイント**: `POST /api/auth/logout`

**レスポンス**:
```json
{
  "message": "ログアウトが完了しました"
}
```

## 避難所管理 API

### 1. 全避難所取得
**エンドポイント**: `GET /api/shelters`

**レスポンス**:
```json
[
  {
    "id": 1,
    "shelterName": "テスト避難所",
    "shelterAddress": "東京都渋谷区テスト1-1-1",
    "representativeLastName": "田中",
    "representativeFirstName": "太郎",
    "phoneNumber": "03-1234-5678",
    "email": "shelter@example.com",
    "evacueeCount": 50,
    "injuredCount": 5,
    "electricityStatus": "AVAILABLE",
    "gasStatus": "AVAILABLE",
    "waterStatus": "AVAILABLE",
    "trafficStatus": "ACCESSIBLE",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
]
```

### 2. 避難所情報取得
**エンドポイント**: `GET /api/shelters/{id}`

### 3. 避難所状況更新
**エンドポイント**: `PUT /api/shelters/{id}/status`

**リクエストボディ**:
```json
{
  "evacueeCount": 60,
  "injuredCount": 3,
  "electricityStatus": "AVAILABLE",
  "gasStatus": "UNAVAILABLE",
  "waterStatus": "AVAILABLE",
  "trafficStatus": "ACCESSIBLE"
}
```

### 4. 避難所検索
**エンドポイント**: `GET /api/shelters/search?shelterName=テスト`

**エンドポイント**: `GET /api/shelters/search/address?address=渋谷区`

**エンドポイント**: `GET /api/shelters/search/evacuees?count=50`

## 必要物資管理 API

### 1. 全商品取得
**エンドポイント**: `GET /api/supplies/products`

**レスポンス**:
```json
[
  {
    "id": 1,
    "productId": "p-water-2l",
    "name": "飲料水 2L×6本（1ケース）",
    "unit": "ケース",
    "weightGrams": 12000,
    "recommendedPerPersonPerDay": null,
    "imageUrl": null,
    "imageVerified": false,
    "category": "食料",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
]
```

### 2. 商品登録
**エンドポイント**: `POST /api/supplies/products`

**リクエストボディ**:
```json
{
  "productId": "p-new-item",
  "name": "新しい商品",
  "unit": "個",
  "weightGrams": 500,
  "recommendedPerPersonPerDay": 1.0,
  "category": "生活用品"
}
```

### 3. 商品検索
**エンドポイント**: `GET /api/supplies/products/search?keyword=水`

### 4. 必要物資リスト作成
**エンドポイント**: `POST /api/supplies/needs-lists`

**リクエストボディ**:
```json
{
  "shelterId": 1,
  "evacueeCount": 100,
  "targetDays": 3,
  "totalUnits": 50,
  "totalWeightGrams": 25000,
  "waterCases": 5,
  "items": [
    {
      "productId": "p-water-2l",
      "productName": "飲料水 2L×6本（1ケース）",
      "unit": "ケース",
      "category": "食料",
      "quantity": 5,
      "priority": "high",
      "notes": "緊急",
      "perUnitWeightGrams": 12000,
      "totalWeightGrams": 60000,
      "droneEligible": false,
      "droneEligibleWholeOrder": false,
      "dronePerUnitEligible": true,
      "droneUnitsPerFlight": 1,
      "droneFlightsRequired": 5
    }
  ]
}
```

### 5. 避難所の必要物資リスト取得
**エンドポイント**: `GET /api/supplies/needs-lists/shelter/{shelterId}`

### 6. 必要物資リスト詳細取得
**エンドポイント**: `GET /api/supplies/needs-lists/{id}`

### 7. 必要物資リスト削除
**エンドポイント**: `DELETE /api/supplies/needs-lists/{id}`

## 在庫管理 API

### 1. 在庫一覧取得
**エンドポイント**: `GET /api/inventory/{shelterId}`

**レスポンス**:
```json
[
  {
    "id": 1,
    "shelterId": 1,
    "name": "水",
    "quantity": 0,
    "category": "水・飲料",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
]
```

### 2. 在庫数量更新
**エンドポイント**: `PUT /api/inventory/{id}`

**リクエストボディ**:
```json
{
  "quantity": 10
}
```

### 3. 在庫アイテム追加
**エンドポイント**: `POST /api/inventory`

**リクエストボディ**:
```json
{
  "shelterId": 1,
  "name": "新しいアイテム",
  "quantity": 0,
  "category": "食料"
}
```

### 4. 在庫アイテム削除
**エンドポイント**: `DELETE /api/inventory/{id}`

## 支援者専用 API

### 1. 支援者プロフィール取得
**エンドポイント**: `GET /api/supporter/profile/{userId}`

**レスポンス**:
```json
{
  "id": 1,
  "username": "supporter001",
  "email": "supporter@example.com",
  "fullName": "支援者 太郎",
  "phoneNumber": "090-1234-5678",
  "cardNumber": "1234567890123456",
  "cardExpiry": "12/25",
  "cardCvc": "123",
  "role": "USER",
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

### 2. 支援者プロフィール更新
**エンドポイント**: `PUT /api/supporter/profile/{userId}`

**リクエストボディ**:
```json
{
  "fullName": "支援者 太郎",
  "phoneNumber": "090-1234-5678",
  "email": "supporter@example.com"
}
```

### 3. 支援可能避難所一覧取得
**エンドポイント**: `GET /api/supporter/available-shelters`

**レスポンス**:
```json
[
  {
    "id": 1,
    "shelterName": "避難所A",
    "address": "東京都渋谷区...",
    "evacueeCount": 50,
    "injuredCount": 2,
    "electricityStatus": "AVAILABLE",
    "gasStatus": "UNAVAILABLE",
    "waterStatus": "AVAILABLE",
    "trafficStatus": "RESTRICTED",
    "lastUpdated": "2024-01-01T10:00:00"
  }
]
```

### 4. 支援履歴取得
**エンドポイント**: `GET /api/supporter/support-history/{userId}`

**レスポンス**:
```json
[
  {
    "id": 1,
    "shelterName": "避難所A",
    "supportDate": "2024-01-15",
    "supportType": "物資提供",
    "status": "完了"
  }
]
```

### 5. 支援者統計情報取得
**エンドポイント**: `GET /api/supporter/statistics/{userId}`

**レスポンス**:
```json
{
  "totalSupports": 15,
  "totalShelters": 8,
  "totalHours": 120,
  "currentMonthSupports": 3,
  "favoriteShelter": "避難所A"
}
```

### 6. 通知設定取得
**エンドポイント**: `GET /api/supporter/notifications/{userId}`

**レスポンス**:
```json
{
  "emailNotifications": true,
  "smsNotifications": false,
  "emergencyAlerts": true,
  "weeklyDigest": true,
  "shelterUpdates": true
}
```

### 7. 通知設定更新
**エンドポイント**: `PUT /api/supporter/notifications/{userId}`

**リクエストボディ**:
```json
{
  "emailNotifications": true,
  "smsNotifications": false,
  "emergencyAlerts": true,
  "weeklyDigest": true,
  "shelterUpdates": true
}
```

## 支援者管理 API（管理者用）
**エンドポイント**: `GET /api/users`

**レスポンス**:
```json
[
  {
    "id": 1,
    "username": "supporter001",
    "email": "supporter@example.com",
    "fullName": "支援者 太郎",
    "phoneNumber": "090-1234-5678",
    "cardNumber": "1234567890123456",
    "cardExpiry": "12/25",
    "cardCvc": "123",
    "role": "USER",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
]
```

### 2. 支援者情報取得
**エンドポイント**: `GET /api/users/{id}`

### 3. 支援者情報更新
**エンドポイント**: `PUT /api/users/{id}`

### 4. 支援者検索
**エンドポイント**: `GET /api/users/search?keyword=支援者`

### 5. 支援者削除
**エンドポイント**: `DELETE /api/users/{id}`

## 避難所状況管理 API

### 1. 避難所状況取得
**エンドポイント**: `GET /api/shelter-status/{shelterId}`

**レスポンス**:
```json
{
  "id": 1,
  "shelterId": 1,
  "evacueeCount": 50,
  "injuredCount": 2,
  "electricityStatus": "AVAILABLE",
  "gasStatus": "UNAVAILABLE",
  "waterStatus": "AVAILABLE",
  "trafficStatus": "RESTRICTED",
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

### 2. 避難所状況更新
**エンドポイント**: `PUT /api/shelter-status/{shelterId}`

**リクエストボディ**:
```json
{
  "evacueeCount": 50,
  "injuredCount": 2,
  "electricityStatus": "AVAILABLE",
  "gasStatus": "UNAVAILABLE",
  "waterStatus": "AVAILABLE",
  "trafficStatus": "RESTRICTED"
}
```

## システム状態確認 API

### 1. アプリケーション健康状態
**エンドポイント**: `GET /api/health`

**レスポンス**:
```json
{
  "status": "UP",
  "timestamp": "2024-01-01T10:00:00",
  "service": "Demo API",
  "version": "2.0.0"
}
```

### 2. データベース健康状態
**エンドポイント**: `GET /api/health/database`

**レスポンス**:
```json
{
  "status": "UP",
  "database": "SQLite",
  "version": "3.42.0",
  "message": "データベース接続が正常です",
  "timestamp": "2024-01-01T10:00:00"
}
```

### 3. システム情報取得
**エンドポイント**: `GET /api/health/system`

**レスポンス**:
```json
{
  "status": "UP",
  "message": "システムが正常に動作しています",
  "timestamp": "2024-01-01T10:00:00",
  "system": {
    "javaVersion": "21.0.2",
    "javaVendor": "Oracle Corporation",
    "osName": "Linux",
    "osVersion": "6.6.87.2-microsoft-standard-WSL2",
    "totalMemory": 1073741824,
    "freeMemory": 536870912,
    "usedMemory": 536870912,
    "maxMemory": 2147483648
  }
}
```

## エラーレスポンス

### 400 Bad Request
```json
{
  "message": "登録に失敗しました: メールアドレスは既に使用されています"
}
```

### 401 Unauthorized
```json
{
  "message": "メールアドレスまたはパスワードが正しくありません"
}
```

### 404 Not Found
```json
{
  "message": "指定されたリソースが見つかりません"
}
```

### 500 Internal Server Error
```json
{
  "message": "サーバー内部エラーが発生しました"
}
```

## 使用例

### フロントエンド統合例

#### 1. 支援者ログイン後の機能利用フロー
```typescript
// 1. 支援者ログイン
const loginSupporter = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const data: AuthResponse = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user?.id?.toString() || '');
    return data;
  }
  throw new Error('ログインに失敗しました');
};

// 2. 支援者登録
const registerSupporter = async (userData: any): Promise<AuthResponse> => {
  const response = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  if (response.ok) {
    return await response.json();
  }
  throw new Error('登録に失敗しました');
};

// 3. 支援者登録データの型定義
interface SupporterRegistrationData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
}

// 4. 支援者専用機能の使用例
const getSupporterProfile = async (userId: number): Promise<UserDto> => {
  const response = await fetch(`http://localhost:8080/api/supporter/profile/${userId}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  
  if (response.ok) {
    return await response.json();
  }
  throw new Error('プロフィール取得に失敗しました');
};

const getAvailableShelters = async (): Promise<any[]> => {
  const response = await fetch('http://localhost:8080/api/supporter/available-shelters');
  
  if (response.ok) {
    return await response.json();
  }
  throw new Error('避難所一覧取得に失敗しました');
};

const updateSupporterProfile = async (userId: number, profileData: any): Promise<UserDto> => {
  const response = await fetch(`http://localhost:8080/api/supporter/profile/${userId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(profileData)
  });
  
  if (response.ok) {
    return await response.json();
  }
  throw new Error('プロフィール更新に失敗しました');
};

#### 2. 避難所ログイン後の機能利用フロー
```typescript
// 1. 在庫管理
const getInventory = async (shelterId: number): Promise<InventoryDto[]> => {
  const response = await fetch(`http://localhost:8080/api/inventory/${shelterId}`);
  
  if (response.ok) {
    return await response.json();
  }
  throw new Error('在庫取得に失敗しました');
};

const updateInventoryQuantity = async (itemId: number, quantity: number): Promise<InventoryDto> => {
  const response = await fetch(`http://localhost:8080/api/inventory/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });
  
  if (response.ok) {
    return await response.json();
  }
  throw new Error('在庫更新に失敗しました');
};

// 2. 避難所状況管理
const getShelterStatus = async (shelterId: number): Promise<ShelterStatusDto> => {
  const response = await fetch(`http://localhost:8080/api/shelter-status/${shelterId}`);
  
  if (response.ok) {
    return await response.json();
  }
  throw new Error('状況取得に失敗しました');
};

const updateShelterStatus = async (shelterId: number, statusData: any): Promise<ShelterStatusDto> => {
  const response = await fetch(`http://localhost:8080/api/shelter-status/${shelterId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(statusData)
  });
  
  if (response.ok) {
    return await response.json();
  }
  throw new Error('状況更新に失敗しました');
};
```

#### 3. 避難所ログイン後の必要物資リスト作成フロー
```typescript
// 型定義
interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  message: string;
  shelterId?: number;
}

interface Product {
  id: number;
  productId: string;
  name: string;
  unit: string;
  weightGrams: number;
  category: string;
  isActive: boolean;
}

interface NeedsListDto {
  shelterId: number;
  evacueeCount: number;
  targetDays: number;
  totalUnits?: number;
  totalWeightGrams?: number;
  waterCases?: number;
  items?: NeedsListItemDto[];
}

interface NeedsListItemDto {
  productId: string;
  productName: string;
  unit: string;
  category: string;
  quantity: number;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  perUnitWeightGrams?: number;
  totalWeightGrams?: number;
  droneEligible?: boolean;
  droneEligibleWholeOrder?: boolean;
  dronePerUnitEligible?: boolean;
  droneUnitsPerFlight?: number;
  droneFlightsRequired?: number;
}

// 1. 避難所ログイン
const loginShelter = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch('http://localhost:8080/api/auth/login-shelter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const data: AuthResponse = await response.json();
    localStorage.setItem('token', data.token);
    if (data.shelterId) {
      localStorage.setItem('shelterId', data.shelterId.toString());
    }
    return data;
  }
  throw new Error('ログインに失敗しました');
};

// 2. 商品カタログ取得
const loadProductCatalog = async (): Promise<Product[]> => {
  const response = await fetch('http://localhost:8080/api/supplies/products');
  if (response.ok) {
    return await response.json();
  }
  throw new Error('商品カタログの取得に失敗しました');
};

// 3. 必要物資リスト作成
const createNeedsList = async (needsListData: NeedsListDto): Promise<NeedsListDto> => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8080/api/supplies/needs-lists', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(needsListData)
  });
  
  if (response.ok) {
    return await response.json();
  }
  throw new Error('必要物資リストの作成に失敗しました');
};

// 4. 避難所の必要物資リスト履歴取得
const loadNeedsListHistory = async (): Promise<NeedsListDto[]> => {
  const shelterId = localStorage.getItem('shelterId');
  if (!shelterId) {
    throw new Error('避難所IDが設定されていません');
  }
  
  const response = await fetch(`http://localhost:8080/api/supplies/needs-lists/shelter/${shelterId}`);
  if (response.ok) {
    return await response.json();
  }
  throw new Error('必要物資リスト履歴の取得に失敗しました');
};
```

#### 2. 必要物資リストの完全な作成例
```typescript
// フロントエンドのNeedsListPayloadをバックエンドに送信
interface FrontendNeedsListPayload {
  evacueeCount: number;
  targetDays: number;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    unit: string;
    category: string;
    quantity: number;
    priority: 'high' | 'medium' | 'low';
    notes?: string;
    perUnitWeightGrams: number;
    totalWeightGrams: number;
    droneEligible: boolean;
    droneEligibleWholeOrder: boolean;
    dronePerUnitEligible: boolean;
    droneUnitsPerFlight: number | null;
    droneFlightsRequired: number | null;
  }>;
  analytics: {
    totals: {
      units: number;
      weightGrams: number;
      waterCases: number;
    };
  };
}

const submitNeedsList = async (frontendPayload: FrontendNeedsListPayload): Promise<NeedsListDto> => {
  const shelterId = localStorage.getItem('shelterId');
  if (!shelterId) {
    throw new Error('避難所IDが設定されていません');
  }

  const backendPayload: NeedsListDto = {
    shelterId: parseInt(shelterId),
    evacueeCount: frontendPayload.evacueeCount,
    targetDays: frontendPayload.targetDays,
    totalUnits: frontendPayload.analytics.totals.units,
    totalWeightGrams: frontendPayload.analytics.totals.weightGrams,
    waterCases: frontendPayload.analytics.totals.waterCases,
    items: frontendPayload.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      unit: item.unit,
      category: item.category,
      quantity: item.quantity,
      priority: item.priority,
      notes: item.notes,
      perUnitWeightGrams: item.perUnitWeightGrams,
      totalWeightGrams: item.totalWeightGrams,
      droneEligible: item.droneEligible,
      droneEligibleWholeOrder: item.droneEligibleWholeOrder,
      dronePerUnitEligible: item.dronePerUnitEligible,
      droneUnitsPerFlight: item.droneUnitsPerFlight,
      droneFlightsRequired: item.droneFlightsRequired
    }))
  };
  
  return await createNeedsList(backendPayload);
};
```

### TypeScript (fetch) での使用例

```typescript
// 基本的なAPI呼び出し例

// 避難所登録
const registerShelter = async (shelterData: any): Promise<any> => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/register-shelter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shelterData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('避難所登録成功:', data);
      return data;
    } else {
      const error = await response.json();
      console.error('避難所登録失敗:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('エラー:', error);
    throw error;
  }
};

// 避難所ログイン
const loginShelter = async (email: string, password: string): Promise<any> => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login-shelter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('避難所ログイン成功:', data);
      localStorage.setItem('token', data.token);
      return data;
    } else {
      const error = await response.json();
      console.error('避難所ログイン失敗:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('エラー:', error);
    throw error;
  }
};

// 避難所一覧取得
const getShelters = async (): Promise<any[]> => {
  try {
    const response = await fetch('http://localhost:8080/api/shelters');
    
    if (response.ok) {
      const data = await response.json();
      console.log('避難所一覧:', data);
      return data;
    } else {
      console.error('取得失敗');
      throw new Error('避難所一覧の取得に失敗しました');
    }
  } catch (error) {
    console.error('エラー:', error);
    throw error;
  }
};

// 商品一覧取得
const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('http://localhost:8080/api/supplies/products');
    
    if (response.ok) {
      const data = await response.json();
      console.log('商品一覧:', data);
      return data;
    } else {
      console.error('取得失敗');
      throw new Error('商品一覧の取得に失敗しました');
    }
  } catch (error) {
    console.error('エラー:', error);
    throw error;
  }
};

// 必要物資リスト作成
const createNeedsList = async (needsListData: NeedsListDto): Promise<NeedsListDto> => {
  try {
    const response = await fetch('http://localhost:8080/api/supplies/needs-lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(needsListData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('必要物資リスト作成成功:', data);
      return data;
    } else {
      const error = await response.json();
      console.error('必要物資リスト作成失敗:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('エラー:', error);
    throw error;
  }
};

// 避難所の必要物資リスト取得
const getNeedsListsByShelter = async (shelterId: number): Promise<NeedsListDto[]> => {
  try {
    const response = await fetch(`http://localhost:8080/api/supplies/needs-lists/shelter/${shelterId}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('避難所の必要物資リスト:', data);
      return data;
    } else {
      console.error('取得失敗');
      throw new Error('避難所の必要物資リストの取得に失敗しました');
    }
  } catch (error) {
    console.error('エラー:', error);
    throw error;
  }
};

// 必要物資リスト詳細取得
const getNeedsListById = async (id: number): Promise<NeedsListDto> => {
  try {
    const response = await fetch(`http://localhost:8080/api/supplies/needs-lists/${id}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('必要物資リスト詳細:', data);
      return data;
    } else {
      console.error('取得失敗');
      throw new Error('必要物資リスト詳細の取得に失敗しました');
    }
  } catch (error) {
    console.error('エラー:', error);
    throw error;
  }
};

// 商品検索
const searchProducts = async (keyword: string): Promise<Product[]> => {
  try {
    const response = await fetch(`http://localhost:8080/api/supplies/products/search?keyword=${encodeURIComponent(keyword)}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('商品検索結果:', data);
      return data;
    } else {
      console.error('検索失敗');
      throw new Error('商品検索に失敗しました');
    }
  } catch (error) {
    console.error('エラー:', error);
    throw error;
  }
};
```

## 注意事項

1. **システム機能**: 現在のシステムでは以下の2つのユーザータイプが存在します：
   - **支援者**: 一般ユーザーAPIを使用（登録・ログイン・管理）
   - **避難所**: 避難所専用APIを使用（登録・ログイン・管理）

2. **CORS設定**: バックエンドは `@CrossOrigin(origins = "*")` で設定されているため、フロントエンドからのアクセスが可能です。

3. **認証**: 現在はダミートークンを使用しています。本格的なJWT認証の実装は今後の課題です。

4. **バリデーション**: 各APIには適切なバリデーションが設定されています。エラーメッセージは日本語で返されます。

5. **データベース**: ローカル開発環境ではSQLiteを使用し、データは `backend/demo.db` に保存されます。

6. **開発環境**: バックエンドは `http://localhost:8080` で起動します。フロントエンドは `http://localhost:3000` で起動することを想定しています。

7. **商品カタログ**: データベースには21種類のデフォルト商品が事前に登録されています（医薬品、衛生用品、食料、生活用品）。

8. **必要物資リスト**: 避難所は複数の必要物資リストを作成・管理できます。各リストには詳細な明細項目が含まれます。

## API 一覧

### 認証関連
- `POST /api/auth/register` - 支援者登録
- `POST /api/auth/login` - 支援者ログイン
- `POST /api/auth/register-shelter` - 避難所登録
- `POST /api/auth/login-shelter` - 避難所ログイン
- `POST /api/auth/logout` - ログアウト

### 支援者専用
- `GET /api/supporter/profile/{userId}` - 支援者プロフィール取得
- `PUT /api/supporter/profile/{userId}` - 支援者プロフィール更新
- `GET /api/supporter/available-shelters` - 支援可能避難所一覧取得
- `GET /api/supporter/support-history/{userId}` - 支援履歴取得
- `GET /api/supporter/statistics/{userId}` - 支援者統計情報取得
- `GET /api/supporter/notifications/{userId}` - 通知設定取得
- `PUT /api/supporter/notifications/{userId}` - 通知設定更新

### 支援者管理（管理者用）
- `GET /api/users` - 全支援者取得
- `GET /api/users/{id}` - 支援者情報取得
- `PUT /api/users/{id}` - 支援者情報更新
- `GET /api/users/search` - 支援者検索
- `DELETE /api/users/{id}` - 支援者削除

### 避難所管理
- `GET /api/shelters` - 全避難所取得
- `GET /api/shelters/{id}` - 避難所情報取得
- `PUT /api/shelters/{id}/status` - 避難所状況更新
- `GET /api/shelters/search` - 避難所検索

### 在庫管理
- `GET /api/inventory/{shelterId}` - 在庫一覧取得
- `PUT /api/inventory/{id}` - 在庫数量更新
- `POST /api/inventory` - 在庫アイテム追加
- `DELETE /api/inventory/{id}` - 在庫アイテム削除

### 避難所状況管理
- `GET /api/shelter-status/{shelterId}` - 避難所状況取得
- `PUT /api/shelter-status/{shelterId}` - 避難所状況更新

### 必要物資管理
- `GET /api/supplies/products` - 全商品取得
- `POST /api/supplies/products` - 商品登録
- `GET /api/supplies/products/search` - 商品検索
- `POST /api/supplies/needs-lists` - 必要物資リスト作成
- `GET /api/supplies/needs-lists/shelter/{shelterId}` - 避難所の必要物資リスト取得
- `GET /api/supplies/needs-lists/{id}` - 必要物資リスト詳細取得
- `DELETE /api/supplies/needs-lists/{id}` - 必要物資リスト削除

### ショッピングカート管理
- `GET /api/carts/user/{userId}` - ユーザーのショッピングカート一覧取得
- `GET /api/carts/{cartId}` - ショッピングカート詳細取得
- `POST /api/carts` - ショッピングカート作成
- `PUT /api/carts/{cartId}` - ショッピングカート更新
- `DELETE /api/carts/{cartId}` - ショッピングカート削除
- `POST /api/carts/{cartId}/items` - カートアイテム追加
- `PUT /api/carts/items/{itemId}` - カートアイテム更新
- `DELETE /api/carts/items/{itemId}` - カートアイテム削除

### 注文管理
- `GET /api/orders/user/{userId}` - ユーザーの注文一覧取得
- `GET /api/orders/{orderId}` - 注文詳細取得
- `POST /api/orders` - 注文作成
- `PUT /api/orders/{orderId}/status` - 注文ステータス更新
- `DELETE /api/orders/{orderId}` - 注文削除
- `GET /api/orders/shelter/{shelterId}` - 避難所の注文一覧取得

### 支払い管理
- `GET /api/payments/order/{orderId}` - 注文の支払い記録取得
- `POST /api/payments` - 支払い記録作成
- `PUT /api/payments/{paymentId}/status` - 支払いステータス更新
- `GET /api/payments/user/{userId}` - ユーザーの支払い記録取得

### システム状態確認
- `GET /api/health` - アプリケーション健康状態
- `GET /api/health/database` - データベース健康状態
- `GET /api/health/system` - システム情報取得

## 📊 **API 総数統計**

**現在利用可能なAPI総数：48個**

- **認証関連**: 5個
- **支援者専用**: 7個 ⭐ **新機能**
- **支援者管理（管理者用）**: 5個
- **避難所管理**: 4個
- **在庫管理**: 4個 ⭐ **新機能**
- **避難所状況管理**: 4個 ⭐ **新機能**
- **必要物資管理**: 7個
- **ショッピングカート管理**: 8個
- **注文管理**: 6個
- **支払い管理**: 4個
- **システム状態確認**: 3個
