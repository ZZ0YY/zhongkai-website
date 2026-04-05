/**
 * ============================================================================
 * SEO 工具函数 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【功能说明】
 * - 生成 BreadcrumbList JSON-LD 结构化数据
 * - 生成防关键词堆砌的页面标题
 * - 生成规范化的 canonical URL
 */

import { SITE_CONFIG, SCHOOL_INFO } from './data';

// ============================================================================
// 模块名称映射（面包屑导航使用）
// ============================================================================
const MODULE_LABELS: Record<string, string> = {
  news: '新闻动态',
  events: '校园活动',
  achievements: '办学成果',
  courses: '课程教学',
  teachers: '师资力量',
  software: '教学软件',
};

// ============================================================================
// BreadcrumbList JSON-LD 生成器
// ============================================================================

/**
 * 面包屑导航项
 */
interface BreadcrumbItem {
  /** 显示名称 */
  name: string;
  /** 链接 URL（最后一项可以为 undefined） */
  url?: string;
}

/**
 * 生成 BreadcrumbList JSON-LD 结构化数据
 * 
 * @param moduleName - 模块标识（如 'news', 'events'）
 * @param pageTitle - 当前页面/文章标题
 * @returns BreadcrumbList JSON-LD 对象
 * 
 * @example
 * ```ts
 * // 生成：首页 > 新闻动态 > 文章标题
 * const jsonLd = generateBreadcrumbJsonLd('news', '我校召开新学期会议');
 * ```
 */
export function generateBreadcrumbJsonLd(moduleName: string, pageTitle: string) {
  const moduleLabel = MODULE_LABELS[moduleName] || moduleName;
  
  const items: BreadcrumbItem[] = [
    { name: '首页', url: SITE_CONFIG.url },
    { name: moduleLabel, url: `${SITE_CONFIG.url}/${moduleName}` },
    { name: pageTitle },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url ? { "item": item.url } : {}),
    })),
  };
}

// ============================================================================
// 页面标题生成器（防关键词堆砌）
// ============================================================================

/**
 * 生成 SEO 友好的页面标题
 * 
 * 【核心逻辑】
 * - 如果文章标题已包含学校名称（"惠州仲恺中学"），直接返回文章标题（使用 absolute 避免模板重复）
 * - 否则只返回文章标题，让 layout.tsx 的 title.template 自动追加 ` | 惠州仲恺中学`
 * 
 * @param pageTitle - 文章标题
 * @returns Next.js Metadata 的 title 字段值
 */
export function generateSeoTitle(pageTitle: string) {
  // 检查标题是否已包含学校简称或全称
  const schoolNames = [SCHOOL_INFO.name, SCHOOL_INFO.fullName];
  const alreadyContainsSchool = schoolNames.some(
    name => pageTitle.includes(name)
  );

  if (alreadyContainsSchool) {
    // 标题已含学校名 → 使用 absolute 跳过模板追加，避免 "惠州仲恺中学xxx | 惠州仲恺中学"
    return { absolute: pageTitle };
  }

  // 标题不含学校名 → 返回纯标题，由 layout.tsx 的 template 追加 " | 惠州仲恺中学"
  return pageTitle;
}

// ============================================================================
// Canonical URL 生成器
// ============================================================================

/**
 * 生成绝对路径的 canonical URL
 * 
 * @param path - 页面路径（如 '/news/123'）
 * @returns 绝对路径的 canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  // 确保 path 以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${normalizedPath}`;
}
