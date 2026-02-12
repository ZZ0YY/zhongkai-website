/**
 * ============================================================================
 * 新闻动态页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【新手指南】
 * 这是新闻动态列表页面，展示所有新闻。
 * 
 * 【如何修改内容】
 * 修改 src/lib/data.ts 中的 NEWS_DATA 即可更新新闻列表
 * 
 * 【未来功能扩展】
 * - 添加分页功能
 * - 添加分类筛选
 * - 添加搜索功能
 * - 添加新闻详情页
 */

import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/school";
import { NEWS_DATA, PAGE_CONFIGS } from "@/lib/data";

// ============================================================================
// 页面元数据（SEO）
// ============================================================================
export const metadata: Metadata = {
  title: PAGE_CONFIGS.news.title,
  description: PAGE_CONFIGS.news.description,
  keywords: PAGE_CONFIGS.news.keywords,
};

// ============================================================================
// 新闻动态页面组件
// ============================================================================
export default function NewsPage() {
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
            {NEWS_DATA.map((news) => (
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
                    {news.category}
                  </span>
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
        </div>
      </section>
    </div>
  );
}
