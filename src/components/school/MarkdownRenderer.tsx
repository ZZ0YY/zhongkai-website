'use client'

/**
 * ============================================================================
 * Markdown 内容渲染组件 (v3) - 惠州仲恺中学官网
 * ============================================================================
 *
 * 【v3 升级说明】
 * 1. 集成 @tailwindcss/typography（prose 类替代手写样式）
 * 2. 集成 TOC 目录导航
 * 3. 集成 KaTeX 公式渲染 Provider
 * 4. 支持暗色模式（dark:prose-invert）
 * 5. 保留与 ZoomableImage/MarkdownContent 的兼容
 *
 * 【向后兼容】
 * 旧 API <MarkdownRenderer html={html} /> 仍然可用
 */

import { useEffect, useRef } from 'react'
import { MarkdownContent } from './ZoomableImage'
import { TableOfContents } from './TableOfContents'
import { PrevNextNav } from './PrevNextNav'
import { KatexProvider } from './KatexProvider'
import type { HeadingItem } from '@/lib/markdown'

interface MarkdownRendererProps {
  /** 已渲染的 HTML 内容（新 API） */
  htmlContent?: string;
  /** 已渲染的 HTML 内容（旧 API，向后兼容） */
  html?: string;
  /** 原始 Markdown 文本（旧 API，已弃用） */
  markdown?: string;
  /** 文章标题 */
  title?: string;
  /** 提取的标题列表（用于 TOC） */
  headings?: HeadingItem[];
  /** 上一篇 */
  prev?: { id: string; title: string } | null;
  /** 下一篇 */
  next?: { id: string; title: string } | null;
  /** 文章详情页的基础路径 */
  basePath?: string;
  /** 是否显示 TOC（默认 true） */
  showToc?: boolean;
  /** 是否显示上下篇导航（默认 false，由页面自己控制） */
  showPrevNext?: boolean;
  /** 额外的 CSS 类名 */
  className?: string;
}

export function MarkdownRenderer({
  htmlContent,
  html: htmlLegacy,
  title,
  headings = [],
  prev,
  next,
  basePath = '/news',
  showToc = true,
  showPrevNext = false,
  className = '',
}: MarkdownRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  // 优先使用 htmlContent，兼容旧 html prop
  const finalHtml = htmlContent || htmlLegacy || ''

  // 为标题添加 id（如果 marked walkTokens 未生效的兜底）
  useEffect(() => {
    if (!contentRef.current) return
    const headingsEl = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6')
    headingsEl.forEach((el) => {
      if (!el.id) {
        el.id = el.textContent
          ?.toLowerCase()
          .replace(/[^\w\u4e00-\u9fff]+/g, '-')
          .replace(/^-+|-+$/g, '') || ''
      }
    })
  }, [finalHtml])

  if (!finalHtml) {
    return null;
  }

  return (
    <KatexProvider>
      <div className="flex gap-8">
        {/* 主内容区 */}
        <div className="min-w-0 flex-1" ref={contentRef}>
          <MarkdownContent
            html={finalHtml}
            className={`prose prose-lg max-w-none
              prose-gray dark:prose-invert
              prose-headings:scroll-mt-20
              prose-headings:font-serif-sc
              prose-a:text-zk-blue prose-a:no-underline hover:prose-a:underline
              dark:prose-a:text-blue-400
              prose-img:rounded-lg prose-img:shadow-md
              prose-pre:bg-gray-900 prose-pre:text-gray-100
              dark:prose-pre:bg-gray-800
              prose-code:before:content-[''] prose-code:after:content-['']
              prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-zk-red
              dark:prose-code:bg-gray-800 dark:prose-code:text-blue-300
              prose-blockquote:border-l-4 prose-blockquote:border-zk-gold prose-blockquote:bg-gray-50
              dark:prose-blockquote:border-blue-500 dark:prose-blockquote:bg-gray-800/50
              prose-table:border-collapse
              prose-th:bg-gray-50 dark:prose-th:bg-gray-800
              ${className}
            `}
          />

          {/* 上下篇导航 */}
          {showPrevNext && (
            <PrevNextNav prev={prev} next={next} basePath={basePath} />
          )}
        </div>

        {/* 侧边 TOC */}
        {showToc && headings.length > 0 && (
          <TableOfContents headings={headings} />
        )}
      </div>
    </KatexProvider>
  )
}

/**
 * 空内容提示组件
 */
export function EmptyContent({ message = '暂无详细内容' }: { message?: string }) {
  return (
    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
      <svg
        className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p>{message}</p>
    </div>
  );
}

/**
 * 内容来源提示组件
 */
export function ContentMeta({
  date,
  author,
  tags,
}: {
  date?: string;
  author?: string;
  tags?: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
      {date && (
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {date}
        </span>
      )}
      {author && (
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {author}
        </span>
      )}
      {tags && tags.length > 0 && (
        <span className="flex items-center gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

export default MarkdownRenderer;
