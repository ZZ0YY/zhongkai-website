/**
 * ============================================================================
 * Markdown 内容解析工具 (v4) - 惠州仲恺中学官网
 * ============================================================================
 *
 * 【v3 → v4 升级说明】
 * ✅ 移除 jsdom + dompurify（~2MB 重依赖，Vercel 构建不稳定）
 * ✅ 改用 sanitize-html（~50KB，纯字符串处理，无需 DOM 环境）
 * ✅ 保留所有原有 API：getMarkdownContent / parseFrontmatter / markdownToHtml / parseMarkdown
 * ✅ SEO 完全不受影响：generateStaticParams 构建时预渲染静态 HTML
 *
 * 【为什么可以移除 jsdom？】
 * 1. 内容来源可信：本地 .md 文件 + 学校博客，不存在 XSS 风险
 * 2. sanitize-html 不需要 DOM 环境，Node.js 原生可用
 * 3. 构建速度更快，Vercel 部署更稳定
 *
 * 【依赖】
 * npm install marked marked-highlight highlight.js gray-matter sanitize-html @types/sanitize-html
 * npm uninstall jsdom dompurify @types/jsdom @types/dompurify
 */

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
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

/**
 * 标题项（用于 TOC 目录导航）
 */
export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

/**
 * 完整解析结果
 */
export interface MarkdownResult {
  content: string;
  frontmatter: MarkdownFrontmatter;
  headings: HeadingItem[];
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
// sanitize-html 配置
// ============================================================================

/**
 * sanitize-html 允许的标签和属性
 *
 * 与 v3 版 dompurify 的 ALLOWED_TAGS / ALLOWED_ATTR 保持一致，
 * 确保渲染效果不受影响。
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
    'input',  // 任务列表 checkbox
    'button', 'svg', 'rect', 'path',  // 代码复制按钮
    'sup', 'sub',  // 上标下标
    'figure', 'figcaption',  // 图片说明
  ],
  allowedAttributes: {
    '*': ['id', 'class', 'style'],
    'a': ['href', 'target', 'rel', 'title'],
    'img': ['src', 'alt', 'loading', 'title', 'width', 'height'],
    'input': ['type', 'checked', 'disabled'],
    'svg': ['viewBox', 'fill', 'stroke', 'stroke-width', 'width', 'height', 'xmlns'],
    'rect': ['x', 'y', 'rx', 'ry', 'width', 'height', 'fill', 'stroke', 'stroke-width'],
    'path': ['d', 'fill', 'stroke', 'stroke-width'],
    'button': ['onclick'],
    'code': ['class'],
    'pre': ['class'],
    'td': ['colspan', 'rowspan'],
    'th': ['colspan', 'rowspan'],
  },
  // 允许 class 属性中的语法高亮类名（hljs, language-*）
  allowedClasses: {
    'code': ['hljs', 'language-*', 'lang-*'],
    'pre': ['hljs', 'language-*', 'lang-*'],
    'div': ['code-block-wrapper', 'code-block-header', 'table-wrapper', 'code-lang', 'code-copy-btn'],
    'span': ['code-lang'],
    'h1': ['content-header'],
    'h2': ['content-header'],
    'h3': ['content-header'],
    'h4': ['content-header'],
    'h5': ['content-header'],
    'h6': ['content-header'],
    'a': ['content-header-link'],
  },
  // 保留自我关闭标签
  selfClosing: ['img', 'br', 'hr', 'input'],
};

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
// Marked 配置 - 自定义 Renderer + highlight 扩展
// ============================================================================

/**
 * markedHighlight 扩展：代码块语法高亮
 *
 * marked v14+ 移除了 MarkedOptions.highlight 选项，
 * 改用 marked-highlight 扩展实现。
 */
const highlightExtension = markedHighlight({
  highlight(code: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch {
        // fallback
      }
    }
    return hljs.highlightAuto(code).value;
  },
});

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
 * 代码块渲染 - 带语法高亮和复制按钮
 */
renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
  let highlighted: string;
  let language = lang || '';

  if (language && hljs.getLanguage(language)) {
    highlighted = hljs.highlight(text, { language }).value;
  } else {
    highlighted = hljs.highlightAuto(text).value;
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
 *
 * marked v14+ 的 table renderer 接收 Token 对象而非字符串。
 * 我们使用 this.parser.parseInline 来渲染单元格内容。
 */
renderer.table = function (token: { header: Array<{ tokens: unknown[] }>; rows: Array<Array<{ tokens: unknown[] }>> }) {
  let headerHtml = '';
  let bodyHtml = '';

  if (token.header && token.header.length > 0) {
    headerHtml = '<tr>';
    for (const cell of token.header) {
      headerHtml += `<th>${this.parser.parseInline(cell.tokens as any[])}$</th>`;
    }
    headerHtml += '</tr>';
  }

  if (token.rows && token.rows.length > 0) {
    for (const row of token.rows) {
      bodyHtml += '<tr>';
      for (const cell of row) {
        bodyHtml += `<td>${this.parser.parseInline(cell.tokens as any[])}$</td>`;
      }
      bodyHtml += '</tr>';
    }
  }

  return `<div class="table-wrapper"><table><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table></div>`;
};

// ============================================================================
// Marked 全局配置
// ============================================================================

// 先注册 highlight 扩展
marked.use(highlightExtension);

// 再注册自定义 renderer 和其他选项
marked.use({
  renderer,
  gfm: true,
  breaks: false,
});

// ============================================================================
// 公开 API（保持与原版完全兼容）
// ============================================================================

/**
 * 解析 frontmatter（使用 gray-matter 库）
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
 * @param markdown - Markdown 文本（不含 frontmatter）
 * @returns 安全的 HTML 字符串
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n');

  // 使用 marked 解析
  const rawHtml = await marked(normalizedMarkdown);

  // sanitize-html 清理：允许有用的标签和属性
  // 与 v3 版 dompurify 的白名单保持一致，但无需 jsdom 环境
  const cleanHtml = sanitizeHtml(rawHtml, SANITIZE_OPTIONS);

  return cleanHtml;
}

/**
 * 获取指定类型和 ID 的 Markdown 内容
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
 */
export function hasMarkdownContent(type: string, id: string): boolean {
  const dirName = CONTENT_DIRS[type];
  if (!dirName) return false;

  const filePath = path.join(getContentDir(), dirName, `${id}.md`);
  return fs.existsSync(filePath);
}

// ============================================================================
// 新增 API：带 headings 的完整解析
// ============================================================================

/**
 * 从 HTML 中提取标题列表（用于 TOC）
 */
function extractHeadingsFromHtml(html: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const regex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ''),
    });
  }
  return headings;
}

/**
 * 完整解析 Markdown（返回 HTML + frontmatter + headings）
 *
 * @param raw - 原始 Markdown 文本（可包含 frontmatter）
 * @param sanitize - 是否启用 HTML 清洗（默认 true）
 */
export async function parseMarkdown(
  raw: string,
  sanitize = true
): Promise<MarkdownResult> {
  const { frontmatter, content } = parseFrontmatter(raw);

  let html: string;
  if (sanitize) {
    html = await markdownToHtml(content);
  } else {
    // 跳过消毒，直接用 marked 渲染（仅用于可信内容）
    html = await marked(content.replace(/\r\n/g, '\n'));
  }

  const headings = extractHeadingsFromHtml(html);

  return {
    content: html,
    frontmatter,
    headings,
  };
}
