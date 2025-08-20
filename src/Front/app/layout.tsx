// ReactとNext.jsから必要な型（type）をインポートしています。
// これにより、コードが特定の形（ルール）に従っているかチェックしやすくなります。
import type React from "react"
import type { Metadata } from "next"

// Webフォント（見た目を整えるための文字）をインポートしています。
// GeistSansは通常のテキスト用、GeistMonoはコード表示などに使われる等幅フォントです。
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

// アプリ全体に適用される共通のスタイルシート（CSS）を読み込んでいます。
import "./globals.css"

// "metadata" は、このウェブページの「説明書」のようなものです。
// ブラウザのタブに表示されるタイトルや、検索エンジンに表示される説明文などを設定します。
export const metadata: Metadata = {
  // ブラウザのタブに表示されるタイトルです。
  title: "横浜市ごみ分別アプリ",
  // サイトの説明文です。Googleなどの検索結果に表示されます。
  description: "写真を撮るだけで横浜市のごみ分別方法がわかるアプリ",
  // このページがv0.appというツールで生成されたことを示しています。
  generator: "v0.app",
}

// "RootLayout" は、このアプリの全てのページで共通となる「骨格」部分です。
// ここで設定した内容は、どのページにも適用されます。
export default function RootLayout({
  children, // "children" は、各ページ（例: トップページ、詳細ページなど）の具体的な内容が入る場所です。
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // HTML全体の言語を日本語（ja）に設定しています。
    <html lang="ja">
      <head>
        {/*
          headタグ内は通常、ページの裏側の設定を書く場所です。
          ここでは、インポートしたGeistフォントを実際にページに適用するためのスタイルを定義しています。
        */}
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      {/* bodyタグの中に、各ページの具体的な内容である {children} が表示されます。 */}
      <body>{children}</body>
    </html>
  )
}