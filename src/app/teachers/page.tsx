/**
 * 师资力量页面 - 惠州仲恺中学官网（优化版）
 */

import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/school";
import { TEACHERS_DATA, PAGE_CONFIGS } from "@/lib/data";

export const metadata: Metadata = {
  title: PAGE_CONFIGS.teachers.title,
  description: PAGE_CONFIGS.teachers.description,
  keywords: PAGE_CONFIGS.teachers.keywords,
};

export default function TeachersPage() {
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
            {TEACHERS_DATA.map((teacher) => (
              <div 
                key={teacher.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                <div className="relative group">
                  <img 
                    src={teacher.image} 
                    alt={teacher.name} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute bottom-4 left-4 bg-zk-red text-white text-xs font-bold px-3 py-1 rounded-full">
                    {teacher.title}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{teacher.name}</h3>
                    <span className="text-sm text-zk-blue font-medium">{teacher.subject}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {teacher.description}
                  </p>
                  <Link 
                    href={`/teachers/${teacher.id}`} 
                    prefetch={false}
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
