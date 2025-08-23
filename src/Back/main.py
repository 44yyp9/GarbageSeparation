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

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running on Vercel"}

# 保存API
@app.post("/save")
async def save_result(data: dict = Body(...)):
    #未分類は保存しない
    if data.get("class_id")==-1:
        return {"message": "分類できませんでした", "data": data}

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

#各カテゴリが占める割合を計算して返すAPI
@app.get("/GetGarbagePercent")
async def get_garbage_percent():
    # データ読み込み
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        records = json.load(f)

    # class_idごとのカウント（0,1,2だけ対象）
    counts = {0: 0, 1: 0, 2: 0}
    total = 0

    for r in records:
        cid = r.get("class_id")
        if cid in counts:  # 分類できなかった(-1)などは無視
            counts[cid] += 1
            total += 1

    # パーセント計算（小数点1桁）
    if total > 0:
        percents = {cid: round((count / total) * 100, 1) for cid, count in counts.items()}
    else:
        percents = {cid: 0.0 for cid in counts}

    # 結果を返す（itemNameも含めてわかりやすく）
    result = {
        0: {"itemName": "段ボール", "percent": percents[0]},
        1: {"itemName": "アルミ缶", "percent": percents[1]},
        2: {"itemName": "ペットボトル", "percent": percents[2]},
        "total": total
    }
    return result