# データベースフィールド説明ドキュメント

## データベース概要
- **データベースタイプ**: SQLite
- **データベースファイル**: `demo.db`
- **場所**: `backend/demo.db`

---

## 基本テーブル構造

### 1. users テーブル（ユーザーテーブル）
| フィールド名 | タイプ | 説明 |
|-------------|--------|------|
| id | INTEGER | 主キー、自動増分ID |
| username | VARCHAR(50) | ユーザー名、ユニーク |
| email | VARCHAR(255) | メールアドレス、ユニーク |
| password | VARCHAR(255) | パスワード |
| full_name | VARCHAR(100) | 氏名 |
| role | VARCHAR(255) | 役割：USER/ADMIN/MODERATOR |
| is_active | BOOLEAN | アクティブ状態 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 2. shelters テーブル（避難所テーブル）
| フィールド名 | タイプ | 説明 |
|-------------|--------|------|
| id | INTEGER | 主キー、自動増分ID |
| shelter_name | VARCHAR(100) | 避難所名、ユニーク |
| shelter_address | VARCHAR(200) | 避難所住所 |
| representative_last_name | VARCHAR(50) | 代表者姓 |
| representative_first_name | VARCHAR(50) | 代表者名 |
| phone_number | VARCHAR(20) | 電話番号 |
| email | VARCHAR(100) | メールアドレス、ユニーク |
| password | VARCHAR(255) | パスワード |
| evacuee_count | INTEGER | 避難者数、デフォルト0 |
| injured_count | INTEGER | 負傷者数、デフォルト0 |
| electricity_status | VARCHAR(20) | 電力状態：AVAILABLE/UNAVAILABLE |
| gas_status | VARCHAR(20) | ガス状態：AVAILABLE/UNAVAILABLE |
| water_status | VARCHAR(20) | 水道状態：AVAILABLE/UNAVAILABLE |
| traffic_status | VARCHAR(20) | 交通状態：NORMAL/RESTRICTED/CLOSED |
| is_active | BOOLEAN | アクティブ状態、デフォルト1 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 3. products テーブル（商品テーブル）
| フィールド名 | タイプ | 説明 |
|-------------|--------|------|
| id | INTEGER | 主キー、自動増分ID |
| product_id | VARCHAR(100) | 商品ID、ユニーク |
| name | VARCHAR(200) | 商品名 |
| unit | VARCHAR(50) | 単位 |
| weight_grams | INTEGER | 重量（グラム） |
| recommended_per_person_per_day | REAL | 1人1日あたり推奨量 |
| image_url | VARCHAR(500) | 画像URL |
| image_verified | BOOLEAN | 画像検証済み、デフォルトFALSE |
| category | VARCHAR(50) | カテゴリ：医薬品/衛生/食料/生活用品 |
| is_active | BOOLEAN | アクティブ状態、デフォルトTRUE |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 4. needs_lists テーブル（必要物資リストテーブル）
| フィールド名 | タイプ | 説明 |
|-------------|--------|------|
| id | INTEGER | 主キー、自動増分ID |
| shelter_id | INTEGER | 避難所ID |
| evacuee_count | INTEGER | 避難者数 |
| target_days | INTEGER | 目標日数 |
| total_units | INTEGER | 総単位数 |
| total_weight_grams | INTEGER | 総重量（グラム） |
| water_cases | INTEGER | 水ケース数 |
| is_active | BOOLEAN | アクティブ状態、デフォルトTRUE |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 5. needs_list_items テーブル（必要物資リスト項目テーブル）
| フィールド名 | タイプ | 説明 |
|-------------|--------|------|
| id | INTEGER | 主キー、自動増分ID |
| needs_list_id | INTEGER | 必要物資リストID、外部キー |
| product_id | VARCHAR(100) | 商品ID |
| product_name | VARCHAR(200) | 商品名 |
| unit | VARCHAR(50) | 単位 |
| category | VARCHAR(50) | カテゴリ |
| quantity | INTEGER | 数量 |
| priority | VARCHAR(20) | 優先度：high/medium/low |
| notes | TEXT | 備考 |
| per_unit_weight_grams | INTEGER | 1単位あたり重量（グラム） |
| total_weight_grams | INTEGER | 総重量（グラム） |
| drone_eligible | BOOLEAN | ドローン配送適格 |
| drone_eligible_whole_order | BOOLEAN | 注文全体ドローン配送適格 |
| drone_per_unit_eligible | BOOLEAN | 1単位あたりドローン配送適格 |
| drone_units_per_flight | INTEGER | 1フライトあたり配送可能単位数 |
| drone_flights_required | INTEGER | 必要フライト数 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 6. flyway_schema_history テーブル（データベースマイグレーション履歴テーブル）
これはFlywayフレームワークが自動生成するテーブルで、データベースバージョンマイグレーション履歴を記録するために使用され、通常は手動操作は不要です。

