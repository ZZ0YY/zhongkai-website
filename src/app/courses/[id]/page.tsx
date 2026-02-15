/**
 * ============================================================================
 * 课程详情页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【如何添加课程详情】
 * 1. 在 src/lib/data.ts 的 COURSES_DATA 中添加基础信息
 * 2. 在 content/courses/{id}.md 中创建详细内容文件
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, MarkdownRenderer } from "@/components/school";
import { COURSES_DATA, SCHOOL_INFO } from "@/lib/data";
import { getMarkdownContent } from "@/lib/markdown";

export async function generateStaticParams() {
  return COURSES_DATA.map((course) => ({
    id: course.id.toString(),
  }));
}

export async function generateMetadata({ 
  params 
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const course = COURSES_DATA.find((c) => c.id.toString() === id);
  
  if (!course) return { title: "课程未找到" };
  
  return {
    title: `${course.title} - ${SCHOOL_INFO.name}`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ 
  params 
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = COURSES_DATA.find((c) => c.id.toString() === id);
  
  if (!course) notFound();
  
  const mdContent = getMarkdownContent('courses', id);
  
  const title = mdContent.exists && mdContent.frontmatter.title 
    ? mdContent.frontmatter.title 
    : course.title;
  
  return (
    <div>
      <PageHeader title={course.type} subtitle={title} bgImage={course.image} />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            <Link href="/courses" prefetch={false} className="inline-flex items-center text-zk-blue hover:text-zk-red mb-8">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回课程列表
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold font-serif-sc text-gray-900 mb-6">{title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                course.type === '国家课程' ? 'bg-blue-100 text-zk-blue' :
                course.type === '校本课程' ? 'bg-red-100 text-zk-red' : 'bg-yellow-100 text-zk-gold'
              }`}>{course.type}</span>
            </div>
            
            <div className="mb-8 rounded-lg overflow-hidden">
              <img src={course.image} alt={title} className="w-full h-auto" loading="lazy" />
            </div>
            
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">课程特色</h3>
              <div className="flex flex-wrap gap-2">
                {course.features.map((feature, index) => (
                  <span key={index} className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200">{feature}</span>
                ))}
              </div>
            </div>
            
            {mdContent.exists && mdContent.html ? (
              <MarkdownRenderer html={mdContent.html} />
            ) : (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">{course.description}</p>
                <p className="text-gray-500 italic">详细内容请在 content/courses/{id}.md 文件中编写。</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
