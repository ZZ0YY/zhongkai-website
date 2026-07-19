import Link from 'next/link'
import type { Metadata } from 'next'

// ========== 数据获取 ==========
// 你需要根据自己的数据源替换此函数
// 本地 MD 文章从文件系统读取，Hexo 远程文章从 API 获取

interface ArticleTag {
  name: string
  count: number
}

async function getAllTags(): Promise<ArticleTag[]> {
  // TODO: 替换为你自己的数据获取逻辑
  // 示例：从本地文章 + Hexo 远程文章中聚合标签
  // const localPosts = await getLocalPosts()
  // const hexoPosts = await getHexoPosts()
  // 聚合标签计数...
  
  // 临时占位
  return []
}

// ========== 页面 ==========

export const metadata: Metadata = {
  title: '标签',
  description: '按标签浏览所有文章',
}

export default async function TagsPage() {
  const tags = await getAllTags()
  // 按文章数量降序排列
  const sortedTags = [...tags].sort((a, b) => b.count - a.count)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">
        标签
      </h1>

      {sortedTags.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">暂无标签</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {sortedTags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
            >
              <span>{tag.name}</span>
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gray-100 px-1.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
