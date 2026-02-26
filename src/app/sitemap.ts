import { MetadataRoute } from 'next';
import { SITE_CONFIG, getCombinedPosts } from '@/lib/data';

/**
 * 网站地图生成器
 * 符合百度、Google、Bing 标准
 * 重点：lastModified 使用文章真实日期，而非生成地图的当前时间
 */

const baseUrl = SITE_CONFIG.url || 'https://www.zkzxgzb.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. 获取所有模块的文章数据（包含本地和远程）
  const [news, courses, teachers, events, achievements] = await Promise.all([
    getCombinedPosts('news'),
    getCombinedPosts('courses'),
    getCombinedPosts('teachers'),
    getCombinedPosts('events'),
    getCombinedPosts('achievements'),
  ]);

  // 辅助函数：将 YYYY-MM-DD 字符串安全转换为 Date 对象
  const parseDate = (dateStr?: string) => {
    if (!dateStr) return new Date();
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  // 2. 静态页面配置
  // 首页：lastmod 取最新一篇文章的时间
  const allLatest = [...news, ...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const latestDate = allLatest.length > 0 ? parseDate(allLatest[0].date) : new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: latestDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/news`, lastModified: latestDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date('2024-01-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/teachers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/software`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date('2024-01-01'), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // 3. 动态文章页面生成
  const newsPages: MetadataRoute.Sitemap = news.map(post => ({
    url: `${baseUrl}/news/${post.id}`,
    lastModified: parseDate(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const coursePages: MetadataRoute.Sitemap = courses.map(post => ({
    url: `${baseUrl}/courses/${post.id}`,
    lastModified: parseDate(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const teacherPages: MetadataRoute.Sitemap = teachers.map(post => ({
    url: `${baseUrl}/teachers/${post.id}`,
    lastModified: parseDate(post.date),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  const eventPages: MetadataRoute.Sitemap = events.map(post => ({
    url: `${baseUrl}/events/${post.id}`,
    lastModified: parseDate(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const achievementPages: MetadataRoute.Sitemap = achievements.map(post => ({
    url: `${baseUrl}/achievements/${post.id}`,
    lastModified: parseDate(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // 4. 合并所有页面
  return [
    ...staticPages,
    ...newsPages,
    ...coursePages,
    ...teacherPages,
    ...eventPages,
    ...achievementPages,
  ];
}