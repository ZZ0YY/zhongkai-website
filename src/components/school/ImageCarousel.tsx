/**
 * ImageCarousel 组件 - 高性能图片轮播
 * 
 * 【修复说明】
 * - 支持全屏模式（fillMode），用于首页背景
 * - 图片自适应填满容器，解决移动端空白问题
 * - 按钮使用固定定位穿透遮罩层
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
  /** 是否在首页背景模式下运行（图片填满容器） */
  fillMode?: boolean;
}

export default function ImageCarousel({ 
  images, 
  autoPlayInterval = 5000,
  fillMode = false
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

  // 触摸滑动支持
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (images.length === 0) return null;

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 图片容器 */}
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`w-full flex-shrink-0 relative ${fillMode ? 'h-full' : ''}`}
            style={fillMode ? undefined : { aspectRatio: '16/9' }}
          >
            <img 
              src={image.src} 
              alt={image.alt} 
              loading={index === 0 ? 'eager' : 'lazy'} 
              className="w-full h-full object-cover" 
            />
            {/* 图片标题 - 仅在非 fillMode 下显示 */}
            {image.caption && !fillMode && (
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
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-[100]"
        aria-label="上一张"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* 下一张按钮 */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }} 
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-[100]"
        aria-label="下一张"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 指示点 */}
      <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-[100]">
        {images.map((_, index) => (
          <button 
            key={index} 
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }} 
            className={`transition-all duration-200 rounded-full ${
              index === currentIndex 
                ? 'bg-white w-5 h-2 md:w-6' 
                : 'bg-white/50 hover:bg-white/80 w-2 h-2'
            }`}
            aria-label={`跳转到第 ${index + 1} 张`}
          />
        ))}
      </div>
    </div>
  );
}
