## フロントエンド (Next.js)

このディレクトリは Next.js (App Router) のフロントエンドです。

### 前提
- Node.js 18 以上を推奨
- パッケージマネージャ: npm（`package-lock.json` あり）

### セットアップ

#### 推奨手順（新規メンバー向け）

```bash
# 1. フロントエンドディレクトリに移動
cd frontend

# 2. 依存関係のインストール
npm ci

# 3. 環境変数ファイルの作成
touch .env.local

# 4. .env.localファイルを編集して環境変数を設定
# エディタで.env.localファイルを開いて以下の内容を追加してください
```

#### 環境変数の設定

`.env.local`ファイルに以下の内容を追加してください：

```env
# 楽天市場API設定
NEXT_PUBLIC_RAKUTEN_APP_ID=your_rakuten_application_id_here

# APIベースURL（デフォルト: http://localhost:8080）
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# 開発環境設定
NODE_ENV=development
```

**重要**: `your_rakuten_application_id_here`を実際の楽天市場APIアプリケーションIDに置き換えてください。

#### 楽天市場APIアプリケーションIDの取得手順

1. [楽天ウェブサービス](https://webservice.rakuten.co.jp/)にアクセス
2. アカウントを作成またはログイン
3. 「アプリケーションID」を取得
4. 「商品価格ナビ商品検索API」の利用規約に同意
5. 取得したアプリケーションIDを`NEXT_PUBLIC_RAKUTEN_APP_ID`に設定

詳細は `RAKUTEN_API_SETUP.md` を参照してください。

### 開発サーバの起動
```bash
npm run dev
```
ブラウザで `http://localhost:3000` を開きます。

### 本番ビルド/起動
```bash
npm run build
npm start
```

### Lint
```bash
npm run lint
```

### ディレクトリ/主要ファイル
- `src/app/layout.tsx`: 全ページ共通のレイアウト。左上に固定アイコンを表示します。
- `src/app/page.tsx`: トップページ。
- `src/app/register/page.tsx`: 登録ページ。
- `public/`: 静的ファイル配置場所（例: `rakuten-logo.png`）。

### 共通アイコンについて
- 画像は `public/rakuten-logo.png` を参照しています（`layout.tsx`）。
- サイズは `layout.tsx` 内の `width`/`height` で調整できます。
- 画像を差し替える場合は同名で置換、または `src` のパスを変更してください。

### 注意事項

- `.env.local`ファイルはGitにコミットしないでください（機密情報を含むため）
- 楽天市場APIの利用制限にご注意ください
- アプリケーションIDは必ず実際の値に置き換えてください

### メモ
- App Router では `app/layout.tsx` が自動で各 `page.tsx` に適用されます。各ページに `<Layout>` を書く必要はありません。
