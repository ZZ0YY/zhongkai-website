/**
 * ============================================================================
 * Markdown 内容解析工具 (v3) - 惠州仲恺中学官网
 * ============================================================================
 *
 * 【升级说明 v3】
 * ❌ 移除 jsdom + dompurify（jsdom 在 Vercel Serverless 环境中
 *    因 @exodus/bytes ESM-only 问题导致 ERR_REQUIRE_ESM 崩溃）
 * ✅ 替换为 sanitize-html（纯字符串操作，无需 DOM 环境）
 * ✅ 保持与原 API 完全兼容（getMarkdownContent / getMarkdownIds / parseFrontmatter）
 *
 * 【依赖变更】
 * npm uninstall jsdom @types/jsdom dompurify @types/dompurify
 * npm install sanitize-html @types/sanitize-html
 *
 * 【不依赖】
 * ❌ 不需要 jsdom（已移除，彻底解决 ESM 兼容问题）
 * ❌ 不需要 dompurify（已移除）
 * ❌ 不需要 contentlayer（已废弃）
 * ❌ 不需要 remark/rehype（marked 已足够）
 */

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import hljs from 'highlight.js';
import matter from 'gray-matter';
import sanitizeHtml from 'sanitize-html';

// ============================================================================
// 类型定义（保持与原版完全兼容）
// ============================================================================

/**
 * Markdown 文件的 frontmatter 元数据
 */
export interface MarkdownFrontmatter {
  title?: string;
  date?: string;
  author?: string;
  tags?: string[];
  [key: string]: string | string[] | undefined;
}

/**
 * 解析后的 Markdown 内容
 */
export interface MarkdownContent {
  /** 元数据 */
  frontmatter: MarkdownFrontmatter;
  /** 原始 Markdown 文本（不含 frontmatter） */
  raw: string;
  /** 转换后的 HTML */
  html: string;
  /** 是否存在此文件 */
  exists: boolean;
}

// ============================================================================
// 配置
// ============================================================================

/**
 * 内容目录映射
 */
const CONTENT_DIRS: Record<string, string> = {
  news: 'news',
  courses: 'courses',
  teachers: 'teachers',
  events: 'events',
  achievements: 'achievements',
  software: 'software',
};

/**
 * 获取 content 目录的绝对路径
 */
function getContentDir(): string {
  const projectRoot = process.cwd();
  return path.join(projectRoot, 'content');
}

// ============================================================================
// Marked 配置 - 自定义 Renderer
// ============================================================================

/**
 * 自定义 Marked Renderer
 *
 * 【改造要点】
 * 1. 代码块：使用 highlight.js 实现语法高亮
 * 2. 标题：自动生成锚点 ID（用于页面内跳转）
 * 3. 图片：保留原始 MarkdownRenderer 的 Lightbox 兼容性
 * 4. 链接：外部链接自动添加 target="_blank"
 * 5. 表格：自动包裹在响应式容器中
 */
const renderer = new marked.Renderer();

/**
 * 代码块渲染 - 带语法高亮
 *
 * 支持 ```language 指定语言，highlight.js 自动识别并高亮
 * 支持行号显示（通过 CSS counter 实现）
 */
renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  let highlighted: string;
  let language = lang || '';

  if (language && hljs.getLanguage(language)) {
    highlighted = hljs.highlight(text, { language }).value;
  } else {
    highlighted = hljs.highlightAuto(text).value;
    // 尝试自动检测语言
    const detectedLang = hljs.highlightAuto(text).language;
    language = detectedLang || '';
  }

  return `<div class="code-block-wrapper${language ? ' lang-' + language.toLowerCase() : ''}">
  <div class="code-block-header">
    <span class="code-lang">${language || 'code'}</span>
    <button class="code-copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-block-wrapper').querySelector('code').textContent)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      复制
    </button>
  </div>
  <pre><code class="hljs language-${language}">${highlighted}</code></pre>
</div>`;
};

