/**
 * ============================================================================
 * 图片无损放大查看组件 (Lightbox) - 惠州仲恺中学官网
 * ============================================================================
 *
 * 【功能说明】
 * 利用 framer-motion 的 AnimatePresence + layoutId 实现：
 * 1. 文章中的图片点击后无缝平滑放大到全屏中心
 * 2. 放大状态使用 object-fit: contain 完整展示图片（不截断）
 * 3. 多种关闭方式：点击背景 / 点击图片 / ESC 键 / 向下滑动
 * 4. 放大时自动锁定背景滚动
 * 5. 光标提示：zoom-in / zoom-out
 *
 * 【技术要点】
 * - MarkdownRenderer 输出的 HTML 中 <img> 标签被解析提取为 React 组件
 * - 内联图片和放大图片共享 layoutId，实现精确的 FLIP 动画
 * - 使用 display:contents 包裹文本段，保持原始 HTML 结构不被破坏
 */

"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";

// ============================================================================
// HTML 解析器 - 将 <img> 标签从 HTML 字符串中提取为独立段落
// ============================================================================

interface HtmlSegment {
  type: "html";
  content: string;
}

interface ImageSegment {
  type: "image";
  src: string;
  alt: string;
}

type Segment = HtmlSegment | ImageSegment;

/**
 * 解析 HTML 字符串，将所有 <img> 标签拆分为独立的 ImageSegment，
 * 其余内容保持为 HtmlSegment。
 *
 * 【示例】
 * 输入: "<p>文字</p><img src='a.jpg'><p>更多文字</p>"
 * 输出: [
 *   { type: "html", content: "<p>文字</p>" },
 *   { type: "image", src: "a.jpg", alt: "" },
 *   { type: "html", content: "<p>更多文字</p>" },
 * ]
 */
function parseHtmlForImages(html: string): Segment[] {
  const segments: Segment[] = [];
  // 匹配 <img> 标签（兼容自闭合和非自闭合写法）
  const imgRegex = /<img\s+([\s\S]*?)\/?>/gi;
  let lastIndex = 0;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    // 图片标签之前的 HTML 内容
    if (match.index > lastIndex) {
      segments.push({
        type: "html",
        content: html.slice(lastIndex, match.index),
      });
    }

    // 提取 src 和 alt 属性
    const attrs = match[1];
    const src = attrs.match(/src=["']([^"']+)["']/i)?.[1] || "";
    const alt = attrs.match(/alt=["']([^"']*)["']/i)?.[1] || "";

    if (src) {
      segments.push({ type: "image", src, alt });
    } else {
      // src 为空的图片标签，保留为原始 HTML（不创建放大组件）
      segments.push({ type: "html", content: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  // 最后一段 HTML 内容
  if (lastIndex < html.length) {
    segments.push({ type: "html", content: html.slice(lastIndex) });
  }

  return segments;
}

// ============================================================================
// ZoomableImage - 可放大查看的单张图片组件
// ============================================================================

/** 全局递增计数器，为每个图片生成唯一的 layoutId */
let layoutIdCounter = 0;

function generateLayoutId(): string {
  return `lightbox-img-${++layoutIdCounter}`;
}

interface ZoomableImageProps {
  /** 图片 URL */
  src: string;
  /** 图片 alt 文本 */
  alt?: string;
}

/**
 * 可放大查看的图片组件
 *
 * 【内联状态】object-fit: cover，aspect-ratio: 16/9，保持布局整齐
 * 【放大状态】object-fit: contain，完整展示图片细节
 */
export function ZoomableImage({ src, alt = "" }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  // 使用 useRef 确保 layoutId 在组件生命周期内保持不变
  const layoutId = useRef(generateLayoutId()).current;

  // ========================================================================
  // 滚动锁定：放大时禁止背景页面滚动
  // ========================================================================
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // ========================================================================
  // ESC 键关闭
  // ========================================================================
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // ========================================================================
  // 拖拽关闭：向下滑动超过阈值或速度足够快时触发
  // ========================================================================
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // 向下滑动超过 120px，或者向下速度超过 500px/s 时关闭
    if (info.offset.y > 120 || info.velocity.y > 500) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ================================================================
       * 内联图片 —— 文章流中的正常显示
       * ================================================================ */}
      <motion.div
        layoutId={layoutId}
        className="my-6 cursor-zoom-in overflow-hidden rounded-lg shadow-md mx-auto bg-gray-100"
        style={{ aspectRatio: "16 / 9" }}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          draggable={false}
          loading="lazy"
        />
      </motion.div>

      {/* ================================================================
       * Lightbox 全屏放大层
       * ================================================================ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            /* ---------- 外层容器：固定全屏定位 ---------- */
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            /* 点击背景关闭 */
            onClick={() => setIsOpen(false)}
          >
            {/* -------- 半透明黑色背景 + 毛玻璃 -------- */}
            <motion.div
              className="absolute inset-0 bg-black/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />

            {/* -------- 放大的图片（layoutId 实现无缝 FLIP 动画） -------- */}
            <motion.img
              layoutId={layoutId}
              src={src}
              alt={alt}
              className="relative z-10 max-w-[92vw] max-h-[88vh] rounded-lg cursor-zoom-out shadow-2xl"
              style={{ objectFit: "contain" }}
              /* layoutId 动画过渡参数 */
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
              /* 向下拖拽关闭（移动端友好） */
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              /* 点击图片自身也关闭，阻止冒泡到背景层 */
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================================
// MarkdownContent - 带图片放大功能的 Markdown 内容渲染组件
// ============================================================================

interface MarkdownContentProps {
  /** 转换后的 HTML 内容 */
  html: string;
  /** Tailwind prose 类名 */
  className: string;
}

/**
 * 将 HTML 字符串解析为文本段和图片段：
 * - 文本段使用 dangerouslySetInnerHTML 渲染（包裹在 display:contents 的 span 中，不破坏布局）
 * - 图片段使用 ZoomableImage 组件渲染（支持点击放大）
 */
export function MarkdownContent({ html, className }: MarkdownContentProps) {
  const segments = useMemo(() => parseHtmlForImages(html), [html]);

  return (
    <div className={className}>
      {segments.map((segment, i) => {
        if (segment.type === "html") {
          return (
            <span
              key={`html-${i}`}
              style={{ display: "contents" }}
              dangerouslySetInnerHTML={{ __html: segment.content }}
            />
          );
        }
        return (
          <ZoomableImage
            key={`img-${i}`}
            src={segment.src}
            alt={segment.alt}
          />
        );
      })}
    </div>
  );
}
