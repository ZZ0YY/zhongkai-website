/**
 * ============================================================================
 * 联系我们页面 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【新手指南】
 * 这是联系我们页面，包含以下内容：
 * 1. 页面横幅
 * 2. 联系表单
 * 3. 联系方式信息
 * 4. 地图占位区域
 * 
 * 【如何修改内容】
 * - 学校信息：修改 src/lib/data.ts 中的 SCHOOL_INFO
 * 
 * 【未来功能扩展】
 * - 添加表单提交功能（需要后端API）
 * - 嵌入百度地图或高德地图
 * - 添加在线咨询功能
 */

import { Metadata } from "next";
import { PageHeader } from "@/components/school";
import { SCHOOL_INFO, PAGE_CONFIGS } from "@/lib/data";

// ============================================================================
// 页面元数据（SEO）
// ============================================================================
export const metadata: Metadata = {
  title: PAGE_CONFIGS.contact.title,
  description: PAGE_CONFIGS.contact.description,
  keywords: PAGE_CONFIGS.contact.keywords,
};

// ============================================================================
// 联系我们页面组件
// ============================================================================
export default function ContactPage() {
  return (
    <div>
      
      {/* ==================================================================
          页面横幅
          ================================================================== */}
      <PageHeader 
        title="联系我们" 
        subtitle="我们期待倾听您的声音"
        bgImage="https://picsum.photos/1920/800?grayscale"
      />

      {/* ==================================================================
          联系表单 & 联系方式
          ================================================================== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* 左侧：联系表单 */}
            <div>
              <h2 className="text-3xl font-bold font-serif-sc text-gray-900 mb-8">
                保持联系
              </h2>
              
              {/*
                表单说明：
                目前表单只有前端展示，没有实际提交功能。
                如需添加表单提交功能，需要：
                1. 创建 API 路由（app/api/contact/route.ts）
                2. 添加表单状态管理
                3. 处理表单提交逻辑
              */}
              <form className="space-y-6">
                {/* 姓名输入 */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    姓名
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zk-blue focus:border-transparent outline-none transition-all" 
                    placeholder="请输入您的姓名" 
                  />
                </div>
                
                {/* 邮箱输入 */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    邮箱
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zk-blue focus:border-transparent outline-none transition-all" 
                    placeholder="your@email.com" 
                  />
                </div>
                
                {/* 留言内容 */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    留言内容
                  </label>
                  <textarea 
                    id="message" 
                    rows={5} 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zk-blue focus:border-transparent outline-none transition-all" 
                    placeholder="请详细描述您的咨询内容..."
                  ></textarea>
                </div>
                
                {/* 提交按钮 */}
                <button 
                  type="submit" 
                  className="w-full bg-zk-blue text-white font-bold py-4 rounded-lg hover:bg-blue-900 transition-colors shadow-lg"
                >
                  发送留言
                </button>
              </form>
            </div>

            {/* 右侧：联系方式信息 */}
            <div className="bg-gray-50 p-10 rounded-xl border border-gray-100">
              <h3 className="text-2xl font-bold mb-6">联系方式</h3>
              
              <div className="space-y-6">
                {/* 地址 */}
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-zk-red shadow-sm shrink-0 mr-4">
                    📍
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">学校地址</h4>
                    <p className="text-gray-600">{SCHOOL_INFO.address}</p>
                  </div>
                </div>
                
                {/* 电话 */}
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-zk-red shadow-sm shrink-0 mr-4">
                    📞
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">联系电话</h4>
                    <p className="text-gray-600">{SCHOOL_INFO.phone}</p>
                  </div>
                </div>
                
                {/* 邮箱 */}
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-zk-red shadow-sm shrink-0 mr-4">
                    ✉️
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">电子邮箱</h4>
                    <p className="text-gray-600">{SCHOOL_INFO.email}</p>
                  </div>
                </div>
              </div>

              {/* 地图占位区域 */}
              {/*
                地图嵌入说明：
                由于 Google 地图在国内不可用，建议使用百度地图或高德地图。
                
                百度地图嵌入方法：
                1. 访问百度地图开放平台
                2. 生成地图嵌入代码
                3. 将下面的占位区域替换为百度地图 iframe
                
                示例代码：
                <iframe 
                  src="百度地图嵌入链接" 
                  className="w-full h-48 rounded-lg"
                ></iframe>
              */}
              <div className="mt-10 pt-10 border-t border-gray-200">
                <h4 className="font-bold mb-4">学校位置</h4>
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 relative overflow-hidden group">
                  <img 
                    src="https://picsum.photos/600/300?blur=2" 
                    alt="Map Placeholder" 
                    className="absolute inset-0 w-full h-full object-cover opacity-50" 
                  />
                  <span className="relative z-10 font-bold bg-white/80 px-4 py-2 rounded">
                    [此处建议嵌入百度地图]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          常见问题（可选扩展）
          ================================================================== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-serif-sc text-gray-900 mb-12 text-center">
            常见问题
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 问题1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">如何报考仲恺中学？</h3>
              <p className="text-gray-600 text-sm">
                请关注惠州市教育局发布的招生政策，按照规定时间和流程进行报名。具体信息请咨询学校招生办公室。
              </p>
            </div>
            
            {/* 问题2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">学校有哪些特色课程？</h3>
              <p className="text-gray-600 text-sm">
                学校开设创客与编程、仲恺文化研学、艺术与审美等特色校本课程，详情请查看课程教学页面。
              </p>
            </div>
            
            {/* 问题3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">学校有住宿吗？</h3>
              <p className="text-gray-600 text-sm">
                学校提供住宿服务，宿舍设施齐全，管理规范。具体住宿安排请咨询学校后勤部门。
              </p>
            </div>
            
            {/* 问题4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">如何加入学生社团？</h3>
              <p className="text-gray-600 text-sm">
                学校每学期初会举办社团招新活动，届时可以报名参加感兴趣的社团。欢迎关注校园公告。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
