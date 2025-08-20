# 🚀 チーム開発ガイド

## 📋 プロジェクト構成

これは**フロントエンド・バックエンド分離 + Dockerコンテナ化**のチーム開発プロジェクトです：

```
team2/
├── frontend/          # フロントエンドプロジェクト (React/Vue等)
├── backend/           # バックエンドプロジェクト (Spring Boot)
├── compose.yaml       # Docker Compose設定
└── README.md          # プロジェクト説明
```

## 🐳 Docker 使用説明

### なぜDockerを使うのか？

1. **環境の一貫性**：すべての開発者が同じ環境を使用
2. **高速起動**：プロジェクト全体をワンクリックで起動
3. **チーム協力**：新メンバーが複雑な環境設定を不要
4. **本番デプロイ**：サーバーに直接デプロイ可能

### 🚀 プロジェクト全体を起動

```bash
# すべてのサービスを起動（フロントエンド、バックエンド、データベース）
docker-compose up -d

# サービス状態を確認
docker-compose ps

# ログを表示
docker-compose logs -f

# すべてのサービスを停止
docker-compose down
```

### 🔧 個別にサービスを起動

```bash
# バックエンドのみ起動
docker-compose up backend

# フロントエンドのみ起動
docker-compose up frontend

# データベースのみ起動
docker-compose up database
```

## 💻 開発モード

### 方式1：Docker開発（チーム使用推奨）

```bash
# すべてのサービスを起動
docker-compose up -d

# サービスにアクセス
# フロントエンド: http://localhost:3000
# バックエンド: http://localhost:8080
# データベース: localhost:5432
```

### 方式2：ローカル開発（個人デバッグ）

```bash
# バックエンドを起動
cd backend
./gradlew bootRun

# フロントエンドを起動（別のターミナルで）
cd frontend
npm start
```

## 🗄️ データベース選択

### ローカル開発：SQLite
- ファイルデータベース、インストール不要
- 個人開発デバッグに適している
- `application.yml`で設定

### Docker環境：PostgreSQL
- リレーショナルデータベース、機能豊富
- チーム開発と本番環境に適している
- `application-docker.yml`で設定

## 👥 チーム協力フロー

### 1. 新メンバー加入
```bash
# プロジェクトをクローン
git clone <プロジェクトURL>
cd team2

# プロジェクトを起動（Dockerが自動的にすべての依存関係をダウンロード）
docker-compose up -d
```

### 2. 日常開発
```bash
# プロジェクトを起動
docker-compose up -d

# 開発完了後にコミット
git add .
git commit -m "feat: 新機能を追加"
git push
```

### 3. コード同期
```bash
# 最新コードを取得
git pull origin main

# Dockerイメージを再構築（依存関係に変更がある場合）
docker-compose build
docker-compose up -d
```

## 🔍 よくある問題

### Q: Docker起動に失敗した？
```bash
# ポート使用状況を確認
netstat -tlnp | grep :8080
netstat -tlnp | grep :3000

# Dockerリソースをクリーンアップ
docker-compose down -v
docker system prune
```

### Q: データベース接続に失敗した？
```bash
# データベースサービス状態を確認
docker-compose ps database

# データベースログを表示
docker-compose logs database
```

### Q: フロントエンドがバックエンドAPIにアクセスできない？
- バックエンドサービスが起動しているか確認
- APIアドレス設定が正しいか確認
- CORS設定を確認

## 📚 技術スタック

### バックエンド
- **Java 21** + **Spring Boot 3.5.4**
- **Spring Data JPA** + **Hibernate**
- **Spring Security**（設定を簡素化済み）
- **OpenAPI 3** (Swaggerドキュメント)

### フロントエンド
- **React/Vue** (実際の使用に応じて)
- **Node.js** + **npm/yarn**

### データベース
- **SQLite** (ローカル開発)
- **PostgreSQL** (Docker環境)

### コンテナ化
- **Docker** + **Docker Compose**

## 🎯 次のステップ

1. **プロジェクトを起動**：`docker-compose up -d`
2. **APIドキュメントにアクセス**：http://localhost:8080/swagger-ui.html
3. **開発開始**：要件に応じて新機能を追加
4. **チーム協力**：Gitを使用してコード管理

何か質問があれば、いつでも聞いてください！ 🚀
