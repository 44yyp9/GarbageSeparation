"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, Loader2, Recycle, X, BoxIcon as Bottle, Package } from "lucide-react"

interface WasteResult {
  itemName: string
  category: string
  method: string
  details: string[]
  color: string
  icon: React.ReactNode
  image: string
  steps: string[]
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
      category: "カン", // カテゴリ名を「缶」から「カン」に変更
      method: "カンとして分別",
      details: ["中身を空にしてください", "軽くすすいでください", "つぶさずにそのまま出してください"],
      color: "bg-slate-100 text-slate-800 border-slate-200",
      icon: <Package className="h-6 w-6 text-slate-600" />,
      image: "/steel-can.png",
      steps: ["1. 中身を完全に空にする", "2. 軽く水ですすぐ", "3. つぶさずにカンの日に出す"],
    },
    {
      itemName: "ガラス瓶",
      category: "ガラス瓶", // カテゴリ名を「びん」から「ガラス瓶」に変更
      method: "ガラス瓶として分別",
      details: ["中身を空にしてください", "軽くすすいでください", "キャップは外してください"],
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      icon: <Bottle className="h-6 w-6 text-emerald-600" />,
      image: "/glass-bottle.png",
      steps: ["1. 中身を完全に空にする", "2. キャップを外す", "3. 軽く水ですすいでガラス瓶の日に出す"],
    },
    {
      itemName: "ペットボトル",
      category: "ペットボトル",
      method: "ペットボトルとして分別",
      details: ["キャップとラベルを外してください", "中身を空にして軽くすすいでください", "つぶしてから出してください"],
      color: "bg-cyan-100 text-cyan-800 border-cyan-200",
      icon: <Bottle className="h-6 w-6 text-cyan-600" />,
      image: "/plastic-bottle.png",
      steps: ["1. キャップとラベルを外す", "2. 中身を空にして軽くすすぐ", "3. つぶしてペットボトルの日に出す"],
    },
    {
      itemName: "ダンボール箱",
      category: "ダンボール",
      method: "ダンボールとして分別",
      details: [
        "テープやシールを剥がしてください",
        "汚れがひどい場合は燃えるごみへ",
        "折りたたんでひもで縛ってください",
      ],
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: <Package className="h-6 w-6 text-orange-600" />,
      image: "/paper-carton.png",
      steps: ["1. テープやシールを完全に剥がす", "2. 折りたたんで束ねる", "3. ひもで縛ってダンボールの日に出す"],
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
      setIsCameraActive(false)
      setStream(null)

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          alert("カメラの使用が許可されていません。ブラウザの設定でカメラアクセスを許可してから再試行してください。")
        } else if (error.name === "NotFoundError") {
          alert("カメラが見つかりませんでした。ファイル選択をご利用ください。")
        } else {
          alert("カメラにアクセスできませんでした。ファイル選択をご利用ください。")
        }
      }
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
    }, 3000)
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
    <div className="min-h-screen bg-gradient-to-br from-card via-muted to-secondary/10 p-4">
      <div className="max-w-md mx-auto lg:max-w-6xl space-y-6">
        <div className="text-center space-y-4 animate-slide-up lg:mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-full animate-pulse-glow">
              <Recycle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">横浜市ごみ分別アプリ</h1>
              <p className="text-sm lg:text-base text-muted-foreground">AI判定システム</p>
            </div>
          </div>
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50 lg:max-w-2xl lg:mx-auto">
            <p className="text-foreground text-sm lg:text-base leading-relaxed mb-2">
              身近なごみを撮影するだけで、横浜市の正しい分別方法がすぐにわかります
            </p>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              ※ これはモックアップです
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* カメラ・撮影部分 */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm animate-slide-up">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl lg:text-2xl text-card-foreground">ごみの写真を撮影してください</CardTitle>
                <CardDescription className="text-muted-foreground lg:text-base">
                  カメラで撮影するか、ギャラリーから画像を選択してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isCameraActive && (
                  <div className="space-y-4 animate-bounce-in">
                    <div className="relative overflow-hidden rounded-xl">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 lg:h-80 object-cover bg-black"
                      />
                      <div className="absolute inset-0 border-2 border-primary/30 rounded-xl pointer-events-none"></div>
                      <Button
                        onClick={stopCamera}
                        variant="outline"
                        size="sm"
                        className="absolute top-3 right-3 bg-background/90 hover:bg-background border-border/50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={capturePhoto}
                      className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      size="lg"
                    >
                      <Camera className="mr-3 h-6 w-6" />
                      撮影する
                    </Button>
                    <Button
                      onClick={startCamera}
                      variant="outline"
                      className="w-full bg-background/50 border-border/50 hover:bg-background/80"
                      size="sm"
                    >
                      カメラを再試行
                    </Button>
                  </div>
                )}

                {!selectedImage && !isAnalyzing && !result && !isCameraActive && (
                  <div className="space-y-4 animate-bounce-in">
                    <Button
                      onClick={handleCameraClick}
                      className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      size="lg"
                    >
                      <Camera className="mr-3 h-6 w-6" />
                      カメラで撮影
                    </Button>
                    <Button
                      onClick={handleUploadClick}
                      variant="outline"
                      className="w-full h-14 bg-background/50 border-border/50 hover:bg-background/80 font-semibold rounded-xl transition-all duration-200"
                      size="lg"
                    >
                      <Upload className="mr-3 h-6 w-6" />
                      ギャラリーから選択
                    </Button>
                  </div>
                )}

                {selectedImage && (
                  <div className="space-y-4 animate-bounce-in">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="選択された画像"
                        className="w-full h-48 lg:h-64 object-cover"
                      />
                      <div className="absolute inset-0 border-2 border-primary/30 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                )}

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>
          </div>

          {/* 解析結果・結果表示部分 */}
          <div className="space-y-6">
            {isAnalyzing && (
              <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm animate-bounce-in">
                <CardContent className="text-center py-12 space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse-glow">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg lg:text-xl font-semibold text-foreground">AI解析中...</p>
                    <p className="text-sm lg:text-base text-muted-foreground">画像からごみの種類を判定しています</p>
                    <div className="w-32 h-1 bg-muted rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result && (
              <div className="space-y-6 animate-bounce-in">
                <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center gap-3 p-4 bg-primary/10 rounded-2xl">
                        {result.icon}
                        <div>
                          <h3 className="text-xl lg:text-2xl font-bold text-foreground">判定結果</h3>
                          <Badge className={`text-sm lg:text-base px-4 py-2 font-semibold ${result.color} shadow-sm`}>
                            {result.itemName}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center animate-slide-up mt-6">
                      <div className="relative">
                        <img
                          src={result.image || "/placeholder.svg"}
                          alt={result.itemName}
                          className="w-32 h-32 lg:w-40 lg:h-40 object-cover rounded-2xl shadow-lg border-4 border-background"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src =
                              "/placeholder.svg?height=160&width=160&query=" + encodeURIComponent(result.itemName)
                          }}
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-primary-foreground text-sm font-bold">✓</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-card to-muted/50 border-border/50 shadow-lg animate-slide-up">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h4 className="text-lg lg:text-xl font-bold text-foreground mb-2">分別区分</h4>
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full">
                          {result.icon}
                          <span className="text-primary font-bold text-lg lg:text-xl">{result.category}</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <h4 className="font-semibold text-foreground mb-2">出し方</h4>
                        <p className="text-muted-foreground lg:text-base bg-background/50 px-4 py-2 rounded-lg">
                          {result.method}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50 shadow-lg animate-slide-up">
                  <CardContent className="pt-6">
                    <h4 className="font-bold text-foreground lg:text-lg mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        !
                      </span>
                      出し方の手順
                    </h4>
                    <div className="space-y-3">
                      {result.steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 bg-background/50 rounded-lg animate-slide-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-primary text-sm font-bold">{index + 1}</span>
                          </div>
                          <p className="text-foreground text-sm lg:text-base leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={resetApp}
                  variant="outline"
                  className="w-full h-12 bg-background/50 border-border/50 hover:bg-background/80 font-semibold rounded-xl transition-all duration-200"
                >
                  もう一度撮影する
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-xs lg:text-sm text-muted-foreground space-y-2 animate-slide-up bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border/30 lg:max-w-2xl lg:mx-auto">
          <p className="font-medium">横浜市の分別ルールに基づいています</p>
          <p>詳細は横浜市公式サイトをご確認ください</p>
        </div>
      </div>
    </div>
  )
}
