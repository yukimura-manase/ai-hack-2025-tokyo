from sqlalchemy import create_engine

from api.models.task import Base

DB_URL = "mysql+pymysql://root@db:3306/demo?charset=utf8"

# Migration は、同期処理でいいので、同期的な engine を作成する
engine = create_engine(DB_URL, echo=True)


def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    reset_database()