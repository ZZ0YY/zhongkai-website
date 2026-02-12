/**
 * ============================================================================
 * 师资力量页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【新手指南】
 * 这是师资力量列表页面，展示所有教师。
 * 
 * 【如何修改内容】
 * 修改 src/lib/data.ts 中的 TEACHERS_DATA 即可更新教师列表
 */

import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/school";
import { TEACHERS_DATA, PAGE_CONFIGS } from "@/lib/data";

// ============================================================================
// 页面元数据（SEO）
// ============================================================================
export const metadata: Metadata = {
  title: PAGE_CONFIGS.teachers.title,
  description: PAGE_CONFIGS.teachers.description,
  keywords: PAGE_CONFIGS.teachers.keywords,
};

// ============================================================================
// 师资力量页面组件
// ============================================================================
export default function TeachersPage() {
  return (
    <div>
      
      {/* 页面横幅 */}
      <PageHeader 
        title="师资力量" 
        subtitle="德艺双馨，潜心育人"
        bgImage={`https://picsum.photos/1920/600?random=teachers`}
      />

      {/* 教师列表 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          
          {/*
            教师卡片网格布局
            - 响应式设计：手机1列，平板2列，桌面3列
            - 每个卡片包含：头像、姓名、职称、学科、简介
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEACHERS_DATA.map((teacher) => (
              <div 
                key={teacher.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* 教师头像 */}
                <div className="relative group">
                  <img 
                    src={teacher.image} 
                    alt={teacher.name} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* 职称标签 */}
                  <span className="absolute bottom-4 left-4 bg-zk-red text-white text-xs font-bold px-3 py-1 rounded-full">
                    {teacher.title}
                  </span>
                </div>
                
                {/* 教师信息 */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* 姓名和学科 */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
                    <span className="text-sm text-zk-blue font-medium">{teacher.subject}</span>
                  </div>
                  
                  {/* 简介 */}
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {teacher.description}
                  </p>
                  
                  {/* 了解更多按钮 */}
                  <Link 
                    href={`/teachers/${teacher.id}`} 
                    className="inline-block text-center w-full py-2 border border-gray-200 rounded text-sm font-bold text-gray-600 hover:bg-zk-red hover:text-white hover:border-zk-red transition-colors mt-auto"
                  >
                    了解更多
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
