# Team2

## 前提条件（Docker 利用が最速）

- Docker Desktop（macOS/Windows）または Docker Engine（Linux）
- Docker Compose v2（`docker compose ...` コマンドが使える状態）
- 参考: ローカル起動したい人のみ JDK 21 / Node 20 LTS が必要（下記参照）

## はじめに（Quick Start）

### 方式A：Dockerで一括起動（推奨）
```bash
git clone https://github.com/AE-2-Summer-Short-Internship-2025/team2.git
cd team2
docker compose up
# Swagger UI
open http://localhost:8080/swagger-ui.html
# フロントエンド
open http://localhost:3000
```

### 方式B：ローカルで起動（Backend/Frontend）
前提: JDK 21（バックエンド）/ Node 20 LTS（フロントエンド）
```bash
# Backend
cd backend
./gradlew clean build
SPRING_PROFILES_ACTIVE=default ./gradlew bootRun

# 別ターミナルで Frontend
cd frontend
npm install
npm run dev
```

詳細なセットアップやトラブルシュートは `TEAM_SETUP.md` を参照してください。

### よく使うコマンド（Docker）
```bash
# すべて停止
docker compose down

# ログを見る
docker compose logs -f backend
docker compose logs -f frontend

# ESLint（ホストに Node 不要）
docker compose run --rm frontend npm run lint

# ESLint 自動修正
docker compose run --rm frontend npx eslint . --ext .ts,.tsx --fix
```

## ディレクトリ構成（概要）
```
team2/
├─ backend/          # Spring Boot API（SQLite/PostgreSQL対応）
├─ frontend/         # Next.js 15 + React 19 UI
├─ compose.yaml      # Front/Back/DB の Docker Compose
├─ TEAM_SETUP.md     # チーム向けセットアップ手順
└─ README.md         # このファイル
```

## 開発フロー（提案）
- **ブランチ**: `main` は常にデプロイ可能。作業は `feature/*` `fix/*` で PR を作成
- **コミット**: COMMIT_PREFIX 方式を採用（例: `feat: #1 ユーザー登録機能を追加`）
- **COMMIT_PREFIX**: 主な種類
    - feat: 機能追加
    - fix: 不具合修正
    - docs: ドキュメントのみの変更
    - refactor: 仕様変更なしのリファクタ
    - perf: 性能改善
    - test: テスト追加・修正
    - build: ビルド/依存関係の変更
    - ci: CI 設定の変更
    - style: 形式のみ（フォーマット等）
    - chore: 雑多作業（上記に当てはまらない運用系）
    - revert: 取り消し
- **規約**: Linter/Formatter を導入予定（ESLint/Prettier, Ruff/Black など）
- **推奨拡張機能**:
  - `dbaeumer.vscode-eslint`
  - `esbenp.prettier-vscode`
  - `sonarsource.sonarlint-vscode`
  - `eamodio.gitlens`
  - `github.copilot`
  - `github.copilot-chat`
## ドキュメント
- [**gitの使い方**](./git.md)
 - [**チームセットアップ**](./TEAM_SETUP.md)

## トラブルシュート（超要点）

- ポート衝突（8080/3000/5432）
  - 使っているプロセスを終了 or `docker compose down` で停止
- バックエンドが起動しない
  - `docker compose logs -f backend` を確認
- DB が不安定
  - `docker compose down -v` でボリューム初期化（データ消えるので注意）。

## 必要ソフト（ローカル開発する場合）

- JDK 21（バックエンド用）
  - macOS（Homebrew）:
    ```bash
    brew install openjdk@21
    echo 'export PATH="/opt/homebrew/opt/openjdk@21/bin:$PATH"' >> ~/.zshrc
    echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home"' >> ~/.zshrc
    exec zsh && java -version
    ```
- Node.js 20 LTS（フロントエンド用）
  - nvm 推奨:
    ```bash
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm install --lts=hydrogen && nvm use --lts=hydrogen
    node -v
    ```

## よく使うURL

- Backend Health: `http://localhost:8080/api/health`
- System Health: `http://localhost:8080/api/health/system`
- DB Health: `http://localhost:8080/api/health/database`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Frontend: `http://localhost:3000`

