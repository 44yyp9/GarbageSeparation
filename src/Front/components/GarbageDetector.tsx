// frontend/src/components/GarbageDetector.tsx
import React, { useState } from "react";
import axios from "axios";

type Detection = {
  class_id: number;
  confidence: number;
  bbox: number[];
};

type PredictResponse = {
  detections: Detection[];
};


const GarbageDetector = () => {
  const [image, setImage] = useState<File | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);

    const res = await axios.post<PredictResponse>(
      "http://localhost:8000/predict",
      formData
    );

    setResults(res.data.detections);
  };

  return (
    <div>
      <h2>ゴミ分類AI</h2>
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>分類する</button>

      <ul>
        {results.map((r, i) => (
          <li key={i}>
            クラスID: {r.class_id}, 信頼度: {r.confidence}, 座標: {r.bbox.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GarbageDetector;