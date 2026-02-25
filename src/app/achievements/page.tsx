/**
 * ============================================================================
 * 办学成果页面 - 惠州仲恺中学官网
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
import { HONORS_DATA, PAGE_CONFIGS, getCombinedPosts } from "@/lib/data";

// ============================================================================
// 页面元数据（SEO）
// ============================================================================
export const metadata: Metadata = {
  title: PAGE_CONFIGS.achievements.title,
  description: PAGE_CONFIGS.achievements.description,
  keywords: PAGE_CONFIGS.achievements.keywords,
};

// ============================================================================
// 办学成果页面组件（改为 async 动态渲染）
// ============================================================================
export default async function AchievementsPage() {
  // 获取合并后的文章数据（本地 + Hexo 远程）
  const posts = await getCombinedPosts('achievements');
  
  return (
    <div>
      
      {/* 页面横幅 */}
      <PageHeader 
        title="办学成果" 
        subtitle="桃李芬芳，硕果累累"
        bgImage={`https://picsum.photos/1920/600?random=achievements`}
      />

      {/* 学校荣誉 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-serif-sc text-gray-900 mb-12 text-center">
            学校荣誉
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {HONORS_DATA.map((honor) => (
              <div 
                key={honor.id} 
                className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-16 h-16 mx-auto bg-zk-gold rounded-full flex items-center justify-center text-white mb-4 text-2xl">
                  ★
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{honor.title}</h3>
                <p className="text-xs text-gray-500">{honor.year}年</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 成果展示 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-serif-sc text-gray-900 mb-12 text-center">
            成果展示
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((news) => (
              <div 
                key={news.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* 图片 */}
                <div className="h-48 overflow-hidden relative group">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  
                  <span className="absolute top-4 left-4 bg-zk-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                    {news.category || '荣誉时刻'}
                  </span>
                  
                  {/* 远程文章标识 */}
                  {news._source === 'remote' && (
                    <span className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                      博客
                    </span>
                  )}
                </div>
                
                {/* 信息 */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-sm text-gray-500 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {news.date}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 hover:text-zk-blue">
                    <Link href={`/news/${news.id}`}>{news.title}</Link>
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {news.summary}
                  </p>
                  
                  <Link 
                    href={`/news/${news.id}`} 
                    className="inline-block text-center w-full py-2 border border-gray-200 rounded text-sm font-bold text-gray-600 hover:bg-zk-red hover:text-white hover:border-zk-red transition-colors mt-auto"
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* 空状态提示 */}
          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <p>暂无成果展示</p>
            </div>
          )}
        </div>
      </section>

      {/* 数据统计 */}
      <section className="py-20 bg-zk-blue text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="block text-5xl font-bold mb-2">50+</span>
              <span className="text-blue-200">年办学历史</span>
            </div>
            <div>
              <span className="block text-5xl font-bold mb-2">100+</span>
              <span className="text-blue-200">优秀教师</span>
            </div>
            <div>
              <span className="block text-5xl font-bold mb-2">3000+</span>
              <span className="text-blue-200">在校学生</span>
            </div>
            <div>
              <span className="block text-5xl font-bold mb-2">10000+</span>
              <span className="text-blue-200">优秀校友</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
