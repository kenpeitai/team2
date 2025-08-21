# 楽天市場API設定ガイド

このプロジェクトでは、楽天市場APIを使用して商品の最安値を検索する機能を提供しています。

## 1. 楽天市場APIアプリケーションIDの取得

1. [楽天ウェブサービス](https://webservice.rakuten.co.jp/)にアクセス
2. アカウントを作成またはログイン
3. 「アプリケーションID」を取得
4. 「商品価格ナビ商品検索API」の利用規約に同意

## 2. 環境変数の設定

プロジェクトのルートディレクトリ（`frontend/`）に`.env.local`ファイルを作成し、以下の内容を追加してください：

```env
# 楽天市場API設定
NEXT_PUBLIC_RAKUTEN_APP_ID=your_rakuten_application_id_here

# 既存のAPI設定
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

**重要**: `your_rakuten_application_id_here`を実際のアプリケーションIDに置き換えてください。

## 3. 機能の使用方法

### 避難所物資管理画面での使用

1. 避難所の物資管理画面（`/shelter/[id]/supplies`）にアクセス
2. 各物資カードの下部にある「楽天市場で価格比較」セクションを展開
3. 商品名や型番を入力して検索
4. 最安値商品を選択すると、備考欄に価格情報が自動追加されます

### 検索機能

- **最安値1件**: 指定したキーワードで最安値の商品1件を取得
- **複数件表示**: 最大10件の商品を価格順で表示

### 表示される情報

- 商品名
- 価格
- 商品画像
- ショップ名
- レビュー評価（利用可能な場合）
- レビュー数（利用可能な場合）

## 4. 注意事項

- APIの利用制限にご注意ください（1日あたりのリクエスト数制限があります）
- 検索結果は楽天市場の在庫状況により変動する場合があります
- 画像の表示は楽天市場の仕様に依存します

## 5. トラブルシューティング

### 環境変数が読み込まれない場合

1. `.env.local`ファイルが正しい場所にあることを確認
2. ファイル名が正確であることを確認（`.env.local`）
3. アプリケーションを再起動

### APIエラーが発生する場合

1. アプリケーションIDが正しく設定されているか確認
2. 楽天市場APIの利用規約に同意しているか確認
3. 1日のリクエスト制限に達していないか確認

### 検索結果が表示されない場合

1. キーワードをより具体的に変更（例：「アセトアミノフェン 500mg」）
2. 商品名や型番を正確に入力
3. 在庫のある商品のみが表示されるため、キーワードを調整

## 6. 開発者向け情報

### API関数

- `getCheapestItemByKeyword(keyword: string)`: 最安値1件を取得
- `getItemsByKeyword(keyword: string, limit: number)`: 複数件を取得

### コンポーネント

- `RakutenSearchSection`: 検索機能を提供するコンポーネント
- `RakutenItemCard`: 商品情報を表示するカードコンポーネント

### 型定義

```typescript
interface RakutenItem {
  name: string;
  price: number;
  url: string;
  image?: string;
  shop: string;
  rating?: number;
  reviews?: number;
}
```
