/**
 * sitemap.ts - 网站地图生成器
 * 
 * 每次 Vercel 部署时自动生成，包含所有静态和动态路由
 */

import { MetadataRoute } from 'next';
import { 
  NEWS_DATA, 
  COURSES_DATA, 
  TEACHERS_DATA, 
  EVENTS_DATA, 
  SITE_CONFIG 
} from '@/lib/data';

const baseUrl = SITE_CONFIG.url || 'https://test.zkzxgzb.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  
  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/teachers`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/achievements`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
  
  // 新闻详情页
  const newsPages: MetadataRoute.Sitemap = NEWS_DATA.map((news) => ({
    url: `${baseUrl}/news/${news.id}`,
    lastModified: new Date(news.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  
  // 课程详情页
  const coursePages: MetadataRoute.Sitemap = COURSES_DATA.map((course) => ({
    url: `${baseUrl}/courses/${course.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  
  // 教师详情页
  const teacherPages: MetadataRoute.Sitemap = TEACHERS_DATA.map((teacher) => ({
    url: `${baseUrl}/teachers/${teacher.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));
  
  // 活动详情页
  const eventPages: MetadataRoute.Sitemap = EVENTS_DATA.map((event) => ({
    url: `${baseUrl}/events/${event.id}`,
    lastModified: new Date(event.date),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));
  
  return [
    ...staticPages,
    ...newsPages,
    ...coursePages,
    ...teacherPages,
    ...eventPages,
  ];
}
