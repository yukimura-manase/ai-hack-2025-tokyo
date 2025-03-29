from fastapi import FastAPI

from api.routers import task, done

# FastAPIのインスタンス => uvicornを通してこのファイルの app インスタンスが参照
app = FastAPI()

app.include_router(task.router)
app.include_router(done.router)