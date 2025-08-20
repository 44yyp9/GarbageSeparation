// Reactの基本的な機能と、Radix UIのSlotコンポーネントをインポートしています。
// Slotは、子要素にスタイルやプロパティを渡すための便利なツールです。
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

// "class-variance-authority" (cva) は、コンポーネントの見た目のバリエーション（variants）を簡単に作成するためのライブラリです。
import { cva, type VariantProps } from "class-variance-authority"

// "@/lib/utils" から "cn" という関数をインポートしています。
// これは複数のCSSクラス名を安全に結合するためのヘルパー関数です。（例: "class1" と "class2" を "class1 class2" にする）
import { cn } from "@/lib/utils"

// cvaを使って、バッジのスタイルバリエーションを定義しています。
const badgeVariants = cva(
  // --- ここは全てのバリエーションに共通で適用される基本スタイル ---
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    // --- ここからが具体的なバリエーションの定義 ---
    variants: {
      // "variant" という名前で、見た目の種類を定義します。
      variant: {
        // "default" スタイル: プライマリーカラーの背景
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        // "secondary" スタイル: セカンダリーカラーの背景
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        // "destructive" スタイル: 破壊的な操作を示す赤系の背景
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        // "outline" スタイル: 背景なしで枠線のみ
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    // デフォルトで適用されるバリエーションを指定します。
    defaultVariants: {
      variant: "default",
    },
  }
)

// Badgeコンポーネント本体の定義です。
function Badge({
  className, // 外部から追加のCSSクラスを受け取るためのprops
  variant,   // 上で定義した "variant" を受け取るためのprops
  asChild = false, // trueの場合、子要素にスタイルを統合します (Slot機能)
  ...props   // その他のHTML属性（例: id, onClickなど）を受け取るためのprops
}: React.ComponentProps<"span"> & // spanタグが持つ標準の属性を使えるようにします
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) { // cvaの型定義とasChildの型を組み合わせます
  
  // asChildがtrueならSlotを、falseなら通常のspanタグをコンポーネントとして使用します。
  const Comp = asChild ? Slot : "span"

  // 実際に画面に表示される要素を返します。
  return (
    <Comp
      data-slot="badge"
      // cn関数を使って、基本スタイル、バリエーションに応じたスタイル、外部から渡されたスタイルを結合します。
      className={cn(badgeVariants({ variant }), className)}
      // 残りのpropsをそのまま要素に渡します。
      {...props}
    />
  )
}

// Badgeコンポーネントと、そのスタイル定義であるbadgeVariantsの両方をエクスポートします。
// これにより、他のファイルからこれらをインポートして使用できます。
export { Badge, badgeVariants }