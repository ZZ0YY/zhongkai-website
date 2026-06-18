/**
 * ============================================================================
 * 办学成果详情页面 - 修复版
 * ============================================================================
 *
 * 【修复】同 events/[id]/page.tsx，添加防御性代码防止构建时崩溃
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader, MarkdownRenderer } from "@/components/school";
import { SCHOOL_INFO, SITE_CONFIG, BLOG_URL, getPostById, getCombinedPosts } from "@/lib/data";
import { getMarkdownContent, parseFrontmatter, markdownToHtml } from "@/lib/markdown";
import { generateBreadcrumbJsonLd, generateSeoTitle, generateCanonicalUrl } from "@/lib/seo";

// 【关键修复 1】构建失败的页面回退到请求时动态渲染
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const posts = await getCombinedPosts('achievements');
    return posts.map((post) => ({
      id: post.id.toString(),
    }));
  } catch (error) {
    console.error('[achievements/generateStaticParams] 获取数据失败:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = await getPostById('achievements', id);

    if (!post) return { title: "成果未找到" };

    const canonicalUrl = `${SITE_CONFIG.url}/achievements/${id}`;

    return {
      title: generateSeoTitle(post.title),
      description: post.summary || post.title,
      alternates: {
        canonical: generateCanonicalUrl(`/achievements/${id}`),
      },
      openGraph: {
        title: post.title,
        description: post.summary || post.title,
        type: 'article',
        url: canonicalUrl,
        publishedTime: typeof post.date === 'string' ? post.date : new Date(post.date || Date.now()).toISOString(),
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
  } catch (error) {
    console.error('[achievements/generateMetadata] 生成元数据失败:', error);
    return { title: "办学成果" };
  }
}

export default async function AchievementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let post;

  try {
    post = await getPostById('achievements', id);
  } catch (error) {
    console.error(`[achievements/${id}] 获取数据异常:`, error);
    return notFound();
  }

  // 【关键修复】return notFound() 确保中断执行
  if (!post) {
    return notFound();
  }

  const isRemote = post._source === 'remote';

  const mdContent = await getMarkdownContent('achievements', id);

  let finalHtml = '';
  if (mdContent.exists && mdContent.html) {
    finalHtml = mdContent.html;
  } else if (post.content) {
    const { content: cleanContent } = parseFrontmatter(post.content);
    finalHtml = await markdownToHtml(cleanContent);
  }

  let blogPostUrl = BLOG_URL;
  if (post._permalink) {
    blogPostUrl = post._permalink;
  } else if (post._path) {
    const pathSuffix = post._path.endsWith('/') ? post._path : `${post._path}/`;
    blogPostUrl = `${BLOG_URL}/${pathSuffix}`;
  }

  const title = mdContent.exists && mdContent.frontmatter.title
    ? mdContent.frontmatter.title
    : post.title;

  // 【关键修复】防御性默认值
  // 确保 postDate 始终是字符串（远程 API 可能返回 Date 对象）
  const rawDate = post.date;
  const postDate = rawDate
    ? (typeof rawDate === 'string' ? rawDate : new Date(rawDate).toISOString().split('T')[0])
    : new Date().toISOString().split('T')[0];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd('achievements', title);

  const achievementJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "image": [post.image || ''],
    "datePublished": postDate,
    "dateModified": postDate,
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
      "@id": `${SITE_CONFIG.url}/achievements/${id}`,
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(achievementJsonLd) }} />

      <PageHeader title="办学成果" subtitle={title} bgImage={post.image || ''} as="h2" />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            <Link href="/achievements" prefetch={false} className="inline-flex items-center text-zk-blue hover:text-zk-red mb-8">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回成果列表
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold font-serif-sc text-gray-900 mb-6">{title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              {post.category && (
                <span className="bg-zk-gold text-white px-3 py-1 rounded-full text-xs font-bold">
                  {post.category}
                </span>
              )}
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {postDate}
              </span>

              <span className={`px-2 py-1 rounded text-xs ${
                isRemote ? 'bg-blue-100 text-zk-blue' : 'bg-green-100 text-green-600'
              }`}>
                {isRemote ? '来自博客' : '本地文章'}
              </span>
            </div>

            <div className="mb-8 rounded-lg overflow-hidden relative aspect-video bg-gray-100">
              <Image src={post.image || ''} alt={title} fill sizes="100vw" className="object-cover" priority />
            </div>

            {finalHtml ? (
              <MarkdownRenderer html={finalHtml} />
            ) : (
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br />') || post.summary || '' }} />
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <span className="text-sm text-gray-500 mr-2">标签：</span>
                {post.tags.map((tag, index) => (
                  <span key={index} className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm mr-2 mb-2">{tag}</span>
                ))}
              </div>
            )}

            {isRemote && (
              <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">这篇文章来自博客</h3>
                    <p className="text-sm text-gray-600">点击下方按钮查看博客原贴，获取更多内容</p>
                  </div>
                  <Link href={blogPostUrl} target="_blank" rel="noopener noreferrer"
                    className="px-6 py-3 bg-zk-blue text-white font-bold rounded-lg hover:bg-blue-800 transition-colors">
                    查看博客原贴 →
                  </Link>
                </div>
              </div>
            )}

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
