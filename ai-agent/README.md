# AI Hack 2025 Tokyo AI Agent

## 環境構築方法(初期 setup)

- 手順 1〜5 までが、初期セットアップの方法

### 1. Docker Image を作成する

```bash
# Docker Image を作成する
docker-compose build
```

---

### 2. poetry による Python 環境のセットアップ

- poetry は、Python のパッケージマネージャーです。

  - 参考情報: [pip を使い慣れた人に向けた poetry 入門](https://qiita.com/yamadax/items/fa07028a534de1f13a6e)

- poetry では pip が行わないパッケージ同士の依存関係の解決や、lock ファイルを利用したバージョン固定、Python の仮想環境管理など、より高機能でモダンなバージョン管理が行えます。

- 初回のプロジェクトでは、`poetry`において依存関係を管理する`pyproject.toml`が存在しません。

  - poetry を使って FastAPI をインストールし、`pyproject.toml`を作成していきましょう。

初回は、次のコマンドを実行して、`pyproject.toml`を作成します。

#### [ コマンド内容説明 ]

- Docker コンテナ（demo-app）の中で、`poetry init`コマンドを実行しています。

- 引数として、`fastapi`と、ASGI サーバーである`uvicorn`をインストールする依存パッケージとして指定しています。

```bash
docker-compose run \
  --entrypoint "poetry init \
    --name demo-app \
    --dependency fastapi \
    --dependency uvicorn[standard]" \
  demo-app
```

上記コマンドを実行すると、次のようにインタラクティブに質問が投げられます。

- Author のパートのみ`n`または著者名の入力が必要ですが、それ以外はすべて Enter で進めていけば問題ありません。

```bash
This command will guide you through creating your pyproject.toml config.

Version [0.1.0]:
Description []:
Author [None, n to skip]:  Robotama
License []:
Compatible Python versions [^3.9]:

Using version ^0.103.2 for fastapi
Using version ^0.23.2 for uvicorn
Would you like to define your main dependencies interactively? (yes/no) [yes]
You can specify a package in the following forms:
  - A single name (requests): this will search for matches on PyPI
  - A name and a constraint (requests@^2.23.0)
  - A git url (git+https://github.com/python-poetry/poetry.git)
  - A git url with a revision (git+https://github.com/python-poetry/poetry.git#develop)
  - A file path (../my-package/my-package.whl)
  - A directory (../my-package/)
  - A url (https://example.com/packages/my-package-0.1.0.tar.gz)

Package to add or search for (leave blank to skip):

Would you like to define your development dependencies interactively? (yes/no) [yes]
Package to add or search for (leave blank to skip):

Generated file

[tool.poetry]
name = "demo-app"
version = "0.1.0"
description = ""
authors = ["Robotama"]
readme = "README.md"

[tool.poetry.dependencies]
python = "^3.9"
fastapi = "^0.103.2"
uvicorn = {extras = ["standard"], version = "^0.23.2"}


[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"


Do you confirm generation? (yes/no) [yes]
```

---

### 3. FastAPI などパッケージのインストール

次のコマンドで、依存パッケージのインストールを行います。

```bash
# 依存パッケージのインストールを実行する
docker-compose run --entrypoint "poetry install --no-root" demo-app
```

コマンドの実行結果は、次のとおり。

```bash
FastAPI_template % docker-compose run --entrypoint "poetry install --no-root" demo-app
The virtual environment found in /src/.venv seems to be broken.
Recreating virtualenv demo-app in /src/.venv
Updating dependencies
Resolving dependencies... (1.9s)

Package operations: 19 installs, 0 updates, 0 removals

  • Installing exceptiongroup (1.1.3)
  • Installing idna (3.4)
  • Installing sniffio (1.3.0)
  • Installing typing-extensions (4.8.0)
  • Installing annotated-types (0.6.0)
  • Installing anyio (3.7.1)
  • Installing pydantic-core (2.10.1)
  • Installing click (8.1.7)
  • Installing h11 (0.14.0)
  • Installing httptools (0.6.0)
  • Installing pydantic (2.4.2)
  • Installing python-dotenv (1.0.0)
  • Installing pyyaml (6.0.1)
  • Installing starlette (0.27.0)
  • Installing uvloop (0.17.0)
  • Installing watchfiles (0.20.0)
  • Installing websockets (11.0.3)
  • Installing fastapi (0.103.2)
  • Installing uvicorn (0.23.2)

Writing lock file

```

上記のインストールが完了した際に、プロジェクトディレクトリ直下に`poetry.lock`ファイルが作成されていることを確認します。

2 と 3 のコマンド実行により、`pyproject.toml`と`poetry.lock`ファイルが準備できました。

---

### 4. FastAPI のコンテナを立ち上げる

```bash
docker-compose up
```

---

### 5. DB・Migration (Table・Column 作成)

```bash
# api モジュールの migrate_db スクリプトを実行する
docker-compose exec demo-app poetry run python -m api.migrate_db
```

---

## MySQL に接続する

```bash
docker-compose exec db mysql demo
```

## Swagger API Doc

- FastAPI と Swagger UI は、インテグレーション(統合)済みなので、エンドポイントを増やせば、勝手に Swagger も増えます。

- なので、FastAPI は、スキーマ駆動開発を実践しやすいフレームワークだと言えます。

- Swagger UI(REST API Doc) の Link

http://localhost:8000/docs

## ディレクトリ構造

- `__init__.py`は、python モジュールであることを表す空ファイル

- スキーマ（Schemas）には、API のリクエストとレスポンスを、厳密な型と一緒に定義していきます。

```bash
FastAPI_template % tree -L 2
.
├── Dockerfile
├── README.md
├── api
│   ├── __init__.py
│   ├── __pycache__
│   ├── cruds # DB に対する、CRUD 操作を行う処理を管理する
│   ├── main.py
│   ├── models # DB から取得する Table・Data の Model を管理する
│   ├── routers # ルーティング設定・ルーティング処理を管理する
│   └── schemas # [F-E]と[B-E]の間のリクエスト・レスポンスの型・スキーマ定義を管理する
├── docker-compose.yml
├── poetry.lock
└── pyproject.toml
```

## システム構成

- FastAPI: BackEnd-API

- MySQL: DB

## 使用ライブラリ

- `pyproject.toml`ファイル(Node で言うところの`package.json`)を確認してください。

## ライブラリの追加方法

- `package-name`の箇所を追加したいライブラリ名に変更して、実行する。

```bash
docker-compose exec demo-app poetry add package-name
```

## 【参考・引用】

1. [FastAPI 入門](https://zenn.dev/sh0nk/books/537bb028709ab9)

2. [pip を使い慣れた人に向けた poetry 入門](https://qiita.com/yamadax/items/fa07028a534de1f13a6e)
