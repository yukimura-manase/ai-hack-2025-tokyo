# AI Hack 2025 Tokyo Server

## 環境構築

```bash
pnpm install
pnpm run dev
```

```bash
open http://localhost:3777
```

## データベースの起動

```bash
docker compose up --build
```

## Prisma Migration

```bash
npx prisma migrate dev --name init
```
