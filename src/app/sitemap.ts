/**
 * sitemap.ts - 网站地图生成器
 * 
 * 【功能说明】
 * - 每次 Vercel 部署时自动生成
 * - 包含所有静态和动态路由
 * - 支持从远程 API 获取动态文章 ID
 * 
 * 【ISR 配置】
 * revalidate = 60 (60秒重新验证)
 */

import { MetadataRoute } from 'next';
import { SITE_CONFIG, getPostIds } from '@/lib/data';

const baseUrl = SITE_CONFIG.url || 'https://test.zkzxgzb.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  
  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/courses`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/teachers`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/events`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/achievements`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/software`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
  
  // 动态获取各模块的文章 ID
  const [newsIds, coursesIds, teachersIds, eventsIds, achievementsIds] = await Promise.all([
    getPostIds('news'),
    getPostIds('courses'),
    getPostIds('teachers'),
    getPostIds('events'),
    getPostIds('achievements'),
  ]);
  
  // 新闻详情页
  const newsPages: MetadataRoute.Sitemap = newsIds.map((id) => ({
    url: `${baseUrl}/news/${id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  
  // 课程详情页
  const coursePages: MetadataRoute.Sitemap = coursesIds.map((id) => ({
    url: `${baseUrl}/courses/${id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  
  // 教师详情页
  const teacherPages: MetadataRoute.Sitemap = teachersIds.map((id) => ({
    url: `${baseUrl}/teachers/${id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));
  
  // 活动详情页
  const eventPages: MetadataRoute.Sitemap = eventsIds.map((id) => ({
    url: `${baseUrl}/events/${id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));
  
  // 成果详情页
  const achievementPages: MetadataRoute.Sitemap = achievementsIds.map((id) => ({
    url: `${baseUrl}/achievements/${id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));
  
  return [
    ...staticPages,
    ...newsPages,
    ...coursePages,
    ...teacherPages,
    ...eventPages,
    ...achievementPages,
  ];
}
