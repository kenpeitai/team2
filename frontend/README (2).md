# Team2

## はじめに（Quick Start）
1. リポジトリを取得
   ```bash
   git clone https://github.com/AE-2-Summer-Short-Internship-2025/team2.git
   cd team2
   ```
2. 依存関係のセットアップ（後で具体化）
   
3. 実行/開発サーバ起動（後で追記）

## ディレクトリ構成（暫定）
```
team2/
├─ README.md
└─ （今後追加）
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

