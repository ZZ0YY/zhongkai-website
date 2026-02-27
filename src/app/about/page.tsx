/**
 * ============================================================================
 * 学校概况页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【页面内容】
 * 1. 校园图片轮播
 * 2. 历史沿革（突出廖仲恺先生的红色背景）
 * 3. 办学理念（三品三促）
 * 4. 学校荣誉
 * 5. 校训展示
 * 6. 校园景观（德沁园）
 * 7. 数据魔方
 * 8. 交通指南
 */

import { Metadata } from "next";
import { PageHeader, ImageCarousel } from "@/components/school";
import { 
  SCHOOL_INFO, 
  HONORS_DATA, 
  PAGE_CONFIGS,
  CAMPUS_LANDSCAPE_DATA,
  SCHOOL_STATS_DATA,
  BUS_ROUTES_DATA
} from "@/lib/data";

export const metadata: Metadata = {
  title: PAGE_CONFIGS.about.title,
  description: PAGE_CONFIGS.about.description,
  keywords: PAGE_CONFIGS.about.keywords,
};

// 校园图片数据
const CAMPUS_IMAGES = [
  { src: "https://picsum.photos/1200/675?random=100", alt: "校园正门", caption: "美丽的仲恺校园正门" },
  { src: "https://picsum.photos/1200/675?random=101", alt: "教学楼", caption: "现代化教学楼群" },
  { src: "https://picsum.photos/1200/675?random=102", alt: "德沁园", caption: "德沁园园林景观" },
  { src: "https://picsum.photos/1200/675?random=103", alt: "运动场", caption: "标准田径运动场" },
  { src: "https://picsum.photos/1200/675?random=104", alt: "女子足球", caption: "女子足球训练场" },
];

