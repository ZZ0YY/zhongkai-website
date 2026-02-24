/**
 * ============================================================================
 * 新闻详情页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【修复说明】
 * 1. 远程文章点击跳转到博客时，使用正确的链接格式
 * 2. 修复跳转链接为 BLOG_URL/abbrlink 格式
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, MarkdownRenderer } from "@/components/school";
import { SCHOOL_INFO, PAGE_CONFIGS, BLOG_URL, getCombinedPosts, getPostById } from "@/lib/data";
import { getMarkdownContent } from "@/lib/markdown";

// ============================================================================
// ISR 配置 - 60秒重新验证
// ============================================================================
export const revalidate = 60;

// ============================================================================
// 静态参数生成（SSG）
// ============================================================================

export async function generateStaticParams() {
  const posts = await getCombinedPosts('news');
  return posts.map((post) => ({
    id: post.id.toString(),
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
  const post = await getPostById('news', id);
  
  if (!post) {
    return { title: "新闻未找到" };
  }
  
  return {
    title: `${post.title} - ${SCHOOL_INFO.name}`,
    description: post.summary || post.title,
    keywords: [post.category || '新闻', SCHOOL_INFO.name],
    openGraph: {
      title: post.title,
      description: post.summary || post.title,
      type: 'article',
      publishedTime: post.date,
      authors: post.author ? [post.author] : [SCHOOL_INFO.name],
      images: [post.image],
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
  
  // 获取文章数据
  const post = await getPostById('news', id);
  
  if (!post) {
    notFound();
  }
  
  // 判断文章来源
  const isRemote = post._source === 'remote';
  const blogSlug = post._slug;
  
  // 尝试读取本地 Markdown 详细内容
  const mdContent = getMarkdownContent('news', id);
  
  // 决定使用哪个标题
  const title = mdContent.exists && mdContent.frontmatter.title 
    ? mdContent.frontmatter.title 
    : post.title;
  
  // 博客文章跳转链接：使用 BLOG_URL + slug/abbrlink
  const blogPostUrl = blogSlug ? `${BLOG_URL}/${blogSlug}` : BLOG_URL;
  
  return (
    <div>
      {/* 页面横幅 */}
      <PageHeader 
        title={post.category || '新闻动态'} 
        subtitle={title}
        bgImage={post.image}
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
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              {post.category && (
                <span className="bg-zk-red text-white px-3 py-1 rounded-full text-xs font-bold">
                  {post.category}
                </span>
              )}
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {post.date}
              </span>
              {post.author && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author}
                </span>
              )}
              
              {/* 来源标识 */}
              <span className={`px-2 py-1 rounded text-xs ${
                isRemote 
                  ? 'bg-blue-100 text-zk-blue' 
                  : 'bg-green-100 text-green-600'
              }`}>
                {isRemote ? '来自博客' : '本地文章'}
              </span>
            </div>
            
            {/* 封面图 */}
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.image} 
                alt={title} 
                className="w-full h-auto"
                loading="eager"
              />
            </div>
            
            {/* 文章正文 */}
            {mdContent.exists && mdContent.html ? (
              <MarkdownRenderer html={mdContent.html} />
            ) : post.content ? (
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
              </div>
            ) : (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {post.summary}
                </p>
              </div>
            )}
            
            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <span className="text-sm text-gray-500 mr-2">标签：</span>
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* 远程文章跳转按钮 */}
            {isRemote && blogSlug && (
              <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">这篇文章来自博客</h3>
                    <p className="text-sm text-gray-600">点击下方按钮查看博客原贴，获取更多内容</p>
                  </div>
                  <Link 
                    href={blogPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-zk-blue text-white font-bold rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    查看博客原贴 →
                  </Link>
                </div>
              </div>
            )}
            
            {/* 本地文章提示 */}
            {!isRemote && (
              <div className="mt-12 p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-700">这是官网原创文章</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
