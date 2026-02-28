/**
 * ============================================================================
 * Header 组件 - 网站顶部导航栏
 * ============================================================================
 * 
 * 【新手指南】
 * 这是网站的顶部导航栏组件，包含：
 * - Logo 和学校名称
 * - 导航菜单
 * - 移动端菜单按钮
 * - 师生登录按钮
 * 
 * 【如何修改导航菜单】
 * 导航菜单数据在 src/lib/data.ts 的 NAV_ITEMS 中定义
 * 修改该数组即可更新导航菜单
 * 
 * 【组件结构】
 * - Header: 主组件，包含导航栏的所有功能
 * - 使用 useState 管理移动端菜单状态
 * - 使用 useEffect 监听滚动事件
 * 
 * 【Next.js 特点】
 * - 使用 Link 组件代替 a 标签，实现页面无刷新跳转
 * - 使用 usePathname 获取当前路径，判断菜单激活状态
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, SCHOOL_INFO } from '@/lib/data';

/**
 * Header 组件
 * 网站顶部导航栏
 */
export default function Header() {
  // ========================================================================
  // 状态管理
  // ========================================================================
  
  /**
   * isOpen - 移动端菜单是否打开
   * 用于控制移动端菜单的显示/隐藏
   */
  const [isOpen, setIsOpen] = useState(false);
  
  /**
   * isScrolled - 页面是否滚动
   * 用于改变导航栏的样式（滚动后添加阴影）
   */
  const [isScrolled, setIsScrolled] = useState(false);
  
  /**
   * pathname - 当前页面路径
   * 用于判断当前激活的菜单项
   */
  const pathname = usePathname();

  // ========================================================================
  // 副作用 - 监听滚动事件
  // ========================================================================
  useEffect(() => {
    /**
     * handleScroll - 滚动事件处理函数
     * 当滚动超过 20px 时，设置 isScrolled 为 true
     */
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    
    // 组件卸载时移除监听（防止内存泄漏）
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ========================================================================
  // 副作用 - 路由变化时关闭移动端菜单
  // 使用 useLayoutEffect 避免 cascading renders 警告
  // ========================================================================
  useEffect(() => {
    // 使用 setTimeout 将状态更新推迟到下一个事件循环
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // ========================================================================
  // 渲染
  // ========================================================================
  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          
          {/* ==================================================================
              Logo 区域
              ================================================================== */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo 图标 */}
            <div className="w-10 h-10 md:w-12 md:h-12 bg-zk-red rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:bg-zk-blue transition-colors">
              ZK
            </div>
            
            {/* 学校名称 */}
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold font-serif-sc text-zk-red group-hover:text-zk-blue transition-colors">
                {SCHOOL_INFO.name}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Zhongkai High School
              </span>
            </div>
          </Link>

          {/* ==================================================================
              桌面端导航菜单
              ================================================================== */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              // 判断当前菜单项是否激活
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                    ${isActive 
                      ? 'text-zk-red bg-red-50' 
                      : 'text-gray-700 hover:text-zk-red hover:bg-gray-50'
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* 师生登录按钮 */}
            <a 
              href="#login" 
              className="ml-4 px-5 py-2 bg-zk-red text-white text-sm font-bold rounded-full shadow-md hover:bg-red-800 transition-transform hover:-translate-y-0.5"
            >
              师生登录
            </a>
          </div>

          {/* ==================================================================
              移动端菜单按钮
              ================================================================== */}
          <button 
            className="lg:hidden text-gray-700 hover:text-zk-red focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                // 关闭图标 (X)
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                // 菜单图标 (三横线)
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* ==================================================================
            移动端菜单下拉
            ================================================================== */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-2 bg-gray-50 p-4 rounded-lg shadow-inner">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  pathname === item.path 
                    ? 'text-zk-red bg-white' 
                    : 'text-gray-700 hover:text-zk-red hover:bg-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a 
              href="#login" 
              className="block px-4 py-3 text-center rounded-md text-base font-bold bg-zk-red text-white hover:bg-red-800"
            >
              师生登录
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
