// "use client" はNext.jsの特別な指示です。
// これを書くことで、ユーザーの操作（クリックなど）に対応するインタラクティブなコンポーネントとして機能します。
"use client"

// Reactから必要な型（type）をインポートしています。
import type React from "react"

// Reactの「フック」という機能をインポートしています。
// useStateは状態（例: 表示する画像、ローディング中かどうか）を管理し、
// useRefはHTML要素（例: ファイル選択ボタン）を直接操作するために使います。
import { useState, useRef } from "react"

// UIコンポーネント（見た目の部品）をインポートしています。
import { Button } from "@/components/ui/button" // ボタン
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" // カード形式のコンテナ
import { Badge } from "@/components/ui/badge" // バッジ（「ペットボトル」などのラベル表示用）

// アイコンをインポートしています。
import { Camera, Upload, Loader2, Recycle } from "lucide-react"

// TypeScriptの「interface」という機能で、分別結果データの型（形）を定義しています。
// これにより、データが必ずこの形に従うようになり、バグを防ぎやすくなります。
interface WasteResult {
  itemName: string // 品目名（例: ペットボトル）
  category: string // 分別区分（例: 資源ごみ）
  method: string // 出し方（例: 資源ごみの日に出す）
  details: string[] // 注意事項（配列形式）
  color: string // 結果表示に使う色
}

// このファイル全体が、ごみ分別アプリの本体となるコンポーネントです。
export default function WasteSortingApp() {
  // --- ここから状態管理（useState） ---
  // 選択された画像を保持するための状態。初期値はnull（何もなし）。
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  // 解析中かどうかを管理するための状態。trueになるとローディング画面を表示します。
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  // AIの解析結果を保持するための状態。初期値はnull。
  const [result, setResult] = useState<WasteResult | null>(null)

  // --- ここからDOM要素の参照（useRef） ---
  // 画面に表示されない「ファイル選択」ボタンへの参照。
  const fileInputRef = useRef<HTMLInputElement>(null)
  // 画面に表示されない「カメラ」ボタンへの参照。
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // モックアップ（ダミー）用の分別結果データです。
  // 本来はAIがこの結果を返しますが、ここでは固定のデータをいくつか用意しています。
  const mockResults: WasteResult[] = [
    {
      itemName: "ペットボトル",
      category: "資源ごみ",
      method: "資源ごみの日に出す",
      details: [
        "キャップとラベルを外してください",
        "中身を空にして軽くすすいでください",
        "透明または半透明の袋に入れてください",
      ],
      color: "bg-blue-100 text-blue-800",
    },
    // ... 他のモックデータ ...
  ]

  // ファイルが選択されたときに実行される関数です。
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] // 選択されたファイルを取得
    if (file) {
      const reader = new FileReader() // ファイルを読み込むための準備
      // ファイルの読み込みが完了したら...
      reader.onload = (e) => {
        // 読み込んだ画像データをstateに保存して画面に表示
        setSelectedImage(e.target?.result as string)
        // 画像解析を開始
        analyzeImage()
      }
      // ファイルをDataURL形式（テキスト形式）で読み込む
      reader.readAsDataURL(file)
    }
  }

  // 画像を解析する（フリをする）関数です。
  const analyzeImage = () => {
    setIsAnalyzing(true) // 解析中の状態にする
    setResult(null) // 前回の結果をリセット

    // setTimeoutを使って、AIが2秒間考えているように見せかけます。
    setTimeout(() => {
      // モックデータの中からランダムに一つ結果を選びます。
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setResult(randomResult) // 結果をstateに保存
      setIsAnalyzing(false) // 解析完了の状態にする
    }, 2000)
  }

  // 「カメラで撮影」ボタンがクリックされたときに、隠れているカメラ入力要素をクリックさせます。
  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  // 「ギャラリーから選択」ボタンがクリックされたときに、隠れているファイル入力要素をクリックさせます。
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // 「もう一度撮影する」ボタンがクリックされたときに、アプリの状態を初期化する関数です。
  const resetApp = () => {
    setSelectedImage(null)
    setResult(null)
    setIsAnalyzing(false)
  }

  // --- ここからが画面に表示される内容（JSX） ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* ヘッダーセクション */}
        <div className="text-center space-y-2">
          {/* ... アプリのタイトルと説明 ... */}
        </div>

        {/* メイン機能エリア */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">ごみの写真を撮影してください</CardTitle>
            <CardDescription>カメラで撮影するか、ギャラリーから画像を選択してください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 初期状態（画像も選択されておらず、解析中でもなく、結果もない）の場合に表示 */}
            {!selectedImage && !isAnalyzing && !result && (
              <div className="space-y-3">
                <Button onClick={handleCameraClick} className="w-full h-12 bg-green-600 hover:bg-green-700" size="lg">
                  <Camera className="mr-2 h-5 w-5" />
                  カメラで撮影
                </Button>
                {/* ... ギャラリーボタン ... */}
              </div>
            )}

            {/* 画像が選択されたら表示 */}
            {selectedImage && (
              <div className="space-y-4">
                <div className="relative">
                  <img src={selectedImage} alt="選択された画像" className="w-full h-48 object-cover rounded-lg border" />
                </div>
              </div>
            )}

            {/* 解析中の場合にローディング画面を表示 */}
            {isAnalyzing && (
              <div className="text-center py-8 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600" />
                <p className="text-gray-600">画像を解析しています...</p>
                <p className="text-sm text-gray-500">（モックアップ解析中）</p>
              </div>
            )}

            {/* 解析結果が存在する場合に結果を表示 */}
            {result && (
              <div className="space-y-4">
                {/* ... 結果のタイトルとバッジ ... */}

                <Card className="bg-gray-50">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {/* 分別区分 */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">分別区分</h4>
                        <p className="text-green-700 font-medium">{result.category}</p>
                      </div>
                      {/* 出し方 */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">出し方</h4>
                        <p className="text-gray-700">{result.method}</p>
                      </div>
                      {/* 注意事項 */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">注意事項</h4>
                        <ul className="space-y-1">
                          {/* details配列の各項目をリストとして表示 */}
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

            {/* 実際にファイル選択を行うためのinput要素。hiddenクラスで画面上は見えなくしている。 */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
          </CardContent>
        </Card>

        {/* フッター情報 */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>横浜市の分別ルールに基づいています</p>
          <p>詳細は横浜市公式サイトをご確認ください</p>
        </div>
      </div>
    </div>
  )
}