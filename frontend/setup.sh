#!/bin/bash

echo "🚀 プロジェクトの初期セットアップを開始します..."

# 依存関係のインストール
echo "📦 依存関係をインストールしています..."
npm ci

# 環境変数ファイルの設定
if [ ! -f .env.local ]; then
    echo "🔧 環境変数ファイルを作成しています..."
    cp .env.example .env.local
    echo "✅ .env.localファイルが作成されました"
    echo "⚠️  必ず.env.localファイルを編集して、実際の値を設定してください"
    echo "📖 詳細は RAKUTEN_API_SETUP.md を参照してください"
else
    echo "✅ .env.localファイルは既に存在します"
fi

echo ""
echo "🎉 セットアップが完了しました！"
echo ""
echo "次のステップ："
echo "1. .env.localファイルを編集して環境変数を設定"
echo "2. npm run dev で開発サーバーを起動"
echo "3. http://localhost:3000 でアプリケーションにアクセス"
echo ""
echo "楽天市場APIの設定が必要な場合は、RAKUTEN_API_SETUP.mdを参照してください"
