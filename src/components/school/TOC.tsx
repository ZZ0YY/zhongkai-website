'use client'

import { useEffect, useState } from 'react'

/**
 * TOC 目录项
 */
interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * 浮动目录组件
 *
 * 功能：
 * 1. 从页面中提取所有 .content-header 标题
 * 2. 高亮当前阅读位置对应的标题
 * 3. 点击跳转到对应位置
 * 4. 响应式：桌面端显示侧边栏，移动端不显示
 */
export default function TOC() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  // 提取页面标题
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4, .prose .content-header')
    )

    const items: TocItem[] = elements.map((el) => {
      const level = parseInt(el.tagName.charAt(1))
      const id = el.id || el.querySelector('a')?.getAttribute('href')?.slice(1) || ''
      // 获取纯文本（排除锚点链接图标）
      const textEl = el.cloneNode(true) as HTMLElement
      const linkEl = textEl.querySelector('.content-header-link')
      if (linkEl) linkEl.remove()
      const text = textEl.textContent?.trim() || ''

      return { id, text, level }
    }).filter(item => item.id && item.text)

    setHeadings(items)
  }, [])

  // IntersectionObserver 追踪当前标题
  useEffect(() => {
    if (headings.length === 0) return

    const observers: IntersectionObserver[] = []

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(id)
            }
          })
        },
        {
          rootMargin: '-80px 0px -70% 0px',
          threshold: 0,
        }
      )

      observer.observe(element)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [headings])

  // 无标题时不渲染
  if (headings.length < 2) return null

  return (
    <nav
      className="hidden xl:block sticky top-24 ml-8 w-56 shrink-0"
      aria-label="目录导航"
    >
      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">
        目录
      </h4>
      <ul className="space-y-1 text-sm border-l border-gray-200 dark:border-gray-700">
        {headings.map(({ id, text, level }) => {
          const isActive = activeId === id
          const paddingLeft = level === 1 ? 'pl-3' : level === 2 ? 'pl-5' : 'pl-7'

          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`block py-1 ${paddingLeft} transition-colors duration-200 border-l-2 -ml-px ${
                  isActive
                    ? 'border-zk-red text-zk-red dark:border-zk-red dark:text-zk-red font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <span className="line-clamp-2">{text}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
