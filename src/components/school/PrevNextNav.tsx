import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PrevNextNavProps {
  prev?: {
    id: string
    title: string
  } | null
  next?: {
    id: string
    title: string
  } | null
  basePath?: string // 默认 '/news'
}

export function PrevNextNav({ prev, next, basePath = '/news' }: PrevNextNavProps) {
  if (!prev && !next) return null

  return (
    <nav className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 上一篇 */}
        <div className="flex items-center">
          {prev ? (
            <Link
              href={`${basePath}/${prev.id}`}
              className="group flex items-center gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
            >
              <ChevronLeftIcon className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              <div className="min-w-0">
                <span className="block text-xs text-gray-500 dark:text-gray-400">上一篇</span>
                <span className="block truncate text-sm font-medium text-gray-900 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
                  {prev.title}
                </span>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* 下一篇 */}
        <div className="flex items-center justify-end">
          {next ? (
            <Link
              href={`${basePath}/${next.id}`}
              className="group flex items-center gap-2 rounded-lg border border-gray-200 p-4 text-right transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:hover:border-primary-600 dark:hover:bg-primary-900/20"
            >
              <div className="min-w-0">
                <span className="block text-xs text-gray-500 dark:text-gray-400">下一篇</span>
                <span className="block truncate text-sm font-medium text-gray-900 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
                  {next.title}
                </span>
              </div>
              <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>
    </nav>
  )
}
