/**
 * ============================================================================
 * 根布局文件 - 惠州仲恺中学官网
 * ============================================================================
 * * 【新手指南】
 * 这是 Next.js 的根布局文件，所有页面都会使用这个布局。
 * * 主要功能：
 * 1. 设置 HTML 语言属性（中文网站使用 zh-CN）
 * 2. 导入全局样式
 * 3. 设置网站元数据（SEO）
 * 4. 包含公共组件（Header、Footer）
 * * 【Next.js App Router 特点】
 * - layout.tsx 是服务端组件，默认不使用 'use client'
 * - metadata 对象用于设置 SEO 元数据
 * - children 是页面内容，由 Next.js 自动传入
 */

import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/school";
import { SCHOOL_INFO, SITE_CONFIG, PAGE_CONFIGS } from "@/lib/data";

// ============================================================================
// 字体配置
// ============================================================================

/**
 * Noto Sans SC - 中文无衬线字体
 * 用于正文内容
 */
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

/**
 * Noto Serif SC - 中文衬线字体
 * 用于标题
 */
const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

// ============================================================================
// 网站元数据配置（SEO）
// ============================================================================

/**
 * metadata - 网站元数据
 * 用于设置网站的 SEO 信息
 * * 【如何修改】
 * - title: 网站标题模板
 * - description: 网站描述
 */
export const metadata: Metadata = {
  // 网站标题模板（页面标题 | 网站名称）
  title: { 
    default: PAGE_CONFIGS.home.title, 
    template: `%s | ${SCHOOL_INFO.name}` 
  },
  
  // 网站描述
  description: PAGE_CONFIGS.home.description,
  
  // 关键词
  keywords: PAGE_CONFIGS.home.keywords,
  
  // 作者信息
  authors: [{ name: SCHOOL_INFO.studentOrgName }],
  
  // 网站图标
  icons: { 
    icon: "/favicon.ico" 
  },
  
  // Open Graph 元数据（用于社交媒体分享）
  openGraph: {
    title: PAGE_CONFIGS.home.title,
    description: PAGE_CONFIGS.home.description,
    url: SITE_CONFIG.url,
    siteName: SCHOOL_INFO.name,
    locale: "zh_CN",
    type: "website",
  },
  
  // 机器人爬虫配置
  robots: { 
    index: true, 
    follow: true 
  },
};

// ============================================================================
// 根布局组件
// ============================================================================

/**
 * RootLayout - 根布局组件
 * * @param children - 页面内容，由 Next.js 自动传入
 */
export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${notoSansSC.variable} ${notoSerifSC.variable} font-sans antialiased`}>
        {/* 页面整体布局 */}
        <div className="flex flex-col min-h-screen">
          
          {/* 顶部导航栏 */}
          <Header />
          
          {/* 主内容区域 */}
          {/* pt-20 为导航栏留出空间 */}
          <main className="flex-grow pt-20">
            {children}
          </main>
          
          {/* 底部页脚 */}
          <Footer />
        </div>
      </body>
    </html>
  );
}