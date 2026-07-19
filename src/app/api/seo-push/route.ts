import { NextResponse } from 'next/server';
import { SITE_CONFIG, getCombinedPosts } from '@/lib/data';

const baseUrl = SITE_CONFIG.url || 'https://www.zkzxgzb.com';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const pushType = searchParams.get('type'); // 'full' or 'latest'

  // 1. 安全校验
  if (secret !== process.env.PUSH_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. 收集所有模块的 URL
    const modules = ['news', 'events', 'achievements', 'teachers', 'courses'];
    
    // 获取数据（并行请求提高效率）
    const results = await Promise.all(modules.map(m => getCombinedPosts(m)));
    const allPosts = results.flat();

    // 静态基础页面
    const staticUrls = [
      `${baseUrl}/`,
      `${baseUrl}/about`,
      `${baseUrl}/news`,
      `${baseUrl}/courses`,
      `${baseUrl}/teachers`,
      `${baseUrl}/events`,
      `${baseUrl}/achievements`,
      `${baseUrl}/software`,
      `${baseUrl}/contact`,
    ];

    // 按时间排序的动态 URL 池
    const dynamicUrls = allPosts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(post => `${baseUrl}/${post._module || 'news'}/${post.id}`);

    // 【Bing / IndexNow 逻辑】：维持原状
    const bingUrls = pushType === 'full' 
      ? Array.from(new Set([...staticUrls, ...dynamicUrls]))
      : Array.from(new Set([...staticUrls, ...dynamicUrls.slice(0, 10)]));

    // 【百度逻辑】：每天滚动提取 10 条动态链接 + 基础静态页
    // 计算当前是一年中的第几天 (0-365)
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // 每次取 10 条，根据天数计算切片起点
    const baiduBatchSize = 10;
    let baiduDynamicUrls: string[] = [];
    
    if (dynamicUrls.length > 0) {
      const startIndex = (dayOfYear * baiduBatchSize) % dynamicUrls.length;
      
      // 如果切片到了数组尾部不够 10 条，循环取头部的补齐
      for (let i = 0; i < baiduBatchSize; i++) {
        const index = (startIndex + i) % dynamicUrls.length;
        baiduDynamicUrls.push(dynamicUrls[index]);
      }
    }

    // 百度的最终推送列表（去重）
    const baiduUrls = Array.from(new Set([...staticUrls, ...baiduDynamicUrls]));

    // 3. 百度推送 (文本格式) - 使用计算出的 baiduUrls
    const baiduUrl = `http://data.zz.baidu.com/urls?site=${baseUrl}&token=${process.env.BAIDU_TOKEN}`;
    const baiduPromise = fetch(baiduUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: baiduUrls.join('\n'),
    }).then(res => res.json());

    // 4. IndexNow 推送 (JSON格式) - 使用原计划的 bingUrls
    const indexNowPromise = fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: "www.zkzxgzb.com",
        key: process.env.INDEXNOW_KEY,
        keyLocation: `${baseUrl}/${process.env.INDEXNOW_KEY}.txt`,
        urlList: bingUrls,
      }),
    });

    const [baiduResult, indexNowResult] = await Promise.all([baiduPromise, indexNowPromise]);

    return NextResponse.json({
      type: pushType === 'full' ? 'Full Push' : 'Latest Push',
      totalDynamicCount: dynamicUrls.length,
      baidu: {
        pushedCount: baiduUrls.length,
        baiduResult,
        urls: baiduUrls // 方便调试查看今天百度推了哪 10 条
      },
      bing: {
        pushedCount: bingUrls.length,
        status: indexNowResult.status,
        urls: bingUrls
      }
    });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}