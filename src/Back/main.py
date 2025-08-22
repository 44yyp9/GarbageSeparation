from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import json, os, datetime

app = FastAPI()

# CORS設定（フロントと通信可能にする）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 保存用ファイル
DATA_FILE = "data.json"
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump([], f)

# 保存API
@app.post("/save")
async def save_result(data: dict = Body(...)):
    # タイムスタンプ追加
    data["detected_at"] = datetime.datetime.now().isoformat()

    # 既存データ読み込み
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        records = json.load(f)

    # ID採番
    data["id"] = len(records) + 1

    # データ追加
    records.append(data)

    # 保存
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    return {"message": "保存しました", "data": data}