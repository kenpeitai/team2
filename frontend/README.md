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

### メモ
- App Router では `app/layout.tsx` が自動で各 `page.tsx` に適用されます。各ページに `<Layout>` を書く必要はありません。
