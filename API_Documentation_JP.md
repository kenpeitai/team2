# フロントエンド開発者向け API ドキュメント

## 概要
このドキュメントは、フロントエンド開発者がバックエンドAPIを使用するためのガイドです。

**ベースURL**: `http://localhost:8080`

**注意**: 現在のシステムでは避難所のみがログイン可能です。一般ユーザーの機能は実装されていません。

**更新日**: 2024年8月20日
**バージョン**: 2.0

## 認証関連 API

### 1. 避難所登録
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

### 2. 避難所ログイン
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

### 3. ログアウト
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

### 1. 在庫状況取得
**エンドポイント**: `GET /api/inventory/status`

**レスポンス**:
```json
{
  "totalItems": 150,
  "availableItems": 120,
  "reservedItems": 30,
  "lowStockItems": 5,
  "categories": {
    "医薬品": 45,
    "衛生": 25,
    "食料": 50,
    "生活用品": 30
  }
}
```

### 2. 在庫詳細取得
**エンドポイント**: `GET /api/inventory/items`

**レスポンス**:
```json
[
  {
    "productId": "p-water-2l",
    "productName": "飲料水 2L×6本（1ケース）",
    "category": "食料",
    "currentStock": 50,
    "reservedStock": 10,
    "availableStock": 40,
    "minStockLevel": 5,
    "lastUpdated": "2024-01-01T10:00:00"
  }
]
```

### 3. 在庫更新
**エンドポイント**: `PUT /api/inventory/items/{productId}`

**リクエストボディ**:
```json
{
  "currentStock": 45,
  "reservedStock": 8,
  "notes": "入荷分を追加"
}
```

## ユーザー管理 API（参考用）

**注意**: 現在のシステムでは一般ユーザーの機能は実装されていませんが、以下のAPIは技術的に利用可能です。

### 1. 全ユーザー取得
**エンドポイント**: `GET /api/users`

### 2. ユーザー情報取得
**エンドポイント**: `GET /api/users/{id}`

### 3. ユーザー情報更新
**エンドポイント**: `PUT /api/users/{id}`

### 4. ユーザー検索
**エンドポイント**: `GET /api/users/search?keyword=テスト`

### 5. ユーザー削除
**エンドポイント**: `DELETE /api/users/{id}`

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

#### 1. 避難所ログイン後の必要物資リスト作成フロー
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

1. **システム機能**: 現在のシステムでは避難所のみがログイン・登録可能です。一般ユーザーの機能は実装されていません。

2. **CORS設定**: バックエンドは `@CrossOrigin(origins = "*")` で設定されているため、フロントエンドからのアクセスが可能です。

3. **認証**: 現在はダミートークンを使用しています。本格的なJWT認証の実装は今後の課題です。

4. **バリデーション**: 各APIには適切なバリデーションが設定されています。エラーメッセージは日本語で返されます。

5. **データベース**: ローカル開発環境ではSQLiteを使用し、データは `backend/demo.db` に保存されます。

6. **開発環境**: バックエンドは `http://localhost:8080` で起動します。フロントエンドは `http://localhost:3000` で起動することを想定しています。

7. **商品カタログ**: データベースには21種類のデフォルト商品が事前に登録されています（医薬品、衛生用品、食料、生活用品）。

8. **必要物資リスト**: 避難所は複数の必要物資リストを作成・管理できます。各リストには詳細な明細項目が含まれます。

## API 一覧

### 認証関連
- `POST /api/auth/register-shelter` - 避難所登録
- `POST /api/auth/login-shelter` - 避難所ログイン
- `POST /api/auth/logout` - ログアウト

### 避難所管理
- `GET /api/shelters` - 全避難所取得
- `GET /api/shelters/{id}` - 避難所情報取得
- `PUT /api/shelters/{id}/status` - 避難所状況更新
- `GET /api/shelters/search` - 避難所検索

### 必要物資管理
- `GET /api/supplies/products` - 全商品取得
- `POST /api/supplies/products` - 商品登録
- `GET /api/supplies/products/search` - 商品検索
- `POST /api/supplies/needs-lists` - 必要物資リスト作成
- `GET /api/supplies/needs-lists/shelter/{shelterId}` - 避難所の必要物資リスト取得
- `GET /api/supplies/needs-lists/{id}` - 必要物資リスト詳細取得
- `DELETE /api/supplies/needs-lists/{id}` - 必要物資リスト削除

### システム状態確認
- `GET /api/health` - アプリケーション健康状態
- `GET /api/health/database` - データベース健康状態
- `GET /api/health/system` - システム情報取得
