/**
 * ============================================================================
 * PageHeader 组件 - 页面顶部横幅
 * ============================================================================
 * 
 * 【新手指南】
 * 这是一个通用的页面顶部横幅组件，用于：
 * - 显示页面标题
 * - 显示页面副标题
 * - 显示背景图片
 * 
 * 【使用方法】
 * import PageHeader from '@/components/school/PageHeader';
 * 
 * <PageHeader 
 *   title="页面标题" 
 *   subtitle="页面副标题"
 *   bgImage="背景图片URL"
 * />
 * 
 * 【Props 说明】
 * - title: 页面标题（必填）
 * - subtitle: 页面副标题（可选）
 * - bgImage: 背景图片URL（可选，有默认值）
 */

import React from 'react';

/**
 * PageHeader 组件的 Props 类型定义
 */
interface PageHeaderProps {
  /** 页面标题 */
  title: string;
  /** 页面副标题（可选） */
  subtitle?: string;
  /** 背景图片URL（可选） */
  bgImage?: string;
  /** 标题标签级别（可选，默认 h1）*/
  as?: 'h1' | 'h2';
}

/**
 * PageHeader 组件
 * 用于显示页面的顶部横幅区域
 */
export default function PageHeader({ 
  title, 
  subtitle, 
  bgImage = "https://picsum.photos/1920/600?grayscale&blur=2",
  as = 'h1'
}: PageHeaderProps) {
  // 动态选择标题标签
  const TitleTag = as;
  return (
    <div className="relative h-64 md:h-80 flex items-center justify-center text-center text-white overflow-hidden bg-gray-900">
      
      {/* ==================================================================
          背景图片层
          - 使用绝对定位覆盖整个区域
          - 添加半透明遮罩提高文字可读性
          ================================================================== */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60 transform scale-105 transition-transform duration-[10s] hover:scale-100"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* 渐变遮罩层 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      
      {/* ==================================================================
          内容区域
          - 使用相对定位，确保在背景图片之上
          - 包含标题和副标题
          ================================================================== */}
      <div className="relative z-10 container mx-auto px-4">
        {/* 页面标题 - 根据页面类型动态选择 h1 或 h2 */}
        <TitleTag className="text-4xl md:text-5xl font-bold font-serif-sc mb-4 tracking-wide animate-fade-in-up">
          {title}
        </TitleTag>
        
        {/* 页面副标题（如果有） */}
        {subtitle && (
          <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto animate-fade-in-up delay-100">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
