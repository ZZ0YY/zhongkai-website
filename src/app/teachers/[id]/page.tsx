/**
 * ============================================================================
 * 教师详情页面 - 修复版
 * ============================================================================
 *
 * 【修复】同 events/[id]/page.tsx，添加防御性代码防止构建时崩溃
 */

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader, MarkdownRenderer } from "@/components/school";
import { TEACHERS_DATA, SCHOOL_INFO, SITE_CONFIG, BLOG_URL, getPostById, getCombinedPosts } from "@/lib/data";
import { getMarkdownContent, parseFrontmatter, markdownToHtml } from "@/lib/markdown";
import { generateBreadcrumbJsonLd, generateSeoTitle, generateCanonicalUrl } from "@/lib/seo";

// 【关键修复 1】构建失败的页面回退到请求时动态渲染
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const posts = await getCombinedPosts('teachers');
    return posts.map((post) => ({
      id: post.id.toString(),
    }));
  } catch (error) {
    console.error('[teachers/generateStaticParams] 获取数据失败:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const localTeacher = TEACHERS_DATA.find((t) => t.id.toString() === id);
    const post = await getPostById('teachers', id);

    const title = post?.title || localTeacher?.name;
    if (!title) return { title: "教师未找到" };

    const canonicalUrl = `${SITE_CONFIG.url}/teachers/${id}`;

    return {
      title: generateSeoTitle(title),
      description: post?.summary || localTeacher?.description || '',
      alternates: {
        canonical: generateCanonicalUrl(`/teachers/${id}`),
      },
      openGraph: {
        title: title,
        description: post?.summary || localTeacher?.description || '',
        type: 'profile',
        url: canonicalUrl,
        images: [
          {
            url: post?.image || localTeacher?.image || '',
            width: 1200,
            height: 630,
            alt: title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: post?.summary || localTeacher?.description || '',
        images: [post?.image || localTeacher?.image || ''],
      },
    };
  } catch (error) {
    console.error('[teachers/generateMetadata] 生成元数据失败:', error);
    return { title: "师资力量" };
  }
}

export default async function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let localTeacher;
  let post;

  try {
    localTeacher = TEACHERS_DATA.find((t) => t.id.toString() === id);
    post = await getPostById('teachers', id);
  } catch (error) {
    console.error(`[teachers/${id}] 获取数据异常:`, error);
    return notFound();
  }

  // 【关键修复】return notFound() 确保中断执行
  if (!localTeacher && !post) {
    return notFound();
  }

  const teacher = post || localTeacher;
  if (!teacher) {
    return notFound();
  }

  const isRemote = post?._source === 'remote';

  const mdContent = await getMarkdownContent('teachers', id);

  let finalHtml = '';
  if (mdContent.exists && mdContent.html) {
    finalHtml = mdContent.html;
  } else if (post?.content) {
    const { content: cleanContent } = parseFrontmatter(post.content);
    finalHtml = await markdownToHtml(cleanContent);
  }

  let blogPostUrl = BLOG_URL;
  if (post?._permalink) {
    blogPostUrl = post._permalink;
  } else if (post?._path) {
    const pathSuffix = post._path.endsWith('/') ? post._path : `${post._path}/`;
    blogPostUrl = `${BLOG_URL}/${pathSuffix}`;
  }

  const title = mdContent.exists && mdContent.frontmatter.title
    ? mdContent.frontmatter.title
    : (localTeacher?.name || post?.title || '教师详情');

  const breadcrumbJsonLd = generateBreadcrumbJsonLd('teachers', title);

  // 【关键修复】防御性默认值，防止 teacher.image 等为 undefined
  const teacherJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": title,
    "image": teacher.image || '',
    "jobTitle": localTeacher?.title_field || localTeacher?.title || '教师',
    "worksFor": {
      "@type": "School",
      "name": SCHOOL_INFO.name,
    },
    "description": teacher.description || teacher.summary || '',
    "mainEntityOfPage": {
      "@type": "ProfilePage",
      "@id": `${SITE_CONFIG.url}/teachers/${id}`,
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(teacherJsonLd) }} />

      <PageHeader title="师资力量" subtitle={title} bgImage={teacher.image || ''} as="h2" />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            <Link href="/teachers" prefetch={false} className="inline-flex items-center text-zk-blue hover:text-zk-red mb-8">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回教师列表
            </Link>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <div className="rounded-lg overflow-hidden shadow-lg relative aspect-[3/4] bg-gray-100">
                  <Image src={teacher.image || ''} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <h1 className="text-3xl font-bold font-serif-sc text-gray-900 mb-2">{title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  {localTeacher && (
                    <>
                      <span className="px-3 py-1 bg-red-100 text-zk-red rounded-full font-medium">{localTeacher.title}</span>
                      {localTeacher.subject && (
                        <span className="text-zk-blue font-medium">{localTeacher.subject}</span>
                      )}
                    </>
                  )}
                  {isRemote && (
                    <span className="bg-blue-100 text-zk-blue px-2 py-1 rounded text-xs">
                      来自博客
                    </span>
                  )}
                </div>

                {finalHtml ? (
                  <MarkdownRenderer html={finalHtml} />
                ) : (
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed">{teacher.description || teacher.summary || ''}</p>
                  </div>
                )}

                {isRemote && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">这篇文章来自博客</h3>
                        <p className="text-sm text-gray-600">点击下方按钮查看博客原贴</p>
                      </div>
                      <Link href={blogPostUrl} target="_blank" rel="noopener noreferrer"
                        className="px-6 py-3 bg-zk-blue text-white font-bold rounded-lg hover:bg-blue-800 transition-colors">
                        查看博客原贴 →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
