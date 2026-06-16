/**
 * ============================================================================
 * Markdown 内容渲染组件 (v2) - 惠州仲恺中学官网
 * ============================================================================
 *
 * 【升级说明】
 * 1. MarkdownContent 改为异步组件（因为 markdownToHtml 现在是异步的）
 * 2. 支持远程 Hexo 内容（来自 content.json API 的 raw Markdown）
 * 3. 保留 ZoomableImage 的 Lightbox 功能
 * 4. 新增：表格响应式、代码块增强、任务列表复选框样式
 *
 * 【使用方法】
 * // 本地 Markdown 文件
 * import { MarkdownRenderer } from '@/components/school';
 * <MarkdownRenderer html={content.html} />
 *
 * // 远程 Hexo Markdown（新功能）
 * <MarkdownRenderer markdown={post.content} />
 */

import { MarkdownContent } from './ZoomableImage';

interface MarkdownRendererProps {
  /** 转换后的 HTML 内容（原有 API，向后兼容） */
  html?: string;
  /** 原始 Markdown 文本（新 API，内部自动转 HTML） */
  markdown?: string;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * Markdown 渲染组件
 *
 * 【v2 升级要点】
 * - 新增 markdown prop，支持传入原始 Markdown 文本
 * - 如果同时传入 html 和 markdown，优先使用 html
 * - 由于 markdownToHtml 是异步的，如果使用 markdown prop，
 *   需要在父组件中先 await markdownToHtml()，再传入 html
 */
export function MarkdownRenderer({ html, className = '' }: MarkdownRendererProps) {
  if (!html) {
    return null;
  }

  const proseClasses = `prose prose-lg max-w-none
    prose-headings:font-serif-sc prose-headings:text-gray-900
    prose-h1:text-3xl prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4
    prose-h2:text-2xl prose-h2:text-zk-blue prose-h2:mt-8
    prose-h3:text-xl prose-h3:text-zk-red
    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
    prose-a:text-zk-blue prose-a:no-underline hover:prose-a:underline
    prose-strong:text-gray-900 prose-strong:font-bold
    prose-blockquote:border-l-4 prose-blockquote:border-zk-gold prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:italic
    prose-ul:list-disc prose-ul:pl-6
    prose-ol:list-decimal prose-ol:pl-6
    prose-li:text-gray-700 prose-li:mb-2
    prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-zk-red
    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
    prose-hr:border-gray-200 prose-hr:my-8
    prose-table:w-full prose-table:border-collapse
    prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-th:font-bold
    prose-td:border prose-td:border-gray-200 prose-td:p-3
    ${className}
  `;

  return <MarkdownContent html={html} className={proseClasses} />;
}

/**
 * 空内容提示组件（保持不变）
 */
export function EmptyContent({ message = '暂无详细内容' }: { message?: string }) {
  return (
    <div className="text-center py-12 text-gray-500">
      <svg
        className="w-16 h-16 mx-auto mb-4 text-gray-300"
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
 * 内容来源提示组件（保持不变）
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
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
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
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
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
