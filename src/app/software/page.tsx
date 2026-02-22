/**
 * 教学软件列表页面 - 惠州仲恺中学官网
 */

import { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/school";
import { SOFTWARE_DATA, PAGE_CONFIGS } from "@/lib/data";

export const metadata: Metadata = {
  title: PAGE_CONFIGS.software.title,
  description: PAGE_CONFIGS.software.description,
  keywords: PAGE_CONFIGS.software.keywords,
};

export default function SoftwarePage() {
  return (
    <div>
      <PageHeader 
        title="教学软件" 
        subtitle="优质教学工具，助力高效学习"
        bgImage="https://picsum.photos/1920/600?random=software"
      />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          
          {/* 分类筛选提示 */}
          <div className="mb-8 text-center">
            <p className="text-gray-500">
              为师生精选优质教学软件和学习资源，全部免费使用
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SOFTWARE_DATA.map((software) => (
              <div 
                key={software.id} 
                className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden relative group">
                  <img 
                    src={software.image} 
                    alt={software.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full ${
                    software.category === '教学工具' ? 'bg-zk-red' :
                    software.category === '学习资源' ? 'bg-zk-blue' :
                    software.category === '办公软件' ? 'bg-green-600' : 'bg-zk-gold'
                  }`}>
                    {software.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 hover:text-zk-blue">
                    <Link href={`/software/${software.id}`} prefetch={false}>{software.title}</Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {software.description}
                  </p>
                  
                  {/* 平台标签 */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {software.platform.map((platform, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                  
                  {/* 标签 */}
                  {software.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {software.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-red-50 text-zk-red px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <Link 
                    href={`/software/${software.id}`} 
                    prefetch={false}
                    className="inline-block text-center w-full py-2 border border-gray-200 rounded text-sm font-bold text-gray-600 hover:bg-zk-red hover:text-white hover:border-zk-red transition-colors"
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使用说明 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold font-serif-sc text-center mb-8">使用说明</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-12 h-12 bg-zk-red text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="font-bold mb-2">选择软件</h3>
                <p className="text-gray-600 text-sm">浏览软件列表，找到适合您需求的工具</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-zk-blue text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="font-bold mb-2">查看详情</h3>
                <p className="text-gray-600 text-sm">了解软件功能、使用教程和下载方式</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-zk-gold text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="font-bold mb-2">开始使用</h3>
                <p className="text-gray-600 text-sm">下载安装或在线使用，提升学习效率</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
