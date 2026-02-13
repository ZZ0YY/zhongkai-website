/**
 * 新闻动态页面 - 惠州仲恺中学官网（优化版）
 */

import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/school";
import { NEWS_DATA, PAGE_CONFIGS } from "@/lib/data";

export const metadata: Metadata = {
  title: PAGE_CONFIGS.news.title,
  description: PAGE_CONFIGS.news.description,
  keywords: PAGE_CONFIGS.news.keywords,
};

export default function NewsPage() {
  return (
    <div>
      <PageHeader 
        title="新闻动态" 
        subtitle="关注校园实时资讯，了解仲恺最新动态"
        bgImage={`https://picsum.photos/1920/600?random=news`}
      />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {NEWS_DATA.map((news) => (
              <div 
                key={news.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden relative group">
                  <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 bg-zk-red text-white text-xs font-bold px-3 py-1 rounded-full">
                    {news.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-sm text-gray-500 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {news.date}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 hover:text-zk-blue">
                    <Link href={`/news/${news.id}`} prefetch={false}>{news.title}</Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {news.summary}
                  </p>
                  <Link 
                    href={`/news/${news.id}`} 
                    prefetch={false}
                    className="inline-block text-center w-full py-2 border border-gray-200 rounded text-sm font-bold text-gray-600 hover:bg-zk-red hover:text-white hover:border-zk-red transition-colors mt-auto"
                  >
                    阅读更多
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
