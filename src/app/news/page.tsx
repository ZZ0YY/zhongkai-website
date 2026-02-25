/**
 * ============================================================================
 * 新闻动态页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【改造说明】
 * 1. 改为 async 函数，支持动态渲染
 * 2. 使用 getCombinedPosts 获取混合数据（本地 + Hexo 远程）
 * 3. 支持远程文章的完整展示
 */

import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/school";
import { PAGE_CONFIGS, getCombinedPosts } from "@/lib/data";

// ============================================================================
// 页面元数据（SEO）
// ============================================================================
export const metadata: Metadata = {
  title: PAGE_CONFIGS.news.title,
  description: PAGE_CONFIGS.news.description,
  keywords: PAGE_CONFIGS.news.keywords,
};

// ============================================================================
// 新闻动态页面组件（改为 async 动态渲染）
// ============================================================================
export default async function NewsPage() {
  // 获取合并后的文章数据（本地 + Hexo 远程）
  const posts = await getCombinedPosts('news');
  
  return (
    <div>
      
      {/* 页面横幅 */}
      <PageHeader 
        title="新闻动态" 
        subtitle="关注校园实时资讯，了解仲恺最新动态"
        bgImage={`https://picsum.photos/1920/600?random=news`}
      />

      {/* 新闻列表 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          
          {/*
            新闻卡片网格布局
            - 响应式设计：手机1列，平板2列，桌面3列
            - 每个卡片包含：图片、分类标签、日期、标题、摘要
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((news) => (
              <div 
                key={news.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* 新闻图片 */}
                <div className="h-48 overflow-hidden relative group">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  
                  {/* 分类标签 */}
                  <span className="absolute top-4 left-4 bg-zk-red text-white text-xs font-bold px-3 py-1 rounded-full">
                    {news.category || '新闻动态'}
                  </span>
                  
                  {/* 远程文章标识 */}
                  {news._source === 'remote' && (
                    <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                      博客
                    </span>
                  )}
                </div>
                
                {/* 新闻信息 */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* 日期 */}
                  <div className="text-sm text-gray-500 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {news.date}
                  </div>
                  
                  {/* 标题 */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 hover:text-zk-blue">
                    <Link href={`/news/${news.id}`}>{news.title}</Link>
                  </h3>
                  
                  {/* 摘要 */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {news.summary}
                  </p>
                  
                  {/* 阅读更多按钮 */}
                  <Link 
                    href={`/news/${news.id}`} 
                    className="inline-block text-center w-full py-2 border border-gray-200 rounded text-sm font-bold text-gray-600 hover:bg-zk-red hover:text-white hover:border-zk-red transition-colors mt-auto"
                  >
                    阅读更多
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* 空状态提示 */}
          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p>暂无新闻动态</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
