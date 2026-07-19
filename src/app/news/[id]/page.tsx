/**
 * ============================================================================
 * 新闻详情页面 - 增强版
 * ============================================================================
 *
 * 【新增功能】
 * 1. TOC 目录导航（侧边栏）
 * 2. 上下篇导航（prev/next）
 * 3. 暗色模式支持
 * 4. @tailwindcss/typography prose 样式
 * 5. KaTeX 数学公式渲染
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/school";
import { MarkdownRenderer } from "@/components/school/MarkdownRenderer";
import { SCHOOL_INFO, SITE_CONFIG, BLOG_URL, getPostById, getCombinedPosts } from "@/lib/data";
import { getMarkdownContent, parseFrontmatter, markdownToHtml } from "@/lib/markdown";
import { generateBreadcrumbJsonLd, generateSeoTitle, generateCanonicalUrl } from "@/lib/seo";
import type { HeadingItem } from "@/lib/markdown";

// 构建失败的页面回退到请求时动态渲染
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const posts = await getCombinedPosts('news');
    return posts.map((post) => ({
      id: post.id.toString(),
    }));
  } catch (error) {
    console.error('[news/generateStaticParams] 获取数据失败:', error);
    return [];
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = await getPostById('news', id);

    if (!post) return { title: "新闻未找到" };

    const canonicalUrl = `${SITE_CONFIG.url}/news/${id}`;

    return {
      title: generateSeoTitle(post.title),
      description: post.summary || post.title,
      keywords: [post.category || '新闻', SCHOOL_INFO.name],
      alternates: {
        canonical: generateCanonicalUrl(`/news/${id}`),
      },
      openGraph: {
        title: post.title,
        description: post.summary || post.title,
        type: 'article',
        url: canonicalUrl,
        publishedTime: typeof post.date === 'string' ? post.date : new Date(post.date || Date.now()).toISOString(),
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
  } catch (error) {
    console.error('[news/generateMetadata] 生成元数据失败:', error);
    return { title: "新闻动态" };
  }
}

/** 从 HTML 中提取标题列表（用于 TOC） */
function extractHeadingsFromHtml(html: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const regex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      id: match[2],
      text: match[3].replace(/<[^>]*>/g, ''),
    });
  }
  return headings;
}

export default async function NewsDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  let post;

  try {
    post = await getPostById('news', id);
  } catch (error) {
    console.error(`[news/${id}] 获取数据异常:`, error);
    return notFound();
  }

  if (!post) {
    return notFound();
  }

  const isRemote = post._source === 'remote';

  // ========== 解析 Markdown，获取 HTML + headings ==========
  const mdContent = await getMarkdownContent('news', id);

  let finalHtml = '';
  let headings: HeadingItem[] = [];

  if (mdContent.exists && mdContent.html) {
    finalHtml = mdContent.html;
    headings = extractHeadingsFromHtml(finalHtml);
  } else if (post.content) {
    const { content: cleanContent } = parseFrontmatter(post.content);
    finalHtml = await markdownToHtml(cleanContent);
    headings = extractHeadingsFromHtml(finalHtml);
  }

  // ========== 获取上下篇文章 ==========
  let prevPost: { id: string; title: string } | null = null;
  let nextPost: { id: string; title: string } | null = null;
  try {
    const allPosts = await getCombinedPosts('news');
    const currentIndex = allPosts.findIndex(p => p.id.toString() === id);
    if (currentIndex > 0) {
      prevPost = { id: allPosts[currentIndex - 1].id.toString(), title: allPosts[currentIndex - 1].title };
    }
    if (currentIndex < allPosts.length - 1) {
      nextPost = { id: allPosts[currentIndex + 1].id.toString(), title: allPosts[currentIndex + 1].title };
    }
  } catch {
    // 上下篇获取失败不影响页面渲染
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

  // 防御性默认值：确保 postDate 始终是字符串
  const rawDate = post.date;
  const postDate = rawDate
    ? (typeof rawDate === 'string' ? rawDate : new Date(rawDate).toISOString().split('T')[0])
    : new Date().toISOString().split('T')[0];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd('news', title);

  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
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
      "@id": `${SITE_CONFIG.url}/news/${id}`,
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }} />

      <PageHeader title={post.category || '新闻动态'} subtitle={title} bgImage={post.image || ''} as="h2" />

      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            <Link href="/news" prefetch={false} className="inline-flex items-center text-zk-blue hover:text-zk-red dark:text-blue-400 dark:hover:text-blue-300 mb-8">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回新闻列表
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold font-serif-sc text-gray-900 dark:text-gray-100 mb-6">{title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              {post.category && (
                <span className="bg-zk-red text-white px-3 py-1 rounded-full text-xs font-bold">
                  {post.category}
                </span>
              )}
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {postDate}
              </span>
              {post.author && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author}
                </span>
              )}

              <span className={`px-2 py-1 rounded text-xs ${
                isRemote
                  ? 'bg-blue-100 text-zk-blue dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {isRemote ? '来自博客' : '本地文章'}
              </span>
            </div>

            <div className="mb-8 rounded-lg overflow-hidden relative aspect-video bg-gray-100 dark:bg-gray-800">
              <Image src={post.image || ''} alt={title} fill sizes="100vw" className="object-cover" priority />
            </div>

            {/* 使用新版 MarkdownRenderer（集成 TOC + KaTeX + prose） */}
            {finalHtml ? (
              <MarkdownRenderer
                htmlContent={finalHtml}
                headings={headings}
                showToc={true}
                showPrevNext={false}
              />
            ) : (
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br />') || post.summary || '' }} />
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">标签：</span>
                {post.tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="inline-block px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-full text-sm mr-2 mb-2 hover:bg-zk-blue hover:text-white dark:hover:bg-zk-blue dark:hover:text-white transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* 上下篇导航 */}
            {(prevPost || nextPost) && (
              <nav className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center">
                    {prevPost ? (
                      <Link
                        href={`/news/${prevPost.id}`}
                        className="group flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 w-full"
                      >
                        <svg className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-zk-blue dark:group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <div className="min-w-0">
                          <span className="block text-xs text-gray-500 dark:text-gray-400">上一篇</span>
                          <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-zk-blue dark:group-hover:text-blue-400">
                            {prevPost.title}
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex-1" />
                    )}
                  </div>
                  <div className="flex items-center justify-end">
                    {nextPost ? (
                      <Link
                        href={`/news/${nextPost.id}`}
                        className="group flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-right transition-colors hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-600 dark:hover:bg-blue-900/20 w-full"
                      >
                        <div className="min-w-0">
                          <span className="block text-xs text-gray-500 dark:text-gray-400">下一篇</span>
                          <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-zk-blue dark:group-hover:text-blue-400">
                            {nextPost.title}
                          </span>
                        </div>
                        <svg className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-zk-blue dark:group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : (
                      <div className="flex-1" />
                    )}
                  </div>
                </div>
              </nav>
            )}

            {isRemote && (
              <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">这篇文章来自博客</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">点击下方按钮查看博客原贴，获取更多内容</p>
                  </div>
                  <Link href={blogPostUrl} target="_blank" rel="noopener noreferrer"
                    className="px-6 py-3 bg-zk-blue text-white font-bold rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors">
                    查看博客原贴 →
                  </Link>
                </div>
              </div>
            )}

            {!isRemote && (
              <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-700 dark:text-green-400">这是官网原创文章</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
