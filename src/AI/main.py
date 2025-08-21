# backend/main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import shutil
import uuid

app = FastAPI()

# CORS設定（Reactと通信可能にする）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番では限定する
    allow_methods=["*"],
    allow_headers=["*"],
)

# モデル読み込み
model = YOLO("3garbage_best.pt")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # 一時ファイルとして保存
    temp_path = f"temp/{uuid.uuid4()}.jpg"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 推論実行
    results = model(temp_path)

    # 結果を整形して返す
    detections = []
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            xyxy = box.xyxy[0].tolist()
            detections.append({
                "class_id": cls_id,
                "confidence": round(conf, 3),
                "bbox": [round(x, 2) for x in xyxy]
            })

    return {"detections": detections}