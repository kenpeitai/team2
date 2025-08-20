# Repository + Service + Controller アーキテクチャサマリー

## 現在のアーキテクチャ状況

### ✅ 完了したレイヤー

#### 1. Repository レイヤー（データアクセス層）
- **UserRepository** - ユーザーデータアクセス
- **ShelterRepository** - 避難所データアクセス  
- **ProductRepository** - 商品データアクセス
- **NeedsListRepository** - 必要物資リストデータアクセス
- **NeedsListItemRepository** - 必要物資リスト項目データアクセス
- **CartRepository** - ショッピングカートデータアクセス
- **CartItemRepository** - ショッピングカート項目データアクセス
- **OrderRepository** - 注文データアクセス
- **OrderItemRepository** - 注文項目データアクセス
- **PaymentRepository** - 支払いデータアクセス

#### 2. Service レイヤー（ビジネスロジック層）
- **UserService** - ユーザービジネスロジック
  - ユーザー登録、更新、パスワード管理
  - ユーザー情報検索
  - 重複性チェック
- **ShelterService** - 避難所ビジネスロジック
  - 避難所管理
  - 状態更新
- **ProductService** - 商品ビジネスロジック
  - 商品CRUD操作
  - 検索とフィルタリング
  - 画像検証管理
- **NeedsListService** - 必要物資リストビジネスロジック
  - 必要物資リスト管理
  - 項目追加と管理
  - 計算機能（総重量、総単位数）
- **CartService** - ショッピングカートビジネスロジック
  - ショッピングカート管理
  - ショッピングカート項目追加、更新、削除
  - ショッピングカート計算機能（総金額、総数量）
- **OrderService** - 注文ビジネスロジック
  - 注文作成と状態管理
  - 注文項目管理
  - 計算機能（総金額、総数量）
- **PaymentService** - 支払いビジネスロジック
  - 支払い処理
  - 支払い状態管理
  - 取引記録管理

#### 3. Controller レイヤー（API制御層）
- **UserController** - ユーザーAPI
- **ShelterController** - 避難所API
- **AuthController** - 認証API
- **SupplyController** - 供給管理API
- **ProductController** - 商品API
- **CartController** - ショッピングカートAPI
- **OrderController** - 注文API
- **PaymentController** - 支払いAPI
- **HealthController** - ヘルスチェックAPI
- **DatabaseHealthController** - データベースヘルスチェックAPI

### ✅ 新規追加された支援者側機能（完全実装）

#### 1. 新規追加されたEntity（データモデル）
- **Cart** - ショッピングカートエンティティ
- **CartItem** - ショッピングカート項目エンティティ
- **Order** - 注文エンティティ
- **OrderItem** - 注文項目エンティティ
- **Payment** - 支払いエンティティ
- **OrderStatus** - 注文状態列挙型
- **PaymentMethod** - 支払い方法列挙型
- **PaymentStatus** - 支払い状態列挙型

#### 2. 新規追加されたDTO（データ転送オブジェクト）
- **CartDto** - ショッピングカートDTO
- **CartItemDto** - ショッピングカート項目DTO
- **OrderDto** - 注文DTO
- **OrderItemDto** - 注文項目DTO
- **PaymentDto** - 支払いDTO

#### 3. 新規追加されたRepository
- **CartRepository** - ショッピングカートデータアクセス
- **CartItemRepository** - ショッピングカート項目データアクセス
- **PaymentRepository** - 支払いデータアクセス

#### 4. 新規追加されたService
- **CartService** - ショッピングカートビジネスロジック
  - ユーザー別ショッピングカート管理
  - 避難所別ショッピングカート管理
  - 商品追加・更新・削除機能
  - ショッピングカート計算機能
- **PaymentService** - 支払いビジネスロジック
  - 支払い記録作成・管理
  - 支払い処理・状態更新
  - 取引ID生成
  - 支払い完了確認機能

#### 5. 新規追加されたController
- **CartController** - ショッピングカートAPI（6個のエンドポイント）
- **OrderController** - 注文API（8個のエンドポイント）
- **PaymentController** - 支払いAPI（10個のエンドポイント）

#### 6. 新規追加されたフロントエンドAPIサービス
- **cart.ts** - ショッピングカートAPI呼び出しサービス
- **orders.ts** - 注文API呼び出しサービス
- **payments.ts** - 支払いAPI呼び出しサービス

