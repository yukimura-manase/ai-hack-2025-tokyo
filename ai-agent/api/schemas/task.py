from typing import Optional

from pydantic import BaseModel, Field


### 
# NOTE: TaskBase => すべての Task に共通する Class
# BaseModel はFastAPIのスキーマモデルであることを表すので、このクラスを継承して、クラスを作成
###
class TaskBase(BaseModel):
    title: Optional[str] = Field(None, example="クリーニングを取りに行く")

# Task の レスポンス => DBから取得する
class Task(TaskBase):
    id: int
    done: bool = Field(False, description="完了フラグ")

    # DBから取得する
    class Config:
      orm_mode = True


# Task の 新規作成・リクエスト
class TaskCreate(TaskBase):
    pass

# TaskCreate のレスポンス => TaskCreate に id を追加 (id は DB で自動採番)
class TaskCreateResponse(TaskCreate):
    id: int

    # orm_mode = True は、
    # このレスポンススキーマ TaskCreateResponse が、
    # 暗黙的に、ORM を受け取り、レスポンススキーマに変換することを意味します。
    class Config:
        orm_mode = True





