/**
 * ============================================================================
 * 课程教学页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【新手指南】
 * 这是课程教学列表页面，展示所有课程。
 * 
 * 【如何修改内容】
 * 修改 src/lib/data.ts 中的 COURSES_DATA 即可更新课程列表
 */

import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/school";
import { COURSES_DATA, PAGE_CONFIGS } from "@/lib/data";

// ============================================================================
// 页面元数据（SEO）
// ============================================================================
export const metadata: Metadata = {
  title: PAGE_CONFIGS.courses.title,
  description: PAGE_CONFIGS.courses.description,
  keywords: PAGE_CONFIGS.courses.keywords,
};

// ============================================================================
// 课程教学页面组件
// ============================================================================
export default function CoursesPage() {
  return (
    <div>
      
      {/* 页面横幅 */}
      <PageHeader 
        title="课程教学" 
        subtitle="多元化课程体系，促进全面发展"
        bgImage={`https://picsum.photos/1920/600?random=courses`}
      />

      {/* 课程列表 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COURSES_DATA.map((course) => (
              <div 
                key={course.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* 课程图片 */}
                <div className="h-48 overflow-hidden relative group">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  
                  {/* 课程类型标签 */}
                  <span className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full ${
                    course.type === '国家课程' ? 'bg-zk-blue' :
                    course.type === '校本课程' ? 'bg-zk-red' : 'bg-zk-gold'
                  }`}>
                    {course.type}
                  </span>
                </div>
                
                {/* 课程信息 */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* 标题 */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 hover:text-zk-blue">
                    <Link href={`/courses/${course.id}`}>{course.title}</Link>
                  </h3>
                  
                  {/* 描述 */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {course.description}
                  </p>
                  
                  {/* 特色标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* 了解详情按钮 */}
                  <Link 
                    href={`/courses/${course.id}`} 
                    className="inline-block text-center w-full py-2 border border-gray-200 rounded text-sm font-bold text-gray-600 hover:bg-zk-red hover:text-white hover:border-zk-red transition-colors mt-auto"
                  >
                    了解详情
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
