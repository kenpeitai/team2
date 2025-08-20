# 🚀 チーム環境構築ガイド

## 💻 サポートされているオペレーティングシステム

- ✅ **Windows 10/11** (Docker Desktop使用推奨)
- ✅ **WSL2** (Ubuntu/Debian)
- ✅ **macOS** (Docker Desktop)
- ✅ **Linux** (Docker Engine)

## 🐳 Docker環境要件

### Windowsユーザー
1. **Docker Desktop for Windowsをインストール**
   - ダウンロード：https://www.docker.com/products/docker-desktop
   - WSL2統合が有効になっていることを確認
   - Docker Desktopを起動

2. **インストール確認**
   ```cmd
   docker --version
   docker compose version
   ```

### WSL2ユーザー（推奨）
1. **Docker Engineをインストール**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **Docker Composeをインストール**
   ```bash
   sudo apt install docker-compose
   ```

## 🚀 プロジェクト起動

### 方式1：Docker起動（チーム使用推奨）
```bash
# すべてのサービスを起動（Docker Compose v2）
docker compose up

# サービス状態を確認
docker compose ps

# ログを表示
docker compose logs -f
```

### 方式2：ローカル開発
```bash
# バックエンド開発
cd backend
./gradlew bootRun

# フロントエンド開発（新しいターミナルで）
cd frontend
npm install
npm start
```

## 🔧 よくある問題の解決方法

### Windowsユーザーの問題
1. **ポートが使用中**
   ```cmd
   netstat -ano | findstr :8080
   taskkill /PID <プロセスID> /F
   ```

2. **Docker Desktopが起動していない**
   - システムトレイのDockerアイコンを確認
   - Docker Desktopを再起動

3. **WSL2統合の問題**
   - Docker Desktop設定でWSL2統合を有効化
   - Docker Desktopを再起動

### WSL2ユーザーの問題
1. **権限の問題**
   ```bash
   sudo chown -R $USER:$USER .
   ```

2. **Dockerサービスが起動していない**
   ```bash
   sudo service docker start
   ```

## 📱 アクセスアドレス

起動成功後、すべてのユーザーがアクセス可能：

- **フロントエンドアプリ**：http://localhost:3000
- **バックエンドAPI**：http://localhost:8080
- **APIドキュメント**：http://localhost:8080/swagger-ui.html
- **ヘルスチェック**：http://localhost:8080/api/health

## 🌟 チーム協力の利点

1. **環境の一貫性**：すべての開発者が同じDocker環境を使用
2. **高速起動**：新メンバー加入時にワンクリックでプロジェクト起動
3. **クロスプラットフォーム対応**：Windows、WSL、macOS、Linuxすべてサポート
4. **本番環境との一致**：開発環境と本番環境の設定が同じ

## 📋 チェックリスト

- [ ] Dockerがインストールされ、実行中
- [ ] Docker Composeがインストール済み
- [ ] プロジェクトコードがクローン済み
- [ ] ポート3000、8080、5432が使用されていない
- [ ] `docker compose up `が正常に実行された

## 🆘 問題が発生した場合？

1. Dockerサービスの状態を確認
2. コンテナログを確認：`docker compose logs`
3. Dockerサービスを再起動
4. チームの他のメンバーに連絡


---

## 🔑 ローカル開発の前提ソフトウェア（Backend/Frontend）

ローカルでバックエンドやフロントエンドを起動する場合、各自のマシンに以下が必要です。

- Java Development Kit (JDK) 21（バックエンド用）
- Node.js 20 LTS 以上（フロントエンド用）

Docker でのみ起動する場合は、各自のマシンに Java/Node は不要です（Docker Desktop/Engine は必要）。

### macOS（Homebrew）での JDK 21 インストール
```bash
brew install openjdk@21
echo 'export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"' >> ~/.zshrc
exec zsh
java -version
```

### Windows（Winget）での JDK 21 例
```powershell
winget install Oracle.JDK.21
java -version
```

### Linux（apt の例）
```bash
sudo apt update
sudo apt install -y openjdk-21-jdk
java -version
```

### Node.js（推奨: 20 LTS）
Node はフロントエンドのローカル開発に必要です。バージョン管理には nvm を推奨します。
```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install --lts=hydrogen # Node 20 LTS
nvm use --lts=hydrogen
node -v
```

---

## 🧭 ローカル開発の詳細手順

### バックエンド（SQLite・開発用）
`backend/src/main/resources/application.yml` を使用（デフォルトプロファイル）。
```bash
cd backend
./gradlew clean build
SPRING_PROFILES_ACTIVE=default ./gradlew bootRun
# ヘルス確認
curl http://localhost:8080/api/health
# APIドキュメント
# http://localhost:8080/swagger-ui.html
```

簡易API疎通テスト：
```bash
bash backend/test-api.sh
```

### バックエンド（PostgreSQL・Docker用）
`compose.yaml` で `SPRING_PROFILES_ACTIVE=docker` が設定されています。DB はコンテナの Postgres を使用します。
```bash
docker compose up -d database backend
open http://localhost:8080/swagger-ui.html
```

### フロントエンド
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

---

## 🧪 動作確認リンク

- バックエンドヘルス: http://localhost:8080/api/health
- システムヘルス: http://localhost:8080/api/health/system
- DBヘルス: http://localhost:8080/api/health/database
- Swagger UI: http://localhost:8080/swagger-ui.html

---

## ✅ オンボーディング・チェックリスト（新規参加者向け）

- [ ] リポジトリをクローンして最新化した
- [ ] Docker Desktop/Engine をインストール済み（Docker 起動方式の場合）
- [ ] JDK 21 をインストールし `java -version` が通る（ローカル起動方式の場合）
- [ ] Node.js 20 LTS をインストール（フロントエンドをローカル起動する場合）
- [ ] `docker compose up -d` でサービスが立ち上がる
- [ ] `http://localhost:8080/swagger-ui.html` にアクセスできる
- [ ] `http://localhost:3000` にアクセスできる
