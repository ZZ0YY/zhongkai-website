/**
 * ============================================================================
 * Markdown 内容解析工具 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【功能说明】
 * 这个文件负责：
 * 1. 读取 content/ 目录下的 Markdown 文件
 * 2. 解析 frontmatter（文件头部的元数据）
 * 3. 将 Markdown 转换为 HTML
 * 4. 提供类型安全的内容获取接口
 * 
 * 【目录结构】
 * content/
 * ├── news/           # 新闻文章
 * │   ├── 1.md        # ID 为 1 的新闻
 * │   └── 2.md
 * ├── courses/        # 课程介绍
 * ├── teachers/       # 教师介绍
 * ├── events/         # 活动详情
 * └── achievements/   # 成果展示
 * 
 * 【MD 文件格式示例】
 * ---
 * title: 文章标题
 * date: 2024-01-15
 * author: 作者名称
 * tags: [标签1, 标签2]
 * ---
 * 
 * # 正文标题
 * 
 * 正文内容...
 */

import fs from 'fs';
import path from 'path';

// ============================================================================
// 类型定义
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
  /** 原始 Markdown 文本 */
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
 * 将路由类型映射到实际的文件系统目录
 */
const CONTENT_DIRS: Record<string, string> = {
  news: 'news',
  courses: 'courses',
  teachers: 'teachers',
  events: 'events',
  achievements: 'achievements',
};

/**
 * 获取 content 目录的绝对路径
 * 在服务器端运行时使用
 */
function getContentDir(): string {
  // Next.js 项目根目录
  const projectRoot = process.cwd();
  return path.join(projectRoot, 'content');
}

// ============================================================================
// Markdown 解析函数
// ============================================================================

/**
 * 解析 frontmatter（文件头部的 --- 包裹的元数据）
 * 
 * @param content - Markdown 文件内容
 * @returns { frontmatter, content } - 元数据和正文内容
 * 
 * @example
 * const { frontmatter, content } = parseFrontmatter(`
 * ---
 * title: 标题
 * date: 2024-01-15
 * ---
 * 正文内容
 * `);
 */
function parseFrontmatter(content: string): { frontmatter: MarkdownFrontmatter; content: string } {
  // 默认值
  const defaultResult = { frontmatter: {}, content };
  
  // 检查是否以 --- 开头
  if (!content.startsWith('---')) {
    return defaultResult;
  }
  
  // 查找结束的 ---
  const endIndex = content.indexOf('---', 3);
  if (endIndex === -1) {
    return defaultResult;
  }
  
  // 提取 frontmatter 文本
  const frontmatterText = content.slice(3, endIndex).trim();
  const bodyContent = content.slice(endIndex + 3).trim();
  
  // 解析 frontmatter（简单的键值对解析）
  const frontmatter: MarkdownFrontmatter = {};
  
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = line.slice(0, colonIndex).trim();
    let value: string | string[] = line.slice(colonIndex + 1).trim();
    
    // 处理数组格式 [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^["']|["']$/g, ''));
    }
    
    // 处理引号包裹的字符串
    if (typeof value === 'string') {
      value = value.replace(/^["']|["']$/g, '');
    }
    
    frontmatter[key] = value;
  });
  
  return { frontmatter, content: bodyContent };
}

/**
 * 将 Markdown 转换为 HTML（简化版）
 * 
 * 【性能优化说明】
 * 这是一个轻量级的 Markdown 解析器，不依赖外部库
 * 如果需要更完整的 Markdown 支持，可以安装 remark 或 marked
 * 
 * @param markdown - Markdown 文本
 * @returns HTML 字符串
 */
