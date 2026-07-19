import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// ========== 数据获取 ==========

interface ArticleSummary {
  id: string
  title: string
  date: string
  summary?: string
  tags?: string[]
}

async function getArticlesByTag(tag: string): Promise<ArticleSummary[]> {
  // TODO: 替换为你自己的数据获取逻辑
  // 需要同时搜索本地 MD 文章和 Hexo 远程文章
  // const localPosts = await getLocalPosts()
  // const hexoPosts = await getHexoPosts()
  // 过滤包含此标签的文章...
  
  // 临时占位
  return []
}

async function getAllTagNames(): Promise<string[]> {
  // TODO: 替换为你自己的数据获取逻辑
  return []
}

// ========== 元数据 ==========

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  return {
    title: `标签: ${decodedTag}`,
    description: `查看所有标签为「${decodedTag}」的文章`,
  }
}

// ========== 静态路径生成（可选） ==========

export async function generateStaticParams() {
  const tags = await getAllTagNames()
  return tags.map((tag) => ({ tag: encodeURIComponent(tag) }))
}

// ========== 页面 ==========

export default async function TagArticlesPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const articles = await getArticlesByTag(decodedTag)

  if (articles.length === 0 && process.env.NODE_ENV === 'production') {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* 返回标签列表 */}
      <Link
        href="/tags"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        全部标签
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">
        标签：{decodedTag}
        <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
          ({articles.length} 篇)
        </span>
      </h1>

      {articles.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          该标签下暂无文章
        </p>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group rounded-lg border border-gray-200 p-6 transition-colors hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/10"
            >
              <Link href={`/news/${article.id}`}>
                <h2 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
                  {article.title}
                </h2>
                <time className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
                  {article.date}
                </time>
                {article.summary && (
                  <p className="text-gray-600 dark:text-gray-300">
                    {article.summary}
                  </p>
                )}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {article.tags.map((t) => (
                      <span
                        key={t}
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          t === decodedTag
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