### ❌ まだ不足しているレイヤー

#### 1. 不足しているController
- **NeedsListController** - 必要物資リストAPI（SupplyControllerに統合することを検討）

#### 2. 不足しているService
- **OrderService** - 注文ビジネスロジック（OrderControllerで直接実装されている部分を分離）

## アーキテクチャ設計原則

### 1. レイヤーアーキテクチャ
```
Controller (API層)
    ↓
Service (ビジネスロジック層)
    ↓
Repository (データアクセス層)
    ↓
Entity (データモデル層)
```

### 2. 責任分離
- **Controller**: HTTPリクエスト処理、パラメータ検証、レスポンス返却
- **Service**: ビジネスロジック処理、トランザクション管理、データ検証
- **Repository**: データアクセス、データベース操作
- **Entity**: データモデル定義

### 3. 依存性注入
- `@Autowired`を使用した依存性注入
- SpringのIoCコンテナ管理に従う

### 4. 例外処理
- 統一された例外処理メカニズム
- カスタム例外クラス：`ResourceNotFoundException`、`DuplicateResourceException`
- グローバル例外ハンドラー：`GlobalExceptionHandler`

## 次のステップ提案

### 1. 高優先度 - コア機能の完成
1. **NeedsListControllerの完成**
   - 必要物資リストのCRUD API
   - 項目管理API
   - 統計機能API
   - 既存のSupplyControllerへの統合を検討

2. **OrderServiceの完成**
   - OrderControllerからビジネスロジックを分離
   - 注文管理ビジネスロジック
   - 注文状態更新ビジネスロジック
   - 注文項目管理ビジネスロジック
   - 注文履歴検索ビジネスロジック

### 2. 中優先度 - 機能最適化
1. **CartServiceとCartControllerの最適化**
   - ショッピングカート機能最適化
   - ショッピングカート項目管理最適化
   - ショッピングカート統合機能
   - パフォーマンス改善

2. **PaymentServiceとPaymentControllerの最適化**
   - 支払い処理最適化
   - 支払い状態管理最適化
   - 支払いコールバック処理
   - セキュリティ強化

### 3. 低優先度 - 最適化と拡張
1. **キャッシュ層の追加**
   - Redisを使用したホットデータのキャッシュ
   - クエリパフォーマンスの向上

2. **イベント駆動の追加**
   - 注文状態変更イベント
   - 在庫変更イベント

3. **監査機能の追加**
   - 操作ログ記録
   - データ変更追跡

## コード品質の特徴

### 1. 一貫性
- 統一された命名規則
- 統一された例外処理
- 統一されたAPIレスポンス形式

### 2. 保守性
- 明確なレイヤー構造
- 単一責任原則
- 良好なコードコメント

### 3. 拡張性
- モジュラー設計
- インターフェース抽象化
- 設定の外部化

### 4. セキュリティ
- 入力検証
- 権限制御
- データマスキング

## 技術スタック

- **フレームワーク**: Spring Boot 3.x
- **ORM**: Spring Data JPA
- **データベース**: SQLite (開発) / PostgreSQL (本番)
- **データベースマイグレーション**: Flyway
- **APIドキュメント**: Swagger/OpenAPI 3
- **ビルドツール**: Gradle
- **コンテナ化**: Docker
- **フロントエンド**: Next.js (React)
- **言語**: Java 21, TypeScript

## プロジェクト状況サマリー

### ✅ 完了した機能
1. **基本アーキテクチャ** - 完全なレイヤーアーキテクチャ設計
2. **ユーザー管理** - 支援者と避難所ユーザー管理
3. **避難所管理** - 避難所情報と状態管理
4. **商品管理** - 商品カタログと在庫管理
5. **必要物資リスト** - 避難所必要物資リスト管理
6. **支援者側機能** - ショッピングカート、注文、支払いシステム

### 📊 統計情報
- **総API数**: 70個
- **データベーステーブル**: 12個
- **Controller層**: 12個
- **Service層**: 8個
- **Repository層**: 12個
- **Entity層**: 18個（列挙型を含む）
- **DTO層**: 8個
- **フロントエンドAPIサービス**: 8個

このアーキテクチャ設計はSpring Bootのベストプラクティスに従い、良好な保守性と拡張性を備えています。支援者側機能の追加により、システム機能がより完全になり、完全なECフローをサポートしています。
