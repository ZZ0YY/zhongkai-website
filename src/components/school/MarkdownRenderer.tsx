/**
 * ============================================================================
 * Markdown 内容渲染组件 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【功能说明】
 * 这个组件用于渲染 Markdown 内容，包括：
 * - 标题样式
 * - 段落样式
 * - 列表样式
 * - 引用块样式
 * - 代码块样式
 * - 图片样式（支持点击无损放大查看 Lightbox）
 * 
 * 【使用方法】
 * import { MarkdownRenderer } from '@/components/school/MarkdownRenderer';
 * 
 * <MarkdownRenderer html={content.html} />
 */

import { MarkdownContent } from './ZoomableImage';

interface MarkdownRendererProps {
  /** 转换后的 HTML 内容 */
  html: string;
  /** 额外的 CSS 类名 */
  className?: string;
}

/**
 * Markdown 渲染组件
 * 
 * 【样式说明】
 * - prose: Tailwind 的排版类，提供默认的文章样式
 * - prose-lg: 较大的字体
 * - max-w-none: 不限制最大宽度
 * - 图片通过 MarkdownContent 自动解析为 ZoomableImage 组件
 */
export function MarkdownRenderer({ html, className = '' }: MarkdownRendererProps) {
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
 * 空内容提示组件
 * 当没有 Markdown 内容时显示
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
 * 内容来源提示组件
 * 显示文章的元数据信息
 */
export function ContentMeta({ 
  date, 
  author, 
  tags 
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
