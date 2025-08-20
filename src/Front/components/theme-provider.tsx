// 'use client' は、このコンポーネントがブラウザ側で動作する「クライアントコンポーネント」であることを示すNext.jsの宣言です。
// テーマの切り替えなど、ユーザーの操作に応じて動くコンポーネントにはこれが必要です。
'use client'

// Reactの基本機能をインポートします。
import * as React from 'react'
// テーマ管理ライブラリである "next-themes" から必要な機能をインポートします。
import {
  ThemeProvider as NextThemesProvider, // ThemeProviderという名前が重複しないように、"as NextThemesProvider" を使ってライブラリのコンポーネントに別名をつけています。
  type ThemeProviderProps,
} from 'next-themes'

// この ThemeProvider コンポーネントは、next-themes の機能をアプリ全体で使いやすくするための「ラッパー（包むもの）」です。
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // ライブラリからインポートした NextThemesProvider を使い、受け取った設定（...props）と子要素（children）をそのまま渡しています。
  // これにより、このコンポーネントで囲まれた全ての子要素（アプリ全体）でテーマ機能が使えるようになります。
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}