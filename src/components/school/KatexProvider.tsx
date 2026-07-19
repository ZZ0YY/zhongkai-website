'use client'

import { useEffect, type ReactNode } from 'react'

/**
 * KaTeX 数学公式客户端渲染组件
 * 
 * 用于渲染 Hexo 远程文章中的 LaTeX 公式。
 * 对于本地 marked 渲染的文章，公式已在 markdown.ts 中通过 
 * 自定义 renderer 预处理为 KaTeX HTML。
 * 
 * 此组件确保 KaTeX CSS 加载，并对残留的 $...$ 和 $$...$$ 
 * 公式进行客户端渲染（适用于 Hexo 源内容）。
 */
export function KatexProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // 检查 KaTeX 是否已全局可用（通过 CDN 或 npm）
    if (typeof window !== 'undefined' && typeof window.katex !== 'undefined') {
      renderMathInDocument()
    }
  }, [])

  return <>{children}</>
}

function renderMathInDocument() {
  // 查找所有未渲染的行内公式 $...$ 和块级公式 $$...$$
  const articleContent = document.querySelector('.prose')
  if (!articleContent) return

  // 使用 renderMathInElement（如果可用）
  if (
    typeof window !== 'undefined' &&
    typeof (window as Record<string, unknown>).renderMathInElement === 'function'
  ) {
    ;((window as Record<string, unknown>).renderMathInElement as (el: Element, opts: Record<string, unknown>) => void)(
      articleContent,
      {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true },
        ],
        throwOnError: false,
      }
    )
  }
}

// 声明全局类型
declare global {
  interface Window {
    katex?: {
      render: (
        tex: string,
        el: HTMLElement,
        opts: Record<string, unknown>
      ) => void
    }
    renderMathInElement?: (el: Element, opts: Record<string, unknown>) => void
  }
}
