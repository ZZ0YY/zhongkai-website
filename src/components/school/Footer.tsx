/**
 * ============================================================================
 * Footer 组件 - 网站底部页脚
 * ============================================================================
 * 
 * 【新手指南】
 * 这是网站的底部页脚组件，包含：
 * - 学校 Logo 和简介
 * - 联系方式
 * - 快速链接
 * - 运营团队信息
 * - 版权信息
 * 
 * 【如何修改内容】
 * - 学校信息：修改 src/lib/data.ts 中的 SCHOOL_INFO
 * - 快速链接：修改下方的 quickLinks 数组
 * - 运营团队：修改 SCHOOL_INFO.studentOrgName
 * 
 * 【Next.js 特点】
 * - 使用 Link 组件进行内部链接跳转
 * - 外部链接使用普通的 a 标签
 */

import React from 'react';
import Link from 'next/link';
import { SCHOOL_INFO } from '@/lib/data';

/**
 * Footer 组件
 * 网站底部页脚
 */
export default function Footer() {
  // ========================================================================
  // 快速链接配置
  // 可以在这里修改底部快速链接
  // ========================================================================
  const quickLinks = [
    { label: '学校概况', path: '/about' },
    { label: '通知公告', path: '/news' },
    { label: '荣誉展示', path: '/achievements' },
    { label: '招生咨询', path: '/contact' },
  ];

  // ========================================================================
  // 渲染
  // ========================================================================
  return (
    <footer className="bg-slate-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* ==================================================================
            主要内容区域 - 四列布局
            ================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* ----------------------------------------------------------------
              第一列：学校信息
              ---------------------------------------------------------------- */}
          <div className="space-y-4">
            {/* Logo 和名称 */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white font-bold">
                ZK
              </div>
              <h3 className="text-xl font-bold text-white font-serif-sc">
                {SCHOOL_INFO.name}
              </h3>
            </div>
            
            {/* 校训 */}
            <p className="text-sm leading-relaxed text-gray-400">
              {SCHOOL_INFO.motto || '尚德 博学 健体 力行'}<br/>
              传承红色基因，培育时代新人。
            </p>
            
            {/* 学校等级标签 */}
            <div className="pt-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-zk-blue text-white rounded-full">
                {SCHOOL_INFO.level}
              </span>
            </div>
          </div>

          {/* ----------------------------------------------------------------
              第二列：联系方式
              ---------------------------------------------------------------- */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">
              联系方式
            </h4>
            
            <ul className="space-y-3 text-sm">
              {/* 地址 */}
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 text-zk-gold shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{SCHOOL_INFO.address}</span>
              </li>
              
              {/* 电话 */}
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-zk-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{SCHOOL_INFO.phone}</span>
              </li>
              
              {/* 邮箱 */}
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-zk-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{SCHOOL_INFO.email}</span>
              </li>
            </ul>
          </div>

          {/* ----------------------------------------------------------------
              第三列：快速链接
              ---------------------------------------------------------------- */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">
              快速链接
            </h4>
            
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    href={link.path} 
                    className="hover:text-zk-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ----------------------------------------------------------------
              第四列：运营团队
              ---------------------------------------------------------------- */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6 border-b border-gray-700 pb-2 inline-block">
              运营团队
            </h4>
            
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="text-sm mb-3">
                本网站由<span className="text-zk-gold font-bold"> {SCHOOL_INFO.studentOrgName} </span>自主设计与维护。
              </p>
              <p className="text-xs text-gray-500">
                我们致力于用技术服务校园，记录仲恺中学的每一个精彩瞬间。欢迎对编程、设计感兴趣的同学加入我们！
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================================
            版权信息
            ================================================================== */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {SCHOOL_INFO.name}. All Rights Reserved.</p>
          <p className="mt-2">
            SEO Optimized & Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
