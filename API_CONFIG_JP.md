# 🌐 API設定説明

## 🔍 **問題の説明**

現在の設定では、フロントエンドコンテナがバックエンドAPIを正しく呼び出せません。理由は：
- フロントエンドコンテナ内の`localhost:8080`はコンテナ内部を指している
- ホストマシン（あなたのPC）の8080ポートを指していない

## 🔧 **解決方法**

### **方法1：host.docker.internalを使用（推奨）**

`compose.yaml`で既に設定済み：
```yaml
frontend:
  environment:
    - REACT_APP_API_URL=http://host.docker.internal:8080
  extra_hosts:
    - "host.docker.internal:host-gateway"
```

**`host.docker.internal`** はDockerの特殊ドメイン名で、ホストマシンを指します。

### **方法2：ホストマシンのIPアドレスを使用**

1. **IPアドレスを確認**
   ```bash
   # Linux/WSL
   ip addr show
   
   # Windows
   ipconfig
   ```

2. **compose.yamlを修正**
   ```yaml
   frontend:
     environment:
       - REACT_APP_API_URL=http://あなたのIP:8080
   ```

### **方法3：フロントエンドをDocker外で実行**

フロントエンドに問題がある場合、ホストマシンで実行できます：

```bash
# バックエンドとデータベースのみ起動
docker-compose up backend database

# フロントエンドをホストマシンで実行
cd frontend
npm install
npm start
```

## 📱 **異なる環境の設定**

### **ローカル開発（推奨）**
```bash
# バックエンドをDockerで
docker-compose up backend database

# フロントエンドをローカルで
cd frontend
npm start
```

### **完全Docker環境**
```bash
# 全サービスを起動
docker-compose up -d

# フロントエンドポート：3000
# フロントエンドAPIアドレス：http://host.docker.internal:8080
```

### **チーム協力**
```bash
# 各メンバーが自分のDocker環境を起動
docker-compose up -d

# フロントエンドが自動的に正しいバックエンドAPIに接続
```

## 🔍 **API接続のテスト**

### **バックエンドがアクセス可能かチェック**
```bash
# ホストマシンでテスト
curl http://localhost:8080/api/health

# Dockerコンテナ内でテスト
docker exec -it team2_frontend_1 curl http://host.docker.internal:8080/api/health
```

### **フロントエンド環境変数をチェック**
```bash
# フロントエンドコンテナの環境変数を確認
docker exec -it team2_frontend_1 env | grep REACT_APP_API_URL
```

## 🚀 **推奨設定**

**チーム開発には以下を推奨：**

1. **バックエンドとデータベース**：Dockerで実行
2. **フロントエンド**：ホストマシンで実行（コンテナ間通信の問題を回避）

```bash
# バックエンドサービスを起動
docker-compose up backend database

# フロントエンドを起動（新しいターミナル）
cd frontend
npm start
```

これでフロントエンドが直接`http://localhost:8080`にアクセスでき、問題はありません！

## 📋 **ポート設定**

- **フロントエンドポート**：3000
- **バックエンドポート**：8080
- **データベースポート**：5432

## ❓ **まだ問題がありますか？**

フロントエンドがまだAPIを呼び出せない場合、以下を確認してください：
1. バックエンドサービスが正常に動作しているか
2. ポート8080が使用されていないか
3. ファイアウォール設定
4. ネットワーク設定

**今すぐプロジェクトを再起動してみてください！** 🚀
