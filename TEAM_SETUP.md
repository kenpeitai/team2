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
   docker-compose --version
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
# すべてのサービスを起動
docker-compose up -d

# サービス状態を確認
docker-compose ps

# ログを表示
docker-compose logs -f
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
- [ ] `docker-compose up -d`が正常に実行された

## 🆘 問題が発生した場合？

1. Dockerサービスの状態を確認
2. コンテナログを確認：`docker-compose logs`
3. Dockerサービスを再起動
4. チームの他のメンバーに連絡

**チーム開発が順調に進むことを願っています！** 🚀
