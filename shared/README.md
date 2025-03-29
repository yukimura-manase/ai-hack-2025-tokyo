# 共有型定義パッケージ

このパッケージは、フロントエンドとバックエンド間で共有される型定義を提供します。

## 使用方法

### ビルド

```bash
# shared ディレクトリで実行
pnpm build
```

### 開発モード（ウォッチモード）

```bash
# shared ディレクトリで実行
pnpm dev
```

## 型定義

このパッケージには以下の型定義が含まれています：

### ユーザー関連

- `User`: ユーザー情報の型定義
- `CreateUserInput`: ユーザー作成時の入力データの型定義
- `UpdateUserInput`: ユーザー更新時の入力データの型定義

### API 関連

- `ApiResponse<T>`: API レスポンスの共通型定義
- `PaginationInfo`: ページネーション情報の型定義
- `PaginatedResponse<T>`: ページネーション付きレスポンスの型定義

## 新しい型定義の追加方法

1. `src/types/` ディレクトリに新しい型定義ファイルを作成します
2. `src/index.ts` ファイルで新しい型定義をエクスポートします

## import 方法

例えば、`User` 型をインポートする場合は以下のようにします。

```ts
import { User } from "@chemical-data-search-ai-agent/shared";
```
