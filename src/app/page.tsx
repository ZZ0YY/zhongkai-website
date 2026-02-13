/**
 * 首页 - 惠州仲恺中学官网（优化版）
 * 
 * 【性能优化】
 * - 所有 Link 组件禁用 prefetch
 */

import Link from "next/link";
import { 
  HERO_SLIDES, 
  NEWS_DATA, 
  EVENTS_DATA, 
  COURSES_DATA,
  PAGE_CONFIGS 
} from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: PAGE_CONFIGS.home.title,
  description: PAGE_CONFIGS.home.description,
  keywords: PAGE_CONFIGS.home.keywords,
};

export default function HomePage() {
  return (
    <div>
      {/* Hero 横幅区域 */}
      <section className="relative h-[600px] md:h-[800px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_SLIDES[0].image} 
            alt="School Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1 mb-6 border border-zk-gold text-zk-gold rounded-full text-sm font-bold tracking-wider uppercase animate-fade-in">
              EST. 1969
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-serif-sc mb-6 leading-tight">
              {HERO_SLIDES[0].title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light">
              {HERO_SLIDES[0].subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/about" 
                prefetch={false}
                className="px-8 py-4 bg-zk-red hover:bg-red-800 text-white font-bold rounded shadow-lg transition-transform hover:-translate-y-1"
              >
                了解学校
              </Link>
              <Link 
                href="/contact" 
                prefetch={false}
                className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-bold rounded transition-colors"
              >
                联系我们
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 特色展示区域 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 text-zk-red rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                📖
              </div>
              <h3 className="text-xl font-bold mb-3">悠久历史</h3>
              <p className="text-gray-600">
                创办于1969年，五十余载文化积淀，薪火相传。
              </p>
            </div>
            <div className="p-8 rounded-xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-zk-blue rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                🏆
              </div>
              <h3 className="text-xl font-bold mb-3">师资雄厚</h3>
              <p className="text-gray-600">
                广东省一级学校，拥有一支高素质、高水平的教师队伍。
              </p>
            </div>
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

      {/* 课程推荐区域 */}
      <section className="py-20 bg-gray-50">
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
              prefetch={false}
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
                    loading="lazy"
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
                    href={`/courses/${course.id}`}
                    prefetch={false}
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

      {/* 新闻动态 & 校园活动区域 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* 新闻动态列 */}
            <div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold font-serif-sc text-gray-900">
                  新闻动态
                </h2>
                <Link href="/news" prefetch={false} className="text-sm text-gray-500 hover:text-zk-red">
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
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                        <span className="text-zk-red font-bold">{news.category}</span>
                        <span>•</span>
                        <span>{news.date}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-2 group-hover:text-zk-blue transition-colors line-clamp-1">
                        <Link href={`/news/${news.id}`} prefetch={false}>{news.title}</Link>
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
                <Link href="/events" prefetch={false} className="text-sm text-gray-500 hover:text-zk-red">
                  更多活动
                </Link>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                {EVENTS_DATA.slice(0, 3).map((event, idx) => (
                  <div 
                    key={event.id} 
                    className={`flex items-center gap-6 ${idx !== 2 ? 'mb-6 pb-6 border-b border-gray-200' : ''}`}
                  >
                    <div className="bg-white border border-gray-200 rounded-lg p-3 text-center min-w-[80px] shadow-sm">
                      <span className="block text-2xl font-bold text-zk-red">{event.day}</span>
                      <span className="block text-xs text-gray-500 uppercase">{event.month}</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1 hover:text-zk-blue cursor-pointer transition-colors">
                        <Link href={`/events/${event.id}`} prefetch={false}>{event.title}</Link>
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

      {/* CTA 区域 */}
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
            prefetch={false}
            className="inline-block px-8 py-4 bg-zk-gold text-gray-900 font-bold rounded shadow-lg hover:bg-white hover:scale-105 transition-all"
          >
            招生咨询
          </Link>
        </div>
      </section>
    </div>
  );
}