/**
 * 标题渲染 - 自动生成锚点 ID
 *
 * 生成 slug 格式：将中文标题转为可用的 ID
 * 支持标题内嵌链接图标（hover 时显示）
 */
renderer.heading = function ({ text, depth }: { text: string; depth: number }) {
  const slug = generateSlug(text);
  return `<h${depth} id="${slug}" class="content-header">
  <a href="#${slug}" class="content-header-link" aria-hidden="true" title="链接到此标题">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z"/>
      <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z"/>
    </svg>
  </a>
  ${text}
</h${depth}>`;
};

/**
 * 图片渲染 - 保持与 ZoomableImage 的兼容性
 *
 * 只输出 <img> 标签，由 MarkdownContent 组件解析为 ZoomableImage
 */
renderer.image = function ({ href, title, text }: { href: string; title?: string | null; text: string }) {
  const titleAttr = title ? ` title="${title}"` : '';
  return `<img src="${href}" alt="${text}" loading="lazy"${titleAttr} />`;
};

/**
 * 链接渲染 - 自动处理内部/外部链接
 */
renderer.link = function ({ href, title, text }: { href: string; title?: string | null; text: string }) {
  const isExternal = href.startsWith('http://') || href.startsWith('https://');
  const titleAttr = title ? ` title="${title}"` : '';
  const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a href="${href}"${titleAttr}${targetAttr}>${text}</a>`;
};

/**
 * 表格渲染 - 包裹在响应式容器中
 */
renderer.table = function (token: { header: string; rows: string[][] }) {
  const headerHtml = token.header;
  const bodyHtml = token.rows.map(row => `<tr>${row.join('')}</tr>`).join('');
  return `<div class="table-wrapper"><table><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table></div>`;
};

// ============================================================================
// Marked 全局配置
// ============================================================================

marked.setOptions({
  renderer,
  gfm: true,            // GitHub Flavored Markdown
  breaks: false,         // 不将单个换行转为 <br>（标准 Markdown 行为）
  pedantic: false,       // 不使用原始 Markdown.pl 行为
});

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 生成 slug（URL 友好的锚点 ID）
 *
 * 支持中文标题：将中文保留，特殊字符移除
 * 示例："第一章 介绍" → "第一章-介绍"
 */
function generateSlug(text: string): string {
  // 从 text 中移除 HTML 标签
  const plainText = text.replace(/<[^>]*>/g, '').trim();
  return plainText
    .toLowerCase()
    .replace(/\s+/g, '-')          // 空格转连字符
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')  // 保留字母、数字、中文、连字符
    .replace(/-+/g, '-')           // 多个连字符转单个
    .replace(/^-+|-+$/g, '');      // 移除首尾连字符
}

// ============================================================================
// sanitize-html 配置（替代 DOMPurify + jsdom）
// ============================================================================

/**
 * sanitize-html 允许的标签和属性配置
 *
 * 与原 DOMPurify 配置完全对齐，确保功能不丢失
 */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'a', 'strong', 'em', 'del', 's',
    'blockquote',
    'pre', 'code',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'img',
    'div', 'span',
    'input',  // 用于任务列表的 checkbox
    'button', 'svg', 'rect', 'path',  // 用于代码复制按钮
    'sup', 'sub',  // 上标下标
  ],
  allowedAttributes: {
    '*': ['class', 'id', 'style'],
    'a': ['href', 'target', 'rel', 'title'],
    'img': ['src', 'alt', 'loading', 'title'],
    'input': ['type', 'checked', 'disabled'],
    'button': ['onclick', 'class'],
    'svg': ['viewBox', 'fill', 'stroke', 'stroke-width', 'width', 'height', 'class'],
    'rect': ['x', 'y', 'rx', 'ry', 'width', 'height', 'fill', 'stroke', 'stroke-width'],
    'path': ['d', 'fill', 'stroke', 'stroke-width'],
    'td': ['align', 'valign'],
    'th': ['align', 'valign'],
  },
  // 允许 svg 中的 path、rect 等自闭合标签
  selfClosing: ['img', 'br', 'hr', 'input', 'rect'],
};

// ============================================================================
// 公开 API（保持与原版完全兼容）
// ============================================================================

/**
 * 解析 frontmatter（使用 gray-matter 库）
 *
 * 【升级】
 * 原版使用手写正则解析，只支持简单键值对。
 * 新版使用 gray-matter，支持：
 * - 多行字符串
 * - 嵌套对象
 * - 数组（YAML 格式）
 * - 布尔值、数字
 *
 * @param content - Markdown 文件原始内容（包含 frontmatter）
 * @returns { frontmatter, content } - 元数据和正文
 */
export function parseFrontmatter(content: string): { frontmatter: MarkdownFrontmatter; content: string } {
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const { data, content: body } = matter(normalizedContent);

  return {
    frontmatter: data as MarkdownFrontmatter,
    content: body,
  };
}

/**
 * 将 Markdown 转换为 HTML
 *
 * 【升级】
 * 原版使用手写正则，功能极其有限。
 * 新版使用 marked，支持：
 * - 表格（GFM）
 * - 任务列表 [x] / [ ]
 * - 删除线 ~~text~~
 * - 代码块语法高亮
 * - 标题锚点链接
 * - 自动链接
 *
 * 【安全】
 * 使用 sanitize-html 清理 HTML，防止 XSS 攻击
 * （替换了 jsdom + dompurify，彻底解决 Vercel 上的 ESM 兼容问题）
 *
 * @param markdown - Markdown 文本（不含 frontmatter）
 * @returns 安全的 HTML 字符串
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n');

  // 使用 marked 解析（返回 Promise）
  const rawHtml = await marked(normalizedMarkdown);

  // sanitize-html 清理：纯字符串操作，无需 DOM 环境
  const cleanHtml = sanitizeHtml(rawHtml, SANITIZE_OPTIONS);

  return cleanHtml;
}

/**
 * 获取指定类型和 ID 的 Markdown 内容
 *
 * 【API 兼容】
 * 与原版签名完全一致，但内部使用 marked + gray-matter
 * 注意：markdownToHtml 现在是异步的，因此本函数也是异步的
 *
 * @param type - 内容类型（news/courses/teachers/events/achievements/software）
 * @param id - 内容 ID
 * @returns MarkdownContent 对象
 */
export async function getMarkdownContent(type: string, id: string): Promise<MarkdownContent> {
  const notFound: MarkdownContent = {
    frontmatter: {},
    raw: '',
    html: '',
    exists: false,
  };

  const dirName = CONTENT_DIRS[type];
  if (!dirName) {
    return notFound;
  }

  const filePath = path.join(getContentDir(), dirName, `${id}.md`);

  if (!fs.existsSync(filePath)) {
    return notFound;
  }

  try {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, content } = parseFrontmatter(rawContent);
    const html = await markdownToHtml(content);

    return {
      frontmatter,
      raw: content,
      html,
      exists: true,
    };
  } catch (error) {
    console.error(`Error reading markdown file: ${filePath}`, error);
    return notFound;
  }
}

/**
 * 获取指定类型的所有 Markdown 文件 ID
 *
 * 【API 兼容】同步函数，无变化
 */
export function getMarkdownIds(type: string): string[] {
  const dirName = CONTENT_DIRS[type];
  if (!dirName) {
    return [];
  }

  const dirPath = path.join(getContentDir(), dirName);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  try {
    const files = fs.readdirSync(dirPath);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
  } catch {
    return [];
  }
}

/**
 * 检查是否存在指定的 Markdown 文件
 *
 * 【API 兼容】同步函数，无变化
 */
export function hasMarkdownContent(type: string, id: string): boolean {
  const dirName = CONTENT_DIRS[type];
  if (!dirName) return false;

  const filePath = path.join(getContentDir(), dirName, `${id}.md`);
  return fs.existsSync(filePath);
}
