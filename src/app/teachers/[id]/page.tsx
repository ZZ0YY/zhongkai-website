/**
 * 教师详情页面 - 支持从 content/teachers/{id}.md 读取详细内容
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, MarkdownRenderer } from "@/components/school";
import { TEACHERS_DATA, SCHOOL_INFO } from "@/lib/data";
import { getMarkdownContent } from "@/lib/markdown";

export async function generateStaticParams() {
  return TEACHERS_DATA.map((teacher) => ({
    id: teacher.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const teacher = TEACHERS_DATA.find((t) => t.id.toString() === id);
  
  if (!teacher) return { title: "教师未找到" };
  
  return {
    title: `${teacher.name} - ${SCHOOL_INFO.name}`,
    description: teacher.description,
  };
}

export default async function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = TEACHERS_DATA.find((t) => t.id.toString() === id);
  
  if (!teacher) notFound();
  
  const mdContent = getMarkdownContent('teachers', id);
  
  return (
    <div>
      <PageHeader title="师资力量" subtitle={teacher.name} bgImage={`https://picsum.photos/1920/600?random=teacher${teacher.id}`} />

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
                  <img src={teacher.image} alt={teacher.name} className="w-full h-auto" loading="lazy" />
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <h1 className="text-3xl font-bold font-serif-sc text-gray-900 mb-2">{teacher.name}</h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="px-3 py-1 bg-red-100 text-zk-red rounded-full font-medium">{teacher.title}</span>
                  <span className="text-zk-blue font-medium">{teacher.subject}</span>
                </div>
                
                {mdContent.exists && mdContent.html ? (
                  <MarkdownRenderer html={mdContent.html} />
                ) : (
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed">{teacher.description}</p>
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
