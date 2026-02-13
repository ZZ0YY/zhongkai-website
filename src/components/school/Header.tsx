/**
 * ============================================================================
 * Header 组件 - 网站顶部导航栏（优化版）
 * ============================================================================
 * 
 * 【性能优化】
 * - 禁用 prefetch：防止 CDN 额度透支
 * - 使用 useRef 优化状态更新，避免弱网下 Hydration 问题
 * - 节流滚动事件处理
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, SCHOOL_INFO } from '@/lib/data';

export default function Header() {
  // ========================================================================
  // 状态管理
  // ========================================================================
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // 使用 ref 防止弱网下的状态竞态
  const isOpenRef = useRef(isOpen);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 同步 ref
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // ========================================================================
  // 滚动事件 - 节流处理
  // ========================================================================
  useEffect(() => {
    const handleScroll = () => {
      // 节流：100ms 内只处理一次
      if (scrollTimeoutRef.current) return;
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolled(window.scrollY > 20);
        scrollTimeoutRef.current = null;
      }, 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // ========================================================================
  // 路由变化时关闭菜单 - 使用 ref 确保确定性
  // ========================================================================
  useEffect(() => {
    // 直接使用 ref 检查，避免闭包问题
    if (isOpenRef.current) {
      setIsOpen(false);
    }
  }, [pathname]);

  // ========================================================================
  // 关闭菜单的回调
  // ========================================================================
  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

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
          
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
            prefetch={false}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-zk-red rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:bg-zk-blue transition-colors">
              ZK
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold font-serif-sc text-zk-red group-hover:text-zk-blue transition-colors">
                {SCHOOL_INFO.name}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Zhongkai High School
              </span>
            </div>
          </Link>

          {/* 桌面端导航 */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  prefetch={false}
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
            
            <a 
              href="#login" 
              className="ml-4 px-5 py-2 bg-zk-red text-white text-sm font-bold rounded-full shadow-md hover:bg-red-800 transition-transform hover:-translate-y-0.5"
            >
              师生登录
            </a>
          </div>

          {/* 移动端菜单按钮 */}
          <button 
            className="lg:hidden text-gray-700 hover:text-zk-red focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* 移动端菜单 */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex flex-col space-y-2 bg-gray-50 p-4 rounded-lg shadow-inner">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                prefetch={false}
                onClick={closeMenu}
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
              onClick={closeMenu}
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
