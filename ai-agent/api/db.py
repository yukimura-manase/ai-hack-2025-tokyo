from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# 定義したMySQLのdockerコンテナに対して接続するセッションを作成する
ASYNC_DB_URL = "mysql+aiomysql://root@db:3306/demo?charset=utf8"

# async/await による非同期処理
async_engine = create_async_engine(ASYNC_DB_URL, echo=True)
async_session = sessionmaker(
    autocommit=False, autoflush=False, bind=async_engine, class_=AsyncSession
)

Base = declarative_base()


# このセッションを取得し、DBへのアクセスを可能にする
async def get_db():
    async with async_session() as session:
        yield session