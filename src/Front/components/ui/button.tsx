// Reactの基本的な機能と、Radix UIのSlotコンポーネントをインポートしています。
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

// "class-variance-authority" (cva) は、コンポーネントの見た目のバリエーションを管理するためのライブラリです。
import { cva, type VariantProps } from "class-variance-authority"

// 複数のCSSクラス名を安全に結合するためのヘルパー関数 "cn" をインポートしています。
import { cn } from "@/lib/utils"

// cvaを使って、ボタンのスタイルバリエーションを定義しています。
const buttonVariants = cva(
  // --- ここは全てのボタンに共通で適用される基本スタイル ---
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    // --- ここからが具体的なバリエーションの定義 ---
    variants: {
      // "variant" という名前で、見た目の種類を定義します。
      variant: {
        // "default": 基本的なスタイル（プライマリーカラー）
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        // "destructive": 削除など、注意を促す操作用のスタイル
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        // "outline": 枠線のみのスタイル
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        // "secondary": 控えめなセカンダリーカラーのスタイル
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        // "ghost": 背景も枠線もない、マウスオーバーで背景色が変わるスタイル
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        // "link": 通常のリンクのような見た目のスタイル
        link: "text-primary underline-offset-4 hover:underline",
      },
      // "size" という名前で、ボタンのサイズを定義します。
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3", // 標準サイズ
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5", // 小さいサイズ
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4", // 大きいサイズ
        icon: "size-9", // アイコン専用の正方形サイズ
      },
    },
    // デフォルトで適用されるバリエーションを指定します。
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Buttonコンポーネント本体の定義です。
function Button({
  className, // 外部から追加のCSSクラスを受け取るためのprops
  variant,   // 上で定義した "variant" を受け取るためのprops
  size,      // 上で定義した "size" を受け取るためのprops
  asChild = false, // trueの場合、子要素にスタイルを統合します (Slot機能)
  ...props   // その他のHTML属性（例: onClick, typeなど）を受け取るためのprops
}: React.ComponentProps<"button"> & // buttonタグが持つ標準の属性を使えるようにします
  VariantProps<typeof buttonVariants> & { // cvaの型定義とasChildの型を組み合わせます
    asChild?: boolean
  }) {
  
  // asChildがtrueならSlotを、falseなら通常のbuttonタグをコンポーネントとして使用します。
  const Comp = asChild ? Slot : "button"

  // 実際に画面に表示される要素を返します。
  return (
    <Comp
      data-slot="button"
      // cn関数を使って、基本スタイル、バリエーションに応じたスタイル、外部から渡されたスタイルを結合します。
      className={cn(buttonVariants({ variant, size, className }))}
      // 残りのpropsをそのまま要素に渡します。
      {...props}
    />
  )
}

// Buttonコンポーネントと、そのスタイル定義であるbuttonVariantsの両方をエクスポートします。
export { Button, buttonVariants }