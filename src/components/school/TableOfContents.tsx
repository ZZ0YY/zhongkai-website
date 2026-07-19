'use client'

import { useEffect, useState } from 'react'
import type { HeadingItem } from '@/lib/markdown'

interface TableOfContentsProps {
  headings: HeadingItem[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // 只监控 h2 和 h3，与目录项匹配
    const elements = headings
      .filter((h) => h.level <= 3)
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[]

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    )

    for (const el of elements) {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  const tocItems = headings.filter((h) => h.level >= 2 && h.level <= 3)

  if (tocItems.length === 0) return null

  return (
    <nav
      className="toc-container hidden xl:block"
      aria-label="目录导航"
    >
      <div className="sticky top-24">
        <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
          目录
        </h4>
        <ul className="space-y-1 text-sm">
          {tocItems.map((heading) => {
            const isActive = activeId === heading.id
            const paddingLeft = heading.level === 3 ? 'pl-4' : ''
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block py-1 transition-colors duration-150 ${paddingLeft} ${
                    isActive
                      ? 'font-medium text-primary-600 dark:text-primary-400 border-l-2 border-primary-600 dark:border-primary-400 pl-3'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 border-l-2 border-transparent pl-3'
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    const el = document.getElementById(heading.id)
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      setActiveId(heading.id)
                    }
                  }}
                >
                  {heading.text}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
