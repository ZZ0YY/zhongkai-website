/**
 * ============================================================================
 * 新闻详情页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【新手指南】
 * 这是新闻详情页面的模板，使用动态路由 [id] 来匹配不同的新闻。
 * 
 * 【动态路由说明】
 * - 文件名 [id] 表示这是一个动态路由参数
 * - 访问 /news/1 时，params.id 为 "1"
 * - 访问 /news/2 时，params.id 为 "2"
 * 
 * 【generateStaticParams 说明】
 * - 这个函数用于生成静态页面
 * - 在构建时会为每个新闻生成一个静态页面
 * - 有利于 SEO 和页面加载速度
 * 
 * 【未来功能扩展】
 * - 添加评论功能
 * - 添加分享功能
 * - 添加相关新闻推荐
 * - 添加阅读量统计
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/school";
import { NEWS_DATA, SCHOOL_INFO } from "@/lib/data";

// ============================================================================
// 生成静态参数
// 用于在构建时生成所有新闻的静态页面
// ============================================================================
export async function generateStaticParams() {
  return NEWS_DATA.map((news) => ({
    id: news.id.toString(),
  }));
}

// ============================================================================
// 页面元数据（SEO）
// 为每个新闻页面生成独立的元数据
// ============================================================================
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  const news = NEWS_DATA.find((n) => n.id.toString() === id);
  
  if (!news) {
    return {
      title: "新闻未找到",
    };
  }
  
  return {
    title: `${news.title} - ${SCHOOL_INFO.name}`,
    description: news.summary,
    keywords: [news.category, SCHOOL_INFO.name],
  };
}

// ============================================================================
// 新闻详情页面组件
// ============================================================================
export default async function NewsDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  // 查找新闻数据
  const news = NEWS_DATA.find((n) => n.id.toString() === id);
  
  // 如果新闻不存在，返回 404 页面
  if (!news) {
    notFound();
  }
  
  return (
    <div>
      
      {/* 页面横幅 */}
      <PageHeader 
        title={news.category} 
        subtitle={news.title}
        bgImage={news.image}
      />

      {/* 新闻内容 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* 返回按钮 */}
            <Link 
              href="/news" 
              className="inline-flex items-center text-zk-blue hover:text-zk-red mb-8"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回新闻列表
            </Link>
            
            {/* 新闻标题 */}
            <h1 className="text-3xl md:text-4xl font-bold font-serif-sc text-gray-900 mb-6">
              {news.title}
            </h1>
            
            {/* 新闻元信息 */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <span className="bg-zk-red text-white px-3 py-1 rounded-full text-xs font-bold">
                {news.category}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {news.date}
              </span>
            </div>
            
            {/* 新闻封面图 */}
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={news.image} 
                alt={news.title} 
                className="w-full h-auto"
              />
            </div>
            
            {/* 新闻正文 */}
            {/*
              目前使用摘要作为正文内容
              未来可以添加完整的新闻内容字段
            */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                {news.summary}
              </p>
              
              {/*
                占位内容 - 实际使用时替换为真实新闻内容
                可以添加更多段落、图片、视频等
              */}
              <p className="text-gray-700 leading-relaxed mb-6">
                这是新闻的详细内容区域。在实际使用中，您可以在这里添加完整的新闻正文内容。
                新闻内容可以包含多个段落、图片、视频等多媒体元素。
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                惠州仲恺中学一直致力于为学生提供优质的教育资源和广阔的发展平台。
                我们相信每一位学生都有无限的潜力，只需要适当的引导和培养。
              </p>
            </div>
            
            {/* 分享区域（预留） */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">分享到：</span>
                <div className="flex gap-4">
                  {/* 微信分享按钮（预留） */}
                  <button className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                    微
                  </button>
                  {/* 微博分享按钮（预留） */}
                  <button className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    微
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
