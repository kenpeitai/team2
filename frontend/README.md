## フロントエンド (Next.js)

このディレクトリは Next.js (App Router) のフロントエンドです。

### 前提
- Node.js 18 以上を推奨
- パッケージマネージャ: npm（`package-lock.json` あり）

### セットアップ
```bash
# 依存関係のインストール（初回 or lockfile 変更時）
npm ci
# lockfile を更新したい場合は npm install でも可
# npm install

# 環境変数の設定
cp .env.example .env.local
# .env.localファイルを編集して、実際の値を設定してください
```

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

### 環境変数の設定

このプロジェクトでは楽天市場APIを使用しています。以下の手順で環境変数を設定してください：

1. `.env.example`ファイルを`.env.local`にコピー
2. `.env.local`ファイルを編集して、実際の値を設定
3. 楽天市場APIのアプリケーションIDを取得して設定

詳細は `RAKUTEN_API_SETUP.md` を参照してください。

### メモ
- App Router では `app/layout.tsx` が自動で各 `page.tsx` に適用されます。各ページに `<Layout>` を書く必要はありません。
