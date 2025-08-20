// Reactの基本機能をインポートします。
import * as React from "react"

// 複数のCSSクラス名を安全に結合するためのヘルパー関数 "cn" をインポートしています。
import { cn } from "@/lib/utils"

// カードの一番外側となるコンテナ（枠組み）コンポーネントです。
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      // cn関数で基本スタイルと、外部から渡されたカスタムスタイルを結合します。
      // 基本スタイル：背景色、文字色、角丸、枠線、余白、影などを設定しています。
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props} // onClickなどの残りのpropsを渡します。
    />
  )
}

// カードのヘッダー部分を担当するコンポーネントです。
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      // ヘッダー内のレイアウトをgridで設定しています。
      // CardAction（操作ボタンなど）がある場合は、レイアウトが2カラムに変わるようになっています。
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

// カードのタイトルを表示するためのコンポーネントです。
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      // 文字の行間を詰め、太字にするスタイルを適用しています。
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

// カードの説明文（サブタイトル）を表示するためのコンポーネントです。
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      // 少し薄い文字色にし、文字サイズを小さくするスタイルを適用しています。
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

// カードヘッダーの右上に配置される操作（ボタンやメニューなど）のためのコンポーネントです。
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      // gridレイアウトを利用して、ヘッダーの右上に配置されるように設定しています。
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

// カードのメインコンテンツ部分を表示するためのコンポーネントです。
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      // 左右に余白（padding）を設定しています。
      className={cn("px-6", className)}
      {...props}
    />
  )
}

// カードのフッター部分を担当するコンポーネントです。
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      // 中の要素を横並びにし、左右に余白を設定しています。
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

// このファイルで定義した全てのカード関連コンポーネントをエクスポートします。
// これにより、他のファイルからインポートして使えるようになります。
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}