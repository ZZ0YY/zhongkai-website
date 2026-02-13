/**
 * 课程详情页面 - 惠州仲恺中学官网
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/school";
import { COURSES_DATA, SCHOOL_INFO } from "@/lib/data";

export async function generateStaticParams() {
  return COURSES_DATA.map((course) => ({
    id: course.id.toString(),
  }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params;
  const course = COURSES_DATA.find((c) => c.id.toString() === id);
  
  if (!course) {
    return { title: "课程未找到" };
  }
  
  return {
    title: `${course.title} - ${SCHOOL_INFO.name}`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const course = COURSES_DATA.find((c) => c.id.toString() === id);
  
  if (!course) {
    notFound();
  }
  
  return (
    <div>
      <PageHeader 
        title={course.type} 
        subtitle={course.title}
        bgImage={course.image}
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            <Link 
              href="/courses" 
              prefetch={false}
              className="inline-flex items-center text-zk-blue hover:text-zk-red mb-8"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回课程列表
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold font-serif-sc text-gray-900 mb-6">
              {course.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                course.type === '国家课程' ? 'bg-blue-100 text-zk-blue' :
                course.type === '校本课程' ? 'bg-red-100 text-zk-red' : 'bg-yellow-100 text-zk-gold'
              }`}>
                {course.type}
              </span>
            </div>
            
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                {course.description}
              </p>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">课程特色</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {course.features.map((feature, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
