/**
 * 活动详情页面 - 支持从 content/events/{id}.md 读取详细内容
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, MarkdownRenderer } from "@/components/school";
import { EVENTS_DATA, SCHOOL_INFO } from "@/lib/data";
import { getMarkdownContent } from "@/lib/markdown";

export async function generateStaticParams() {
  return EVENTS_DATA.map((event) => ({
    id: event.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = EVENTS_DATA.find((e) => e.id.toString() === id);
  
  if (!event) return { title: "活动未找到" };
  
  return {
    title: `${event.title} - ${SCHOOL_INFO.name}`,
    description: event.description || `${event.title} - ${event.location}`,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = EVENTS_DATA.find((e) => e.id.toString() === id);
  
  if (!event) notFound();
  
  const mdContent = getMarkdownContent('events', id);
  
  const title = mdContent.exists && mdContent.frontmatter.title 
    ? mdContent.frontmatter.title 
    : event.title;
  
  return (
    <div>
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
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
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
                {mdContent.frontmatter.location || event.location}
              </div>
            </div>
            
            <div className="mb-8 rounded-lg overflow-hidden">
              <img src={event.image} alt={title} className="w-full h-auto" loading="lazy" />
            </div>
            
            {mdContent.exists && mdContent.html ? (
              <MarkdownRenderer html={mdContent.html} />
            ) : (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {event.description || `${event.title}于${event.date}在${event.location}成功举办。`}
                </p>
                <p className="text-gray-500 italic">详细内容请在 content/events/{id}.md 文件中编写。</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