export default function AboutPage() {
  return (
    <div>
      {/* 页面横幅 */}
      <PageHeader 
        title="学校概况" 
        subtitle={SCHOOL_INFO.motto}
        bgImage="https://picsum.photos/1920/800?random=50"
      />

      {/* 校园图片轮播 */}
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
                  alt="廖仲恺铜像" 
                  className="w-full h-auto"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="text-white font-bold text-lg">廖仲恺先生铜像</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <img src="https://picsum.photos/400/300?random=52" alt="德沁园" className="rounded-lg shadow-md" loading="lazy" />
                <img src="https://picsum.photos/400/300?random=53" alt="女子足球" className="rounded-lg shadow-md" loading="lazy" />
              </div>
            </div>

            {/* 右侧：文字介绍 */}
            <div className="w-full md:w-1/2">
              {/* 历史沿革 */}
              <h2 className="text-3xl font-bold font-serif-sc text-zk-red mb-6 relative pl-4 border-l-4 border-zk-gold">
                历史沿革
              </h2>
              <div className="prose text-gray-700 mb-8">
                <p className="mb-4 leading-relaxed">
                  仲恺中学是以中国民主革命先驱、伟大的爱国主义者廖仲恺先生的名字命名的名人纪念性完全中学。廖仲恺先生是孙中山先生最亲密的战友，被誉为"革命的财神"，一生致力于推翻封建帝制、追求民族独立，1925年在广州遇刺殉难，用生命诠释了"人生最重是精神"的革命信念。
                </p>
                <p className="mb-4 leading-relaxed">
                  学校前身为陈江农业中学，创办于1964年，1969年更名为陈江中学。1984年11月，为永远缅怀廖仲恺先生的丰功伟绩，正式命名为"仲恺中学"。经过半个多世纪的发展，学校于2011年12月被评为"广东省一级学校"，成为惠州仲恺高新区唯一一所区直属完全中学。如今，学校占地面积94188平方米，拥有79个教学班、5000余名师生，教育教学质量稳步提升，声名远播。
                </p>
              </div>

              {/* 办学理念 */}
              <h2 className="text-3xl font-bold font-serif-sc text-zk-blue mb-6 relative pl-4 border-l-4 border-zk-gold">
                办学理念
              </h2>
              <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-6 rounded-lg border-l-4 border-zk-blue mb-6">
                <p className="text-xl font-bold text-zk-blue mb-2">
                  "师名人风范，育一代英才"
                </p>
                <p className="text-gray-600 italic">
                  以廖仲恺先生为榜样，培育新时代栋梁之材
                </p>
              </div>
              
              {/* 三品三促 */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">"三品三促"办学思路</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="w-8 h-8 bg-zk-red text-white rounded-full flex items-center justify-center text-sm font-bold">品</span>
                    <div>
                      <span className="font-bold text-gray-900">师生尚品格</span>
                      <span className="text-gray-500 text-sm ml-2">以德立身，品格第一</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="w-8 h-8 bg-zk-blue text-white rounded-full flex items-center justify-center text-sm font-bold">位</span>
                    <div>
                      <span className="font-bold text-gray-900">管理重品位</span>
                      <span className="text-gray-500 text-sm ml-2">精细管理，追求卓越</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <span className="w-8 h-8 bg-zk-gold text-white rounded-full flex items-center justify-center text-sm font-bold">牌</span>
                    <div>
                      <span className="font-bold text-gray-900">学校创品牌</span>
                      <span className="text-gray-500 text-sm ml-2">特色办学，铸就品牌</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">
                  促学生成才 · 促教师成长 · 促学校成功
                </p>
              </div>

              {/* 特色项目：女子足球 */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚽</span>
                  <h3 className="font-bold text-green-700">学校特色：女子足球</h3>
                </div>
                <p className="text-sm text-gray-600">
                  学校高度重视体育工作，成立文体处专门负责指导体育工作。女子足球是学校特色项目，学校拥有标准足球场、完善的训练设施，培养了一批批优秀的女子足球运动员，在各级比赛中屡获佳绩。
                </p>
              </div>

              {/* 关键数据 */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-red-50 rounded-lg">
                  <span className="block text-3xl font-bold text-zk-red mb-1">1964</span>
                  <span className="text-sm text-gray-500">创办年份</span>
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
              <div key={honor.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 mx-auto bg-zk-gold rounded-full flex items-center justify-center text-white mb-4">★</div>
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
          <h2 className="text-3xl md:text-4xl font-bold font-serif-sc mb-6">
            {SCHOOL_INFO.motto}
          </h2>
          <p className="text-xl text-red-100 max-w-3xl mx-auto">
            传承仲恺精神，培育时代新人。以廖仲恺先生为榜样，培养德智体美劳全面发展的社会主义建设者和接班人。
          </p>
        </div>
      </section>

      {/* 校园景观（德沁园） */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif-sc text-gray-900 mb-4">校园景观</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              德沁园占地三万平方米，取"以德化人，沁人心脾"之意。全园以廖仲恺先生的一生为主线，象征性地展现了廖仲恺先生短暂而伟大的一生。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAMPUS_LANDSCAPE_DATA.map((spot, index) => (
              <div 
                key={index}
                className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="h-40 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                  <span className="text-6xl opacity-30">
                    {index === 0 ? '🌊' : index === 1 ? '🏛️' : index === 2 ? '⚔️' : index === 3 ? '🌳' : '🙏'}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{spot.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{spot.description}</p>
                  <p className="text-gray-500 text-xs italic border-l-2 border-zk-gold pl-3">
                    {spot.meaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 数据魔方 */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif-sc mb-4">数据魔方</h2>
            <p className="text-gray-400">用数据说话，见证学校发展</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {SCHOOL_STATS_DATA.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-zk-gold mb-2">
                  {stat.value}
                  {stat.unit && <span className="text-xl">{stat.unit}</span>}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
                {stat.description && (
                  <div className="text-gray-500 text-sm mt-1">{stat.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 交通指南 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif-sc text-gray-900 mb-4">交通指南</h2>
            <p className="text-gray-500">
              学校地址：{SCHOOL_INFO.address}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-zk-blue text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">线路</th>
                    <th className="px-6 py-4 text-left">起点站</th>
                    <th className="px-6 py-4 text-left">终点站</th>
                    <th className="px-6 py-4 text-left hidden md:table-cell">运营时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {BUS_ROUTES_DATA.map((route, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-zk-blue rounded-full text-sm font-bold">
                          {route.lineNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{route.startStation}</td>
                      <td className="px-6 py-4 text-gray-700">{route.endStation}</td>
                      <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">
                        {route.operatingHours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>* 以上为部分主要公交线路，具体请以公交公司公布为准</p>
              <p className="mt-2">
                高中部地址：惠州市惠城区仲恺五路108号 ｜ 初中部地址：新华大道南信利厂对面
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
