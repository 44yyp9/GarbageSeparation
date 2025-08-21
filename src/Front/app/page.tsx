"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, Loader2, Recycle, X } from "lucide-react"

interface WasteResult {
  itemName: string
  category: string
  method: string
  details: string[]
  color: string
}

export default function WasteSortingApp() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<WasteResult | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const mockResults: WasteResult[] = [
    {
      itemName: "アルミ缶",
      category: "缶",
      method: "缶として分別",
      details: ["中身を空にしてください", "軽くすすいでください", "つぶさずにそのまま出してください"],
      color: "bg-gray-100 text-gray-800",
    },
    {
      itemName: "スチール缶",
      category: "缶",
      method: "缶として分別",
      details: ["中身を空にしてください", "軽くすすいでください", "ラベルは付けたままで大丈夫です"],
      color: "bg-gray-100 text-gray-800",
    },
    {
      itemName: "ガラス瓶",
      category: "びん",
      method: "びんとして分別",
      details: ["中身を空にしてください", "軽くすすいでください", "キャップは外してください"],
      color: "bg-green-100 text-green-800",
    },
    {
      itemName: "ペットボトル",
      category: "ペットボトル",
      method: "ペットボトルとして分別",
      details: ["キャップとラベルを外してください", "中身を空にして軽くすすいでください", "つぶしてから出してください"],
      color: "bg-blue-100 text-blue-800",
    },
    {
      itemName: "プラスチック容器",
      category: "その他",
      method: "その他として分別",
      details: ["汚れを落としてください", "分別が難しい場合は燃えるごみへ", "リサイクルマークを確認してください"],
      color: "bg-orange-100 text-orange-800",
    },
    {
      itemName: "紙パック",
      category: "その他",
      method: "その他として分別",
      details: ["中身を空にしてください", "軽くすすいでください", "開いて乾かしてから出してください"],
      color: "bg-orange-100 text-orange-800",
    },
  ]

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setStream(mediaStream)
      setIsCameraActive(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("カメラアクセスエラー:", error)
      alert("カメラにアクセスできませんでした。ファイル選択をご利用ください。")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      if (context) {
        context.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg")
        setSelectedImage(imageData)
        stopCamera()
        analyzeImage()
      }
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        analyzeImage()
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = () => {
    setIsAnalyzing(true)
    setResult(null)

    setTimeout(() => {
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setResult(randomResult)
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleCameraClick = () => {
    startCamera()
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const resetApp = () => {
    setSelectedImage(null)
    setResult(null)
    setIsAnalyzing(false)
    stopCamera()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Recycle className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">横浜市ごみ分別アプリ</h1>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            身近なごみを撮影するだけで、横浜市の正しい分別方法がすぐにわかります
          </p>
          <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
            ※ これはモックアップです。実際のAI解析は行いません
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">ごみの写真を撮影してください</CardTitle>
            <CardDescription>カメラで撮影するか、ギャラリーから画像を選択してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCameraActive && (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover rounded-lg border bg-black"
                  />
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={capturePhoto} className="w-full h-12 bg-green-600 hover:bg-green-700" size="lg">
                  <Camera className="mr-2 h-5 w-5" />
                  撮影する
                </Button>
              </div>
            )}

            {!selectedImage && !isAnalyzing && !result && !isCameraActive && (
              <div className="space-y-3">
                <Button onClick={handleCameraClick} className="w-full h-12 bg-green-600 hover:bg-green-700" size="lg">
                  <Camera className="mr-2 h-5 w-5" />
                  カメラで撮影
                </Button>
                <Button onClick={handleUploadClick} variant="outline" className="w-full h-12 bg-transparent" size="lg">
                  <Upload className="mr-2 h-5 w-5" />
                  ギャラリーから選択
                </Button>
              </div>
            )}

            {selectedImage && (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="選択された画像"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-8 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
                <p className="text-gray-600">画像を解析しています...</p>
                <p className="text-sm text-gray-500">（モックアップ解析中）</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">判定結果</h3>
                  <Badge className={`text-sm px-3 py-1 ${result.color}`}>{result.itemName}</Badge>
                </div>

                <Card className="bg-gray-50">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">分別区分</h4>
                        <p className="text-green-700 font-medium">{result.category}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">出し方</h4>
                        <p className="text-gray-700">{result.method}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">注意事項</h4>
                        <ul className="space-y-1">
                          {result.details.map((detail, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="text-green-600 mr-2">•</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={resetApp} variant="outline" className="w-full bg-transparent">
                  もう一度撮影する
                </Button>
              </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <canvas ref={canvasRef} className="hidden" />
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>横浜市の分別ルールに基づいています</p>
          <p>詳細は横浜市公式サイトをご確認ください</p>
        </div>
      </div>
    </div>
  )
}
