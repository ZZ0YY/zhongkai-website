/**
 * ============================================================================
 * 师资力量页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【改造说明】
 * 1. 改为 async 函数，支持动态渲染
 * 2. 使用 getCombinedPosts 获取混合数据（本地 + Hexo 远程）
 * 3. 支持远程文章的完整展示
 */

import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/school";
import { TEACHERS_DATA, PAGE_CONFIGS, getCombinedPosts } from "@/lib/data";

// ============================================================================
// 页面元数据（SEO）
// ============================================================================
export const metadata: Metadata = {
  title: PAGE_CONFIGS.teachers.title,
  description: PAGE_CONFIGS.teachers.description,
  keywords: PAGE_CONFIGS.teachers.keywords,
};

// ============================================================================
// 师资力量页面组件（改为 async 动态渲染）
// ============================================================================
export default async function TeachersPage() {
  // 获取合并后的文章数据（本地 + Hexo 远程）
  const posts = await getCombinedPosts('teachers');
  
  return (
    <div>
      <PageHeader 
        title="师资力量" 
        subtitle="德艺双馨，潜心育人"
        bgImage={`https://picsum.photos/1920/600?random=teachers`}
      />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((item) => {
              // 兼容本地教师数据和远程文章数据
              const isLocalTeacher = 'name' in item && item.name;
              const displayName = isLocalTeacher ? item.name : item.title;
              const displayTitle = isLocalTeacher ? item.title : (item.category || '教师风采');
              const displaySubject = isLocalTeacher ? item.subject : '';
              const displayDesc = isLocalTeacher ? item.description : item.summary;
              
              return (
                <div 
                  key={item.id} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  <div className="relative group">
                    <img 
                      src={item.image} 
                      alt={displayName} 
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <span className="absolute bottom-4 left-4 bg-zk-red text-white text-xs font-bold px-3 py-1 rounded-full">
                      {displayTitle}
                    </span>
                    
                    {/* 远程文章标识 */}
                    {item._source === 'remote' && (
                      <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                        博客
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>
                      {displaySubject && (
                        <span className="text-sm text-zk-blue font-medium">{displaySubject}</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{displayDesc}</p>
                    <Link 
                      href={`/teachers/${item.id}`} 
                      className="inline-block text-center w-full py-2 border border-gray-200 rounded text-sm font-bold text-gray-600 hover:bg-zk-red hover:text-white hover:border-zk-red transition-colors mt-auto"
                    >
                      了解更多
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 空状态提示 */}
          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>暂无教师信息</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
