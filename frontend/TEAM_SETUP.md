# チーム開発者向けセットアップガイド

このガイドは、プロジェクトに参加する開発者向けの初期セットアップ手順です。

## 🚀 クイックセットアップ

### 方法1: セットアップスクリプトを使用（推奨）

```bash
# プロジェクトディレクトリに移動
cd frontend

# セットアップスクリプトを実行
npm run setup
```

### 方法2: 手動セットアップ

```bash
# 1. 依存関係のインストール
npm ci

# 2. 環境変数ファイルの作成
cp .env.example .env.local

# 3. 環境変数の設定
# .env.localファイルを編集して、実際の値を設定
```

## 🔧 環境変数の設定

### 必須設定

1. **楽天市場APIアプリケーションID**
   - [楽天ウェブサービス](https://webservice.rakuten.co.jp/)でアカウント作成
   - アプリケーションIDを取得
   - `.env.local`の`NEXT_PUBLIC_RAKUTEN_APP_ID`を設定

```env
NEXT_PUBLIC_RAKUTEN_APP_ID=your_actual_rakuten_app_id
```

### オプション設定

```env
# APIベースURL（デフォルト: http://localhost:8080）
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# 開発環境設定
NODE_ENV=development
```

## 📋 セットアップチェックリスト

- [ ] 依存関係のインストール完了
- [ ] `.env.local`ファイルの作成
- [ ] 楽天市場APIアプリケーションIDの設定
- [ ] 開発サーバーの起動確認
- [ ] 楽天市場検索機能の動作確認

## 🧪 動作確認

```bash
# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:3000 にアクセス
# 避難所物資管理画面で楽天市場検索機能をテスト
```

## ❓ よくある問題

### Q: 環境変数が読み込まれない
A: `.env.local`ファイルが正しい場所にあるか確認し、アプリケーションを再起動してください。

### Q: 楽天市場APIでエラーが発生する
A: アプリケーションIDが正しく設定されているか、APIの利用制限に達していないか確認してください。

### Q: セットアップスクリプトが実行できない
A: `chmod +x setup.sh`で実行権限を付与してください。

## 📚 参考資料

- [楽天市場API設定ガイド](./RAKUTEN_API_SETUP.md)
- [Next.js環境変数ドキュメント](https://nextjs.org/docs/basic-features/environment-variables)
- [楽天ウェブサービス](https://webservice.rakuten.co.jp/)

## 🤝 チーム開発のベストプラクティス

1. **環境変数の共有**: 機密情報は`.env.local`に保存し、Gitにコミットしない
2. **テンプレートの活用**: `.env.example`を参考に環境変数を設定
3. **ドキュメントの更新**: 新しい環境変数を追加した場合は`.env.example`も更新
4. **セットアップ手順の共有**: 新しいメンバーにはこのガイドを共有

## 📞 サポート

問題が発生した場合は、以下を確認してください：

1. このガイドの内容
2. [RAKUTEN_API_SETUP.md](./RAKUTEN_API_SETUP.md)
3. チームメンバーへの相談
