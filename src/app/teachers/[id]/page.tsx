/**
 * 教师详情页面 - 惠州仲恺中学官网
 * 
 * 【改造说明】
 * 1. 支持从 Hexo 获取远程文章
 * 2. 使用 parseFrontmatter 和 markdownToHtml 渲染完整内容
 * 3. 支持博客跳转
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, MarkdownRenderer } from "@/components/school";
import { TEACHERS_DATA, SCHOOL_INFO, BLOG_URL, getPostById, getCombinedPosts } from "@/lib/data";
import { getMarkdownContent, parseFrontmatter, markdownToHtml } from "@/lib/markdown";

export async function generateStaticParams() {
  const posts = await getCombinedPosts('teachers');
  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const localTeacher = TEACHERS_DATA.find((t) => t.id.toString() === id);
  const post = await getPostById('teachers', id);
  
  const title = post?.title || localTeacher?.name;
  if (!title) return { title: "教师未找到" };
  
  return {
    title: `${title} - ${SCHOOL_INFO.name}`,
    description: post?.summary || localTeacher?.description || '',
  };
}

export default async function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 先尝试从本地静态数据获取
  const localTeacher = TEACHERS_DATA.find((t) => t.id.toString() === id);
  
  // 再尝试从合并数据获取（包含远程文章）
  const post = await getPostById('teachers', id);
  
  // 如果两者都没有，返回 404
  if (!localTeacher && !post) {
    notFound();
  }
  
  // 合并数据
  const teacher = post || localTeacher!;
  const isRemote = post?._source === 'remote';
  
  // 尝试读取本地 Markdown 详细内容
  const mdContent = getMarkdownContent('teachers', id);
  
  // 【关键修复】处理 Markdown 渲染逻辑
  let finalHtml = '';
  if (mdContent.exists && mdContent.html) {
    finalHtml = mdContent.html;
  } else if (post?.content) {
    const { content: cleanContent } = parseFrontmatter(post.content);
    finalHtml = markdownToHtml(cleanContent);
  }
  
  // 计算博客跳转链接
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
  
  return (
    <div>
      <PageHeader title="师资力量" subtitle={title} bgImage={teacher.image} />

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
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img src={teacher.image} alt={title} className="w-full h-auto" loading="lazy" />
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
                    <p className="text-gray-700 leading-relaxed">{teacher.description || teacher.summary}</p>
                  </div>
                )}
                
                {/* 远程文章跳转按钮 */}
                {isRemote && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">这篇文章来自博客</h3>
                        <p className="text-sm text-gray-600">点击下方按钮查看博客原贴</p>
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
          </div>
        </div>
      </section>
    </div>
  );
}
