/**
 * ============================================================================
 * 新闻详情页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【功能说明】
 * - 支持从 data.ts 读取基础数据
 * - 支持从 content/news/{id}.md 读取详细内容
 * - SEO 友好的静态生成
 * 
 * 【如何添加新闻】
 * 1. 在 src/lib/data.ts 的 NEWS_DATA 中添加基础信息
 * 2. 在 content/news/{id}.md 中创建详细内容文件
 * 
 * 【MD 文件格式】
 * ---
 * title: 文章标题
 * date: 2024-01-15
 * author: 作者名称
 * tags: [标签1, 标签2]
 * ---
 * 
 * # 正文标题
 * 正文内容...
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, MarkdownRenderer, EmptyContent, ContentMeta } from "@/components/school";
import { NEWS_DATA, SCHOOL_INFO } from "@/lib/data";
import { getMarkdownContent } from "@/lib/markdown";

// ============================================================================
// 静态参数生成（SSG）
// ============================================================================

export async function generateStaticParams() {
  return NEWS_DATA.map((news) => ({
    id: news.id.toString(),
  }));
}

// ============================================================================
// 元数据生成（SEO）
// ============================================================================

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  const news = NEWS_DATA.find((n) => n.id.toString() === id);
  
  if (!news) {
    return { title: "新闻未找到" };
  }
  
  return {
    title: `${news.title} - ${SCHOOL_INFO.name}`,
    description: news.summary,
    keywords: [news.category, SCHOOL_INFO.name],
    // Open Graph 社交分享
    openGraph: {
      title: news.title,
      description: news.summary,
      type: 'article',
      publishedTime: news.date,
      authors: [SCHOOL_INFO.name],
      images: [news.image],
    },
  };
}

// ============================================================================
// 页面组件
// ============================================================================

export default async function NewsDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  // 查找新闻基础数据
  const news = NEWS_DATA.find((n) => n.id.toString() === id);
  
  if (!news) {
    notFound();
  }
  
  // 尝试读取 Markdown 详细内容
  const mdContent = getMarkdownContent('news', id);
  
  // 决定使用哪个标题（优先使用 MD 文件中的标题）
  const title = mdContent.exists && mdContent.frontmatter.title 
    ? mdContent.frontmatter.title 
    : news.title;
  
  return (
    <div>
      {/* 页面横幅 */}
      <PageHeader 
        title={news.category} 
        subtitle={title}
        bgImage={news.image}
      />

      {/* 文章内容 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* 返回按钮 */}
            <Link 
              href="/news" 
              prefetch={false}
              className="inline-flex items-center text-zk-blue hover:text-zk-red mb-8"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回新闻列表
            </Link>
            
            {/* 文章标题 */}
            <h1 className="text-3xl md:text-4xl font-bold font-serif-sc text-gray-900 mb-6">
              {title}
            </h1>
            
            {/* 元信息 */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <span className="bg-zk-red text-white px-3 py-1 rounded-full text-xs font-bold">
                {news.category}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {mdContent.frontmatter.date || news.date}
              </span>
              {mdContent.frontmatter.author && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {mdContent.frontmatter.author}
                </span>
              )}
            </div>
            
            {/* 封面图 */}
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={news.image} 
                alt={title} 
                className="w-full h-auto"
                loading="eager"
              />
            </div>
            
            {/* 文章正文 */}
            {mdContent.exists && mdContent.html ? (
              <MarkdownRenderer html={mdContent.html} />
            ) : (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {news.summary}
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  这是新闻的详细内容区域。如需添加完整内容，请在 content/news/{id}.md 文件中编写。
                </p>
              </div>
            )}
            
            {/* 标签 */}
            {mdContent.frontmatter.tags && mdContent.frontmatter.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <span className="text-sm text-gray-500 mr-2">标签：</span>
                {mdContent.frontmatter.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* 分享区域 */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">分享到：</span>
                <div className="flex gap-4">
                  <button className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                    微
                  </button>
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