function markdownToHtml(markdown: string): string {
  let html = markdown;
  
  // -----------------------------------------------------------------------
  // 标题转换：# 标题 → <h1>标题</h1>
  // -----------------------------------------------------------------------
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // -----------------------------------------------------------------------
  // 粗体和斜体
  // -----------------------------------------------------------------------
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // -----------------------------------------------------------------------
  // 链接：[文本](URL) → <a href="URL">文本</a>
  // -----------------------------------------------------------------------
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // -----------------------------------------------------------------------
  // 图片：![alt](URL) → <img src="URL" alt="alt" />
  // -----------------------------------------------------------------------
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />');
  
  // -----------------------------------------------------------------------
  // 代码块：```代码``` → <pre><code>代码</code></pre>
  // -----------------------------------------------------------------------
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  
  // -----------------------------------------------------------------------
  // 行内代码：`代码` → <code>代码</code>
  // -----------------------------------------------------------------------
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // -----------------------------------------------------------------------
  // 引用块：> 文本 → <blockquote>文本</blockquote>
  // -----------------------------------------------------------------------
  html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
  
  // -----------------------------------------------------------------------
  // 无序列表
  // -----------------------------------------------------------------------
  html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // -----------------------------------------------------------------------
  // 有序列表
  // -----------------------------------------------------------------------
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  
  // -----------------------------------------------------------------------
  // 水平线：--- → <hr />
  // -----------------------------------------------------------------------
  html = html.replace(/^---$/gm, '<hr />');
  
  // -----------------------------------------------------------------------
  // 段落：连续的文本包裹在 <p> 中
  // -----------------------------------------------------------------------
  // 将连续的非标签文本包裹在段落中
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inParagraph = false;
  let paragraphContent = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 空行：结束当前段落
    if (trimmedLine === '') {
      if (inParagraph && paragraphContent) {
        processedLines.push(`<p>${paragraphContent}</p>`);
        paragraphContent = '';
        inParagraph = false;
      }
      continue;
    }
    
    // 已经是 HTML 标签的行：结束当前段落，直接添加
    if (trimmedLine.startsWith('<')) {
      if (inParagraph && paragraphContent) {
        processedLines.push(`<p>${paragraphContent}</p>`);
        paragraphContent = '';
        inParagraph = false;
      }
      processedLines.push(trimmedLine);
      continue;
    }
    
    // 普通文本：累积到段落中
    inParagraph = true;
    if (paragraphContent) {
      paragraphContent += ' ' + trimmedLine;
    } else {
      paragraphContent = trimmedLine;
    }
  }
  
  // 处理最后一个段落
  if (inParagraph && paragraphContent) {
    processedLines.push(`<p>${paragraphContent}</p>`);
  }
  
  return processedLines.join('\n');
}

// ============================================================================
// 主要导出函数
// ============================================================================

/**
 * 获取指定类型和 ID 的 Markdown 内容
 * 
 * @param type - 内容类型（news/courses/teachers/events/achievements）
 * @param id - 内容 ID
 * @returns MarkdownContent 对象
 * 
 * @example
 * // 获取 ID 为 1 的新闻内容
 * const content = getMarkdownContent('news', '1');
 * 
 * if (content.exists) {
 *   console.log(content.frontmatter.title);
 *   console.log(content.html);
 * }
 */
export function getMarkdownContent(type: string, id: string): MarkdownContent {
  // 默认返回值
  const notFound: MarkdownContent = {
    frontmatter: {},
    raw: '',
    html: '',
    exists: false,
  };
  
  // 获取目录名
  const dirName = CONTENT_DIRS[type];
  if (!dirName) {
    return notFound;
  }
  
  // 构建文件路径
  const filePath = path.join(getContentDir(), dirName, `${id}.md`);
  
  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    return notFound;
  }
  
  try {
    // 读取文件内容
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    
    // 解析 frontmatter
    const { frontmatter, content } = parseFrontmatter(rawContent);
    
    // 转换为 HTML
    const html = markdownToHtml(content);
    
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
 * @param type - 内容类型
 * @returns ID 数组
 * 
 * @example
 * const newsIds = getMarkdownIds('news');
 * // 返回: ['1', '2', '3']
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
 * @param type - 内容类型
 * @param id - 内容 ID
 * @returns 是否存在
 */
export function hasMarkdownContent(type: string, id: string): boolean {
  const dirName = CONTENT_DIRS[type];
  if (!dirName) return false;
  
  const filePath = path.join(getContentDir(), dirName, `${id}.md`);
  return fs.existsSync(filePath);
}
