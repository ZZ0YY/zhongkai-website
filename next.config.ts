/**
 * ============================================================================
 * Next.js 配置文件 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【新手指南】
 * 这个文件是 Next.js 的核心配置文件，包含：
 * - 重定向规则（保护SEO权重）
 * - 构建配置
 * - TypeScript 配置
 * 
 * 【SEO权重迁移说明】
 * 原网站使用 .html 后缀的URL（如 /teacher.html）
 * 新网站使用无后缀的URL（如 /teachers）
 * 
 * 通过 301 永久重定向，可以将原网站的SEO权重转移到新网站
 * 301重定向告诉搜索引擎：页面已永久移动到新地址
 * 
 * 【URL映射关系】
 * 原网站                    →  新网站
 * /index.html              →  /
 * /about.html              →  /about
 * /blog.html               →  /news
 * /contact.html            →  /contact
 * /courses.html            →  /courses
 * /events.html             →  /events
 * /teacher.html            →  /teachers
 * /notice.html             →  /news
 * /research.html           →  /achievements
 * /scholarship.html        →  /achievements
 * /blog-single.html        →  /news
 * /course-single.html      →  /courses
 * /event-single.html       →  /events
 * /teacher-single.html     →  /teachers
 * /notice-single.html      →  /news
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 输出模式：standalone 适合 Docker 部署
  output: "standalone",
  
  // TypeScript 配置
  typescript: {
    // 忽略构建错误（开发阶段，生产环境建议关闭）
    ignoreBuildErrors: true,
  },
  
  // React 严格模式
  reactStrictMode: false,
  
  // ========================================================================
  // 301 重定向配置 - 保护 SEO 权重
  // ========================================================================
  /**
   * redirects - 重定向配置
   * 
   * 【重要说明】
   * - permanent: true 表示 301 永久重定向
   * - 301重定向会将原页面的SEO权重转移到新页面
   * - 搜索引擎会更新索引，将旧URL替换为新URL
   * 
   * 【如何添加新重定向】
   * 在数组中添加新对象：
   * {
   *   source: '/old-page.html',
   *   destination: '/new-page',
   *   permanent: true,  // true = 301永久重定向
   * }
   */
  async redirects() {
    return [
      // -------------------------------------------------------------------
      // 主要页面重定向
      // -------------------------------------------------------------------
      
      /**
       * 首页重定向
       * /index.html → /
       */
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      
      /**
       * 学校概况
       * /about.html → /about
       */
      {
        source: '/about.html',
        destination: '/about',
        permanent: true,
      },
      
      /**
       * 新闻动态
       * /blog.html → /news
       */
      {
        source: '/blog.html',
        destination: '/news',
        permanent: true,
      },
      
      /**
       * 联系我们
       * /contact.html → /contact
       */
      {
        source: '/contact.html',
        destination: '/contact',
        permanent: true,
      },
      
      /**
       * 课程教学
       * /courses.html → /courses
       */
      {
        source: '/courses.html',
        destination: '/courses',
        permanent: true,
      },
      
      /**
       * 校园活动
       * /events.html → /events
       */
      {
        source: '/events.html',
        destination: '/events',
        permanent: true,
      },
      
      /**
       * 师资力量
       * /teacher.html → /teachers
       * 注意：原URL是单数，新URL是复数
       */
      {
        source: '/teacher.html',
        destination: '/teachers',
        permanent: true,
      },
      
      /**
       * 通知公告
       * /notice.html → /news
       * 通知公告合并到新闻动态页面
       */
      {
        source: '/notice.html',
        destination: '/news',
        permanent: true,
      },
      
      /**
       * 办学成果
       * /research.html → /achievements
       */
      {
        source: '/research.html',
        destination: '/achievements',
        permanent: true,
      },
      
      /**
       * 学校荣誉
       * /scholarship.html → /achievements
       * 荣誉展示合并到办学成果页面
       */
      {
        source: '/scholarship.html',
        destination: '/achievements',
        permanent: true,
      },
      
      // -------------------------------------------------------------------
      // 详情页面重定向
      // 由于原详情页面没有具体的ID参数，重定向到列表页面
      // -------------------------------------------------------------------
      
      /**
       * 新闻详情
       * /blog-single.html → /news
       */
      {
        source: '/blog-single.html',
        destination: '/news',
        permanent: true,
      },
      
      /**
       * 课程详情
       * /course-single.html → /courses
       */
      {
        source: '/course-single.html',
        destination: '/courses',
        permanent: true,
      },
      
      /**
       * 活动详情
       * /event-single.html → /events
       */
      {
        source: '/event-single.html',
        destination: '/events',
        permanent: true,
      },
      
      /**
       * 教师详情
       * /teacher-single.html → /teachers
       */
      {
        source: '/teacher-single.html',
        destination: '/teachers',
        permanent: true,
      },
      
      /**
       * 通知详情
       * /notice-single.html → /news
       */
      {
        source: '/notice-single.html',
        destination: '/news',
        permanent: true,
      },
      
      // -------------------------------------------------------------------
      // 404 页面重定向
      // -------------------------------------------------------------------
      
      /**
       * 404 页面
       * /404.html → / (或自定义404页面)
       */
      {
        source: '/404.html',
        destination: '/',
        permanent: false, // 404 使用临时重定向
      },
    ];
  },
};

export default nextConfig;
