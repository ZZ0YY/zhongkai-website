/**
 * ============================================================================
 * 活动详情页面 - 修复版
 * ============================================================================
 *
 * 【修复】prerender TypeError: Cannot read properties of undefined (reading 'date')
 *
 * 根因：generateStaticParams 和页面组件各自独立 fetchHexoPosts()，
 *   两次请求之间远程 API 可能返回不一致结果，导致 post 为 null。
 *
 * 修复要点：
 * 1. dynamicParams = true → 构建失败的页面回退到请求时动态渲染
 * 2. return notFound() 替代裸 notFound() → 确保中断执行
 * 3. try-catch 包裹数据获取 → 防止网络异常导致构建崩溃
 *
 * 【重要】同样的修复模式需要应用到以下页面：
 * - src/app/news/[id]/page.tsx
 * - src/app/teachers/[id]/page.tsx
 * - src/app/achievements/[id]/page.tsx
 * - src/app/courses/[id]/page.tsx
 * - src/app/software/[id]/page.tsx
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader, MarkdownRenderer } from "@/components/school";
import { EVENTS_DATA, SCHOOL_INFO, SITE_CONFIG, BLOG_URL, getPostById, getCombinedPosts } from "@/lib/data";
import { getMarkdownContent, parseFrontmatter, markdownToHtml } from "@/lib/markdown";
import { generateBreadcrumbJsonLd, generateSeoTitle, generateCanonicalUrl } from "@/lib/seo";

// ============================================================================
// 【关键修复 1】dynamicParams = true
// ============================================================================
// 告诉 Next.js：generateStaticParams 返回的 ID 在构建时预渲染，
// 如果预渲染失败，不要报错退出构建，而是在请求时动态渲染。
// 这是解决远程 API 不一致导致构建失败的核心配置。
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const posts = await getCombinedPosts('events');
    return posts.map((post) => ({
      id: post.id.toString(),
    }));
  } catch (error) {
    // 【关键修复 2】如果远程 fetch 失败，返回空数组而不是崩溃
    console.error('[events/generateStaticParams] 获取数据失败:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const event = EVENTS_DATA.find((e) => e.id.toString() === id);
    const post = await getPostById('events', id);

    const title = post?.title || event?.title;
    if (!title) return { title: "活动未找到" };

    const canonicalUrl = `${SITE_CONFIG.url}/events/${id}`;

    return {
      title: generateSeoTitle(title),
      description: post?.summary || event?.description || `${title} - ${event?.location}`,
      alternates: {
        canonical: generateCanonicalUrl(`/events/${id}`),
      },
      openGraph: {
        title: title,
        description: post?.summary || event?.description || `${title} - ${event?.location}`,
        type: 'article',
        url: canonicalUrl,
        publishedTime: typeof post?.date === 'string' ? post.date : typeof event?.date === 'string' ? event.date : new Date(post?.date || event?.date || Date.now()).toISOString(),
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
  } catch (error) {
    console.error('[events/generateMetadata] 生成元数据失败:', error);
    return { title: "校园活动" };
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 【关键修复 3】try-catch 包裹整个数据获取逻辑
  let localEvent;
  let post;

  try {
    localEvent = EVENTS_DATA.find((e) => e.id.toString() === id);
    post = await getPostById('events', id);
  } catch (error) {
    console.error(`[events/${id}] 获取数据异常:`, error);
    notFound();
    return; // TypeScript 需要这行，实际 notFound() 会抛出
  }

  // 【关键修复 4】使用 return notFound() 确保中断执行
  if (!localEvent && !post) {
    return notFound();
  }

  // 合并数据，优先使用 post 数据
  // 【关键修复 5】双重检查，确保 event 不会是 undefined
  const event = post || localEvent;

  // 再次检查（TypeScript 类型安全 + 运行时防御）
  if (!event) {
    return notFound();
  }

  const isRemote = post?._source === 'remote';

  // 尝试读取本地 Markdown 详细内容
  const mdContent = await getMarkdownContent('events', id);

  // 处理 Markdown 渲染逻辑
  let finalHtml = '';
  if (mdContent.exists && mdContent.html) {
    finalHtml = mdContent.html;
  } else if (post?.content) {
    const { content: cleanContent } = parseFrontmatter(post.content);
    finalHtml = await markdownToHtml(cleanContent);
  }

  // 计算博客跳转链接
  let blogPostUrl = BLOG_URL;
  if (post?._permalink) {
    blogPostUrl = post._permalink;
  } else if (post?._path) {
    const pathSuffix = post._path.endsWith('/') ? post._path : `${post._path}/`;
    blogPostUrl = `${BLOG_URL}/${pathSuffix}`;
  }

  // 【关键修复 6】防御性访问 .date，提供默认值
  // 确保 eventDate 始终是字符串（远程 API 可能返回 Date 对象）
  const rawDate = event.date;
  const eventDate = rawDate
    ? (typeof rawDate === 'string' ? rawDate : new Date(rawDate).toISOString().split('T')[0])
    : new Date().toISOString().split('T')[0];
  const dateObj = new Date(eventDate);
  const month = event.month || `${dateObj.getMonth() + 1}月`;
  const day = event.day || String(dateObj.getDate()).padStart(2, '0');

  const title = mdContent.exists && mdContent.frontmatter.title
    ? mdContent.frontmatter.title
    : event.title || '校园活动';

  // 构建 JSON-LD 结构化数据 - BreadcrumbList
  const breadcrumbJsonLd = generateBreadcrumbJsonLd('events', title);

  // 构建 JSON-LD 结构化数据 - Article (活动)
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "image": [event.image || ''],
    "datePublished": eventDate,
    "dateModified": eventDate,
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
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      {/* 页面横幅 */}
      <PageHeader title="校园活动" subtitle={title} bgImage={event.image || ''} as="h2" />

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
                {mdContent.frontmatter.date ? new Date(mdContent.frontmatter.date).toLocaleDateString('zh-CN') : eventDate}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {event.location || '学校'}
              </div>

              {isRemote && (
                <span className="bg-blue-100 text-zk-blue px-2 py-1 rounded text-xs">
                  来自博客
                </span>
              )}
            </div>

            <div className="mb-8 rounded-lg overflow-hidden relative aspect-video bg-gray-100">
              <Image
                src={event.image || ''}
                alt={title}
                fill
                sizes="100vw"
                className="object-cover"
              />
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
                  <p className="text-gray-600">{eventDate}</p>
                </div>
              </div>
            )}

            {/* 文章正文 */}
            {finalHtml ? (
              <MarkdownRenderer html={finalHtml} />
            ) : (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {event.description || event.summary || `${title}于${eventDate}在${event.location || '学校'}成功举办。`}
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

            {/* 返回列表 */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link href="/events" prefetch={false} className="text-zk-blue hover:text-zk-red transition-colors">
                ← 返回活动列表
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
