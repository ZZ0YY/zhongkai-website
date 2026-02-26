/**
 * ============================================================================
 * 首页 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【修复说明】
 * 1. 轮播图添加 heroMode={true}，确保按钮在遮罩层之上可点击
 * 2. 调整层级结构，轮播图容器 z-index 为 z-10，遮罩层为 z-20，内容为 z-30
 */

import Link from "next/link";
import { 
  HERO_SLIDES, 
  NEWS_DATA, 
  EVENTS_DATA, 
  COURSES_DATA,
  BLOG_URL,
  getLatestPosts,
  PAGE_CONFIGS 
} from "@/lib/data";
import { Metadata } from "next";
import ImageCarousel from "@/components/school/ImageCarousel";

// ============================================================================
// 页面元数据（SEO）
// ============================================================================
export const metadata: Metadata = {
  title: PAGE_CONFIGS.home.title,
  description: PAGE_CONFIGS.home.description,
  keywords: PAGE_CONFIGS.home.keywords,
};

// ============================================================================
// 首页组件
// ============================================================================
export default async function HomePage() {
  // 获取最新文章
  const latestPosts = await getLatestPosts(6);
  
  return (
    <div>
      {/* ==================================================================
          Hero 横幅区域（含轮播图）
          【修复】添加 heroMode，调整 z-index 层级
          ================================================================== */}
      <section className="relative h-[600px] md:h-[800px] flex items-center overflow-hidden">
        {/* 轮播图背景 - z-10 */}
        <div className="absolute inset-0 z-10">
          <ImageCarousel 
            images={HERO_SLIDES.map(slide => ({
              src: slide.image,
              alt: slide.title,
              caption: slide.title,
            }))}
            autoPlayInterval={5000}
            heroMode={true}
          />
        </div>
        
        {/* 渐变遮罩 - z-20（在轮播图之上，但按钮通过 heroMode 有 z-30） */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        
        {/* 内容区域 - z-30 */}
        <div className="container mx-auto px-4 relative z-30 text-white">
          <div className="max-w-3xl">
            {/* 建校年份标签 */}
            <span className="inline-block px-4 py-1 mb-6 border border-zk-gold text-zk-gold rounded-full text-sm font-bold tracking-wider uppercase animate-fade-in">
              EST. 1969
            </span>
            
            {/* 主标题 */}
            <h1 className="text-5xl md:text-7xl font-bold font-serif-sc mb-6 leading-tight">
              {HERO_SLIDES[0].title}
            </h1>
            
            {/* 副标题 */}
            <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light">
              {HERO_SLIDES[0].subtitle}
            </p>
            
            {/* 行动按钮 */}
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/about" 
                className="px-8 py-4 bg-zk-red hover:bg-red-800 text-white font-bold rounded shadow-lg transition-transform hover:-translate-y-1"
              >
                了解学校
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold rounded transition-colors"
              >
                联系我们
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          特色展示区域
          ================================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* 特色1：悠久历史 */}
            <div className="p-8 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 text-zk-red rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                📖
              </div>
              <h3 className="text-xl font-bold mb-3">悠久历史</h3>
              <p className="text-gray-600">
                创办于1969年，五十余载文化积淀，薪火相传。
              </p>
            </div>
            
            {/* 特色2：师资雄厚 */}
            <div className="p-8 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-zk-blue rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                🏆
              </div>
              <h3 className="text-xl font-bold mb-3">师资雄厚</h3>
              <p className="text-gray-600">
                广东省一级学校，拥有一支高素质、高水平的教师队伍。
              </p>
            </div>
            
            {/* 特色3：全面发展 */}
            <div className="p-8 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 text-zk-gold rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-3">全面发展</h3>
              <p className="text-gray-600">
                注重学生综合素质，开设多元化校本课程与社团活动。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          博客入口区域
          ================================================================== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* 区域标题 */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif-sc text-gray-900 mb-2">
                校园博客
              </h2>
              <div className="h-1 w-20 bg-zk-blue"></div>
            </div>
            <Link 
              href={BLOG_URL}
              target="_blank"
              className="text-zk-blue hover:text-zk-red font-semibold hidden md:flex items-center gap-2"
            >
              访问博客
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
          
          {/* 最新文章卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => {
              // 根据文章所属模块生成正确的链接
              const modulePath = post._module || 'news';
              const postLink = `/${modulePath}/${post.id}`;
              
              return (
                <div 
                  key={post.id} 
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* 文章图片 */}
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  
                  {/* 文章信息 */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                      <span className="text-zk-red font-bold">{post.category}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                      {post._source === 'remote' && (
                        <span className="bg-blue-100 text-zk-blue px-2 py-0.5 rounded">博客</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-zk-red transition-colors line-clamp-2">
                      <Link href={postLink}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.summary}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 博客入口按钮 */}
          <div className="mt-12 text-center">
            <Link 
              href={BLOG_URL}
              target="_blank"
              className="inline-flex items-center gap-2 px-8 py-4 bg-zk-blue text-white font-bold rounded-lg hover:bg-blue-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              访问校园博客
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================================
          课程推荐区域
          ================================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif-sc text-gray-900 mb-2">
                特色课程
              </h2>
              <div className="h-1 w-20 bg-zk-red"></div>
            </div>
            <Link 
              href="/courses" 
              className="text-zk-blue hover:text-zk-red font-semibold hidden md:block"
            >
              查看全部 →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COURSES_DATA.slice(0, 3).map((course) => (
              <div 
                key={course.id} 
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-zk-blue bg-blue-50 px-2 py-1 rounded mb-3 inline-block">
                    {course.type}
                  </span>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-zk-red transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <Link 
                    href="/courses" 
                    className="text-sm font-bold text-gray-900 border-b-2 border-transparent group-hover:border-zk-red transition-all"
                  >
                    了解详情
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          新闻动态 & 校园活动区域
          ================================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* 新闻动态列 */}
            <div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold font-serif-sc text-gray-900">
                  新闻动态
                </h2>
                <Link href="/news" className="text-sm text-gray-500 hover:text-zk-red">
                  更多新闻
                </Link>
              </div>
              
              <div className="space-y-8">
                {NEWS_DATA.slice(0, 3).map((news) => (
                  <div key={news.id} className="flex gap-4 group">
                    <div className="w-24 h-24 shrink-0 rounded overflow-hidden">
                      <img 
                        src={news.image} 
                        alt={news.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                        <span className="text-zk-red font-bold">{news.category}</span>
                        <span>•</span>
                        <span>{news.date}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-2 group-hover:text-zk-blue transition-colors line-clamp-1">
                        <Link href={`/news/${news.id}`}>{news.title}</Link>
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{news.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 校园活动列 */}
            <div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold font-serif-sc text-gray-900">
                  校园活动
                </h2>
                <Link href="/events" className="text-sm text-gray-500 hover:text-zk-red">
                  更多活动
                </Link>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                {EVENTS_DATA.slice(0, 3).map((event, idx) => (
                  <div 
                    key={event.id} 
                    className={`flex items-center gap-6 ${idx !== EVENTS_DATA.length - 1 ? 'mb-6 pb-6 border-b border-gray-200' : ''}`}
                  >
                    <div className="bg-white border border-gray-200 rounded-lg p-3 text-center min-w-[80px] shadow-sm">
                      <span className="block text-2xl font-bold text-zk-red">{event.day}</span>
                      <span className="block text-xs text-gray-500 uppercase">{event.month}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1 hover:text-zk-blue cursor-pointer transition-colors">
                        <Link href={`/events/${event.id}`}>{event.title}</Link>
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          CTA 区域 - 招生咨询入口
          ================================================================== */}
      <section className="py-20 bg-zk-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold font-serif-sc mb-6">
            加入惠州仲恺中学大家庭
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            我们致力于为每一位学生提供最优质的教育资源和最广阔的发展平台。
          </p>
          <Link 
            href="/contact" 
            className="inline-block px-8 py-4 bg-zk-gold text-gray-900 font-bold rounded shadow-lg hover:bg-white hover:scale-105 transition-all"
          >
            招生咨询
          </Link>
        </div>
      </section>
    </div>
  );
}
