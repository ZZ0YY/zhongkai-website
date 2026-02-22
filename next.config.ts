/**
 * ============================================================================
 * Next.js 配置文件 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【配置说明】
 * - assetPrefix: 生产环境下使用 CDN 加速静态资源
 * - images: 图片优化配置，支持多个图床域名
 * - redirects: 301 重定向保护 SEO 权重
 * 
 * 【CDN 配置】
 * 生产环境下，静态资源将通过 cdn.20080601.xyz 加载
 * 
 * 【图床域名】
 * - cdn.20080601.xyz: CDN 域名
 * - picsum.photos: 占位图服务
 * - p.inari.site: 常用图床
 */

import type { NextConfig } from "next";

// 判断是否为生产环境
const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // ========================================================================
  // 输出模式
  // ========================================================================
  output: "standalone",
  
  // ========================================================================
  // CDN 资源前缀配置
  // 生产环境下静态资源通过 CDN 加载
  // ========================================================================
  assetPrefix: isProd ? 'https://cdn.20080601.xyz' : undefined,
  
  // ========================================================================
  // 跨域支持
  // 确保 CDN 资源在主站加载时不会触发 CORS 问题
  // ========================================================================
  crossOrigin: 'anonymous',
  
  // ========================================================================
  // 图片配置
  // ========================================================================
  images: {
    // 生产环境下禁用 Next.js 图片优化（使用 CDN 处理）
    unoptimized: isProd,
    
    // 使用 remotePatterns 替代 domains（Next.js 推荐）
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.20080601.xyz',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'p.inari.site',
      },
      {
        protocol: 'https',
        hostname: '*.inari.site',
      },
      {
        protocol: 'https',
        hostname: '*.20080601.xyz',
      },
    ],
    
    // 保留 domains 以兼容旧版本
    domains: [
      'cdn.20080601.xyz',
      'picsum.photos',
      'photo.20080601.xyz',
      'photo1.20080601.xyz',
    ],
  },
  
  // ========================================================================
  // TypeScript 配置
  // ========================================================================
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ========================================================================
  // React 严格模式
  // ========================================================================
  reactStrictMode: false,
  
  // ========================================================================
  // 301 重定向配置 - 保护 SEO 权重
  // ========================================================================
  async redirects() {
    return [
      // -------------------------------------------------------------------
      // 主要页面重定向
      // -------------------------------------------------------------------
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/blog.html', destination: '/news', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/courses.html', destination: '/courses', permanent: true },
      { source: '/events.html', destination: '/events', permanent: true },
      { source: '/teacher.html', destination: '/teachers', permanent: true },
      { source: '/notice.html', destination: '/news', permanent: true },
      { source: '/research.html', destination: '/achievements', permanent: true },
      { source: '/scholarship.html', destination: '/achievements', permanent: true },
      
      // -------------------------------------------------------------------
      // 详情页面重定向
      // -------------------------------------------------------------------
      { source: '/blog-single.html', destination: '/news', permanent: true },
      { source: '/course-single.html', destination: '/courses', permanent: true },
      { source: '/event-single.html', destination: '/events', permanent: true },
      { source: '/teacher-single.html', destination: '/teachers', permanent: true },
      { source: '/notice-single.html', destination: '/news', permanent: true },
      
      // -------------------------------------------------------------------
      // 404 页面重定向
      // -------------------------------------------------------------------
      { source: '/404.html', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
