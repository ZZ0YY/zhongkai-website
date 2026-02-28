/**
 * 活动详情页面 - 支持从 content/events/{id}.md 读取详细内容
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
import { EVENTS_DATA, SCHOOL_INFO, SITE_CONFIG, BLOG_URL, getPostById, getCombinedPosts } from "@/lib/data";
import { getMarkdownContent, parseFrontmatter, markdownToHtml } from "@/lib/markdown";

export async function generateStaticParams() {
  const posts = await getCombinedPosts('events');
  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = EVENTS_DATA.find((e) => e.id.toString() === id);
  const post = await getPostById('events', id);
  
  const title = post?.title || event?.title;
  if (!title) return { title: "活动未找到" };
  
  // Canonical URL - 指向官网详情页，避免与博客重复内容
  const canonicalUrl = `${SITE_CONFIG.url}/events/${id}`;
  
  return {
    title: `${title} - ${SCHOOL_INFO.name}`,
    description: post?.summary || event?.description || `${title} - ${event?.location}`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: title,
      description: post?.summary || event?.description || `${title} - ${event?.location}`,
      type: 'article',
      url: canonicalUrl,
      publishedTime: post?.date || event?.date,
      images: [
        {
          url: post?.image || event?.image || '',
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: post?.summary || event?.description || `${title} - ${event?.location}`,
      images: [post?.image || event?.image || ''],
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 先尝试从本地静态数据获取
  const localEvent = EVENTS_DATA.find((e) => e.id.toString() === id);
  
  // 再尝试从合并数据获取（包含远程文章）
  const post = await getPostById('events', id);
  
  // 如果两者都没有，返回 404
  if (!localEvent && !post) {
    notFound();
  }
  
  // 合并数据，优先使用 post 数据
  const event = post || localEvent!;
  const isRemote = post?._source === 'remote';
  
  // 尝试读取本地 Markdown 详细内容
  const mdContent = getMarkdownContent('events', id);
  
  // 【关键修复】处理 Markdown 渲染逻辑
  let finalHtml = '';
  if (mdContent.exists && mdContent.html) {
    finalHtml = mdContent.html;
  } else if (post?.content) {
    // 【关键修复】解析 Hexo 发来的 raw 数据，剥离顶部的 --- yaml 配置 ---
    const { content: cleanContent } = parseFrontmatter(post.content);
    finalHtml = markdownToHtml(cleanContent);
  }
  
  // 【关键修复】计算博客跳转链接
  let blogPostUrl = BLOG_URL;
  if (post?._permalink) {
    blogPostUrl = post._permalink;
  } else if (post?._path) {
    const pathSuffix = post._path.endsWith('/') ? post._path : `${post._path}/`;
    blogPostUrl = `${BLOG_URL}/${pathSuffix}`;
  }
  
  // 动态生成日期显示
  const dateObj = new Date(event.date || Date.now());
  const month = event.month || `${dateObj.getMonth() + 1}月`;
  const day = event.day || String(dateObj.getDate()).padStart(2, '0');
  
  const title = mdContent.exists && mdContent.frontmatter.title 
    ? mdContent.frontmatter.title 
    : event.title;
  
  // 构建 JSON-LD 结构化数据 - Article (活动)
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "image": [
      event.image,
    ],
    "datePublished": event.date,
    "dateModified": event.date,
    "author": {
      "@type": "Organization",
      "name": SCHOOL_INFO.name,
    },
    "publisher": {
      "@type": "Organization",
      "name": SCHOOL_INFO.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_CONFIG.url}/apple-touch-icon.png`,
      },
    },
    "description": event.description || event.summary || title,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/events/${id}`,
    },
  };
  
  return (
    <div>
      {/* JSON-LD 结构化数据 - Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <PageHeader title="校园活动" subtitle={title} bgImage={event.image} />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            <Link href="/events" prefetch={false} className="inline-flex items-center text-zk-blue hover:text-zk-red mb-8">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回活动列表
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold font-serif-sc text-gray-900 mb-6">{title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {mdContent.frontmatter.date || event.date}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {event.location || '学校'}
              </div>
              
              {/* 来源标识 */}
              {isRemote && (
                <span className="bg-blue-100 text-zk-blue px-2 py-1 rounded text-xs">
                  来自博客
                </span>
              )}
            </div>
            
            <div className="mb-8 rounded-lg overflow-hidden">
              <img src={event.image} alt={title} className="w-full h-auto" loading="lazy" />
            </div>
            
            {/* 活动日期卡片 */}
            {!isRemote && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg flex items-center gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center min-w-[80px] shadow-sm">
                  <span className="block text-2xl font-bold text-zk-red">{day}</span>
                  <span className="block text-xs text-gray-500 uppercase">{month}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">活动时间</h3>
                  <p className="text-gray-600">{event.date}</p>
                </div>
              </div>
            )}
            
            {/* 文章正文 */}
            {finalHtml ? (
              <MarkdownRenderer html={finalHtml} />
            ) : (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {event.description || event.summary || `${event.title}于${event.date}在${event.location || '学校'}成功举办。`}
                </p>
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
          </div>
        </div>
      </section>
    </div>
  );
}
