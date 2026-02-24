/**
 * ImageCarousel 组件 - 高性能图片轮播
 * 
 * 【修复说明】
 * - 添加了 z-index 控制，确保按钮不会被遮罩层遮挡
 * - 优化了按钮的 pointer-events，确保点击事件正常触发
 * - 添加 heroMode 模式，在首页背景使用时按钮 z-index 更高
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlayInterval?: number;
  /** 是否在首页背景模式下运行（按钮z-index更高） */
  heroMode?: boolean;
}

export default function ImageCarousel({ 
  images, 
  autoPlayInterval = 5000,
  heroMode = false
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setInterval(nextSlide, autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, autoPlayInterval, nextSlide]);

  if (images.length === 0) return null;

  // heroMode 下按钮需要更高的 z-index（在遮罩层之上）
  const buttonZIndex = heroMode ? 'z-30' : 'z-10';
  const dotsZIndex = heroMode ? 'z-30' : 'z-10';

  return (
    <div 
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* 图片容器 */}
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 relative" style={{ aspectRatio: '16/9' }}>
            <img 
              src={image.src} 
              alt={image.alt} 
              loading={index === 0 ? 'eager' : 'lazy'} 
              className="w-full h-full object-cover" 
            />
            {/* 图片标题 - 仅在非 heroMode 下显示 */}
            {image.caption && !heroMode && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 z-[5]">
                <p className="text-white font-medium">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 上一张按钮 */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }} 
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${buttonZIndex}`}
        style={{ pointerEvents: 'auto' }}
        aria-label="上一张"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* 下一张按钮 */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }} 
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${buttonZIndex}`}
        style={{ pointerEvents: 'auto' }}
        aria-label="下一张"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 指示点 */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 ${dotsZIndex}`}>
        {images.map((_, index) => (
          <button 
            key={index} 
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }} 
            className={`transition-all duration-200 rounded-full ${
              index === currentIndex 
                ? 'bg-white w-6 h-2' 
                : 'bg-white/50 hover:bg-white/80 w-2 h-2'
            }`}
            style={{ pointerEvents: 'auto' }}
            aria-label={`跳转到第 ${index + 1} 张`}
          />
        ))}
      </div>
    </div>
  );
}
