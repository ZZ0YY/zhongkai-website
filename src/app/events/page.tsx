/**
 * 校园活动页面 - 惠州仲恺中学官网（优化版）
 */

import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/school";
import { EVENTS_DATA, PAGE_CONFIGS } from "@/lib/data";

export const metadata: Metadata = {
  title: PAGE_CONFIGS.events.title,
  description: PAGE_CONFIGS.events.description,
  keywords: PAGE_CONFIGS.events.keywords,
};

export default function EventsPage() {
  return (
    <div>
      <PageHeader 
        title="校园活动" 
        subtitle="青春活力，精彩无限"
        bgImage={`https://picsum.photos/1920/600?random=events`}
      />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EVENTS_DATA.map((event) => (
              <div 
                key={event.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden relative group">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white rounded-lg p-2 text-center shadow-md">
                    <span className="block text-2xl font-bold text-zk-red">{event.day}</span>
                    <span className="block text-xs text-gray-500 uppercase">{event.month}</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 hover:text-zk-blue">
                    <Link href={`/events/${event.id}`} prefetch={false}>{event.title}</Link>
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                  {event.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {event.description}
                    </p>
                  )}
                  <Link 
                    href={`/events/${event.id}`} 
                    prefetch={false}
                    className="inline-block text-center w-full py-2 border border-gray-200 rounded text-sm font-bold text-gray-600 hover:bg-zk-red hover:text-white hover:border-zk-red transition-colors mt-auto"
                  >
                    查看详情
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
