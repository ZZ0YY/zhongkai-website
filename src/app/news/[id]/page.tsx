/**
 * ============================================================================
 * 新闻详情页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【关键修复】
 * 1. 导入 parseFrontmatter 和 markdownToHtml 用于渲染 Hexo 文章
 * 2. 正确处理远程文章的完整 Markdown 源码
 * 3. 修复博客跳转按钮，使用 _permalink 或 _path 精准跳转
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, MarkdownRenderer } from "@/components/school";
import { SCHOOL_INFO, SITE_CONFIG, PAGE_CONFIGS, BLOG_URL, getPostById, getCombinedPosts } from "@/lib/data";
import { getMarkdownContent, parseFrontmatter, markdownToHtml } from "@/lib/markdown";

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
  
  // Canonical URL - 指向官网详情页，避免与博客重复内容
  const canonicalUrl = `${SITE_CONFIG.url}/news/${id}`;
  
  return {
    title: `${post.title} - ${SCHOOL_INFO.name}`,
    description: post.summary || post.title,
    keywords: [post.category || '新闻', SCHOOL_INFO.name],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.summary || post.title,
      type: 'article',
      url: canonicalUrl,
      publishedTime: post.date,
      authors: post.author ? [post.author] : [SCHOOL_INFO.name],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary || post.title,
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
  
  // 尝试读取本地 Markdown 详细内容
  const mdContent = getMarkdownContent('news', id);
  
  // 【关键修复】处理 Markdown 渲染逻辑
  let finalHtml = '';
  if (mdContent.exists && mdContent.html) {
    // 本地优先
    finalHtml = mdContent.html;
  } else if (post.content) {
    // 【关键修复】解析 Hexo 发来的 raw 数据，剥离顶部的 --- yaml 配置 ---
    const { content: cleanContent } = parseFrontmatter(post.content);
    finalHtml = markdownToHtml(cleanContent);
  }
  
  // 【关键修复】计算博客跳转链接
  // 优先使用 Hexo 传来的 permalink，没有则利用 BLOG_URL 和 path 拼接
  let blogPostUrl = BLOG_URL;
  if (post._permalink) {
    blogPostUrl = post._permalink;
  } else if (post._path) {
    // 确保 path 以斜杠结尾
    const pathSuffix = post._path.endsWith('/') ? post._path : `${post._path}/`;
    blogPostUrl = `${BLOG_URL}/${pathSuffix}`;
  }
  
  // 决定使用哪个标题
  const title = mdContent.exists && mdContent.frontmatter.title 
    ? mdContent.frontmatter.title 
    : post.title;
  
  // 构建 JSON-LD 结构化数据 - NewsArticle
  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "image": [
      post.image,
    ],
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": post.author || SCHOOL_INFO.name,
    },
    "publisher": {
      "@type": "Organization",
      "name": SCHOOL_INFO.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_CONFIG.url}/apple-touch-icon.png`,
      },
    },
    "description": post.summary || title,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/news/${id}`,
    },
  };
  
  return (
    <div>
      {/* JSON-LD 结构化数据 - NewsArticle */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
      />
      {/* 页面横幅 - as="h2" 避免与文章标题 h1 冲突 */}
      <PageHeader 
        title={post.category || '新闻动态'} 
        subtitle={title}
        bgImage={post.image}
        as="h2"
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
            {finalHtml ? (
              <MarkdownRenderer html={finalHtml} />
            ) : (
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br />') || post.summary || '' }} />
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
            {isRemote && (
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
