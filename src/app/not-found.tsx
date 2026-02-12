/**
 * ============================================================================
 * 404 页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【新手指南】
 * 这是自定义的404页面，当用户访问不存在的页面时会显示。
 * 
 * 【SEO说明】
 * - 404页面应该返回404状态码（Next.js自动处理）
 * - 提供有用的导航链接，帮助用户找到需要的内容
 * - 友好的错误提示，减少用户流失
 * 
 * 【如何测试】
 * 访问任意不存在的URL，如 /this-page-does-not-exist
 */

import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "页面未找到",
  description: "抱歉，您访问的页面不存在。请返回首页或使用导航菜单查找您需要的内容。",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        {/* 404 数字 */}
        <div className="mb-8">
          <span className="text-9xl font-bold text-zk-red">404</span>
        </div>
        
        {/* 错误信息 */}
        <h1 className="text-3xl font-bold font-serif-sc text-gray-900 mb-4">
          页面未找到
        </h1>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在或已被移动。请检查URL是否正确，或使用下面的链接返回。
        </p>
        
        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="px-8 py-3 bg-zk-red text-white font-bold rounded-lg hover:bg-red-800 transition-colors"
          >
            返回首页
          </Link>
          
          <Link 
            href="/contact"
            className="px-8 py-3 border-2 border-zk-blue text-zk-blue font-bold rounded-lg hover:bg-zk-blue hover:text-white transition-colors"
          >
            联系我们
          </Link>
        </div>
        
        {/* 快速链接 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 mb-4">您可能在寻找：</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/about" className="text-zk-blue hover:text-zk-red transition-colors">
              学校概况
            </Link>
            <Link href="/news" className="text-zk-blue hover:text-zk-red transition-colors">
              新闻动态
            </Link>
            <Link href="/teachers" className="text-zk-blue hover:text-zk-red transition-colors">
              师资力量
            </Link>
            <Link href="/courses" className="text-zk-blue hover:text-zk-red transition-colors">
              课程教学
            </Link>
            <Link href="/events" className="text-zk-blue hover:text-zk-red transition-colors">
              校园活动
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