---

## 支援人側新規テーブル構造

### 1. carts テーブル（ショッピングカートテーブル）
| フィールド名 | タイプ | 説明 |
|-------------|--------|------|
| id | INTEGER | 主キー、自動増分ID |
| user_id | INTEGER | ユーザーID、外部キー |
| shelter_id | INTEGER | 避難所ID、外部キー |
| is_active | BOOLEAN | アクティブ状態、デフォルトTRUE |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 2. cart_items テーブル（ショッピングカート明細テーブル）
| フィールド名 | タイプ | 説明 |
|-------------|--------|------|
| id | INTEGER | 主キー、自動増分ID |
| cart_id | INTEGER | ショッピングカートID、外部キー |
| product_id | VARCHAR(100) | 商品ID |
| product_name | VARCHAR(200) | 商品名 |
| unit | VARCHAR(50) | 単位 |
| category | VARCHAR(50) | カテゴリ |
| quantity | INTEGER | 数量、デフォルト1 |
| price_per_unit | REAL | 単価 |
| total_price | REAL | 合計金額 |
| notes | TEXT | 備考 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 3. orders テーブル（注文ヘッダーテーブル）
| フィールド名 | タイプ | 説明 |
|-------------|--------|------|
| id | INTEGER | 主キー、自動増分ID |
| order_number | VARCHAR(50) | 注文番号、ユニーク |
| user_id | INTEGER | ユーザーID、外部キー |
| shelter_id | INTEGER | 避難所ID、外部キー |
| order_status | VARCHAR(20) | 注文ステータス、デフォルトPENDING |
| total_amount | REAL | 注文合計金額 |
| shipping_address | TEXT | 配送先住所 |
| contact_phone | VARCHAR(20) | 連絡先電話番号 |
| contact_email | VARCHAR(100) | 連絡先メールアドレス |
| estimated_delivery_date | DATE | 予定配達日 |
| actual_delivery_date | DATE | 実際配達日 |
| notes | TEXT | 備考 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 4. order_items テーブル（注文明細テーブル）
| フィールド名 | タイプ | 説明 |
|-------------|--------|------|
| id | INTEGER | 主キー、自動増分ID |
| order_id | INTEGER | 注文ID、外部キー |
| product_id | VARCHAR(100) | 商品ID |
| product_name | VARCHAR(200) | 商品名 |
| unit | VARCHAR(50) | 単位 |
| category | VARCHAR(50) | カテゴリ |
| quantity | INTEGER | 数量 |
| price_per_unit | REAL | 単価 |
| total_price | REAL | 合計金額 |
| notes | TEXT | 備考 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

### 5. payments テーブル（支払い記録テーブル）
| フィールド名 | タイプ | 説明 |
|-------------|--------|------|
| id | INTEGER | 主キー、自動増分ID |
| order_id | INTEGER | 注文ID、外部キー |
| payment_method | VARCHAR(50) | 支払い方法 |
| payment_status | VARCHAR(20) | 支払いステータス、デフォルトPENDING |
| amount | REAL | 支払い金額 |
| transaction_id | VARCHAR(100) | 取引ID |
| payment_date | TIMESTAMP | 支払い日時 |
| receipt_url | VARCHAR(500) | 領収書URL |
| notes | TEXT | 備考 |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時 |

## 列挙値説明

### ユーザー役割 (role)
- **USER**: 一般ユーザー
- **ADMIN**: 管理者
- **MODERATOR**: モデレーター

### 優先度 (priority)
- **high**: 高
- **medium**: 中
- **low**: 低

### 商品カテゴリ (category)
- **医薬品**: 医薬品
- **衛生**: 衛生用品
- **食料**: 食料
- **生活用品**: 生活用品

### 状態フィールド
- **電力/ガス/水道状態**: 
  - AVAILABLE: 利用可能
  - UNAVAILABLE: 停止中
- **交通状態**: 
  - NORMAL: 問題なし
  - RESTRICTED: 一部規制あり
  - CLOSED: 通行止め

### 注文ステータス (order_status)
- **PENDING**: 処理待ち
- **CONFIRMED**: 確認済み
- **SHIPPED**: 発送済み
- **DELIVERED**: 配達完了
- **CANCELLED**: キャンセル

### 支払い方法 (payment_method)
- **CASH**: 現金
- **BANK_TRANSFER**: 銀行振込
- **CREDIT_CARD**: クレジットカード
- **DIGITAL_WALLET**: 電子マネー

### 支払いステータス (payment_status)
- **PENDING**: 支払い待ち
- **COMPLETED**: 完了
- **FAILED**: 支払い失敗
- **REFUNDED**: 返金済み
