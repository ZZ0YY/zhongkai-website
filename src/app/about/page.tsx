/**
 * 学校概况页面 - 惠州仲恺中学官网
 */

import { Metadata } from "next";
import { PageHeader } from "@/components/school";
import ImageCarousel from "@/components/school/ImageCarousel";
import { SCHOOL_INFO, HONORS_DATA, PAGE_CONFIGS } from "@/lib/data";

export const metadata: Metadata = {
  title: PAGE_CONFIGS.about.title,
  description: PAGE_CONFIGS.about.description,
  keywords: PAGE_CONFIGS.about.keywords,
};

// 校园图片数据
const CAMPUS_IMAGES = [
  { src: "https://picsum.photos/1200/675?random=100", alt: "校园正门", caption: "美丽的仲恺校园正门" },
  { src: "https://picsum.photos/1200/675?random=101", alt: "教学楼", caption: "现代化教学楼群" },
  { src: "https://picsum.photos/1200/675?random=102", alt: "图书馆", caption: "藏书丰富的图书馆" },
  { src: "https://picsum.photos/1200/675?random=103", alt: "运动场", caption: "标准田径运动场" },
  { src: "https://picsum.photos/1200/675?random=104", alt: "实验室", caption: "先进科学实验室" },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader 
        title="学校概况" 
        subtitle="尚德 博学 健体 力行"
        bgImage="https://picsum.photos/1920/800?random=50"
      />

      {/* 校园轮播图 */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <ImageCarousel images={CAMPUS_IMAGES} autoPlayInterval={6000} />
        </div>
      </section>

      {/* 历史沿革 & 办学理念 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            
            {/* 左侧：图片展示 */}
            <div className="w-full md:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="https://picsum.photos/800/600?random=51" 
                  alt="School Campus" 
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white font-bold text-lg">美丽的仲恺校园</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <img 
                  src="https://picsum.photos/400/300?random=52" 
                  alt="Classroom" 
                  className="rounded-lg shadow-md"
                  loading="lazy"
                />
                <img 
                  src="https://picsum.photos/400/300?random=53" 
                  alt="Library" 
                  className="rounded-lg shadow-md"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 右侧：文字介绍 */}
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold font-serif-sc text-zk-red mb-6 relative pl-4 border-l-4 border-zk-gold">
                历史沿革
              </h2>
              <div className="prose text-gray-600 mb-8">
                <p className="mb-4">
                  惠州仲恺中学，其前身为陈江中学，创办于1969年。1994年，为纪念伟大的爱国主义者、近代民主革命的先驱廖仲恺先生，学校正式更名为仲恺中学。这是一所充满光荣革命传统的学校，承载着深厚的历史文化底蕴。
                </p>
                <p className="mb-4">
                  自2006年被评为"广东省一级学校"以来，学校不断追求卓越，于2008年再获"广东省普通高中教学水平优秀学校"殊荣。多年来，学校始终坚持党的教育方针，以立德树人为根本任务，形成了"尚德、博学、健体、力行"的优良校风，为社会培养了一批又一批的优秀人才。
                </p>
              </div>

              <h2 className="text-3xl font-bold font-serif-sc text-zk-blue mb-6 relative pl-4 border-l-4 border-zk-gold">
                办学理念
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-zk-blue mb-8">
                <p className="text-lg italic text-gray-700">
                  "学校坚持以学生发展为本，全面实施素质教育。我们注重培养学生的创新精神和实践能力，通过丰富多彩的课程和活动，促进学生德、智、体、美、劳全面发展。"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="p-4 bg-red-50 rounded-lg">
                  <span className="block text-3xl font-bold text-zk-red mb-1">1969</span>
                  <span className="text-sm text-gray-500">建校年份</span>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <span className="block text-3xl font-bold text-zk-blue mb-1">省一级</span>
                  <span className="text-sm text-gray-500">学校等级</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 学校荣誉 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-serif-sc mb-12">学校荣誉</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {HONORS_DATA.map((honor) => (
              <div 
                key={honor.id} 
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mx-auto bg-zk-gold rounded-full flex items-center justify-center text-white mb-4">
                  ★
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{honor.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{honor.year}年</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 校训展示 */}
      <section className="py-20 bg-zk-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-serif-sc mb-6">
            尚德 博学 健体 力行
          </h2>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            传承仲恺精神，培育时代新人。我们致力于培养德智体美劳全面发展的社会主义建设者和接班人。
          </p>
        </div>
      </section>
    </div>
  );
}
