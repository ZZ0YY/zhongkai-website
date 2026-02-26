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

    // 根据参数决定推送全量还是最近 20 条
    const dynamicUrls = allPosts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(post => `${baseUrl}/${post._module || 'news'}/${post.id}`);

    const finalUrls = pushType === 'full' 
      ? [...staticUrls, ...dynamicUrls] 
      : [...staticUrls, ...dynamicUrls.slice(0, 20)];

    // 去重
    const uniqueUrls = Array.from(new Set(finalUrls));

    // 3. 百度推送 (文本格式)
    const baiduUrl = `http://data.zz.baidu.com/urls?site=${baseUrl}&token=${process.env.BAIDU_TOKEN}`;
    const baiduPromise = fetch(baiduUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: uniqueUrls.join('\n'),
    }).then(res => res.json());

    // 4. IndexNow 推送 (JSON格式)
    const indexNowPromise = fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: "www.zkzxgzb.com",
        key: process.env.INDEXNOW_KEY,
        keyLocation: `${baseUrl}/${process.env.INDEXNOW_KEY}.txt`,
        urlList: uniqueUrls,
      }),
    });

    const [baiduResult, indexNowResult] = await Promise.all([baiduPromise, indexNowPromise]);

    return NextResponse.json({
      type: pushType === 'full' ? 'Full Push' : 'Latest Push',
      count: uniqueUrls.length,
      baidu: baiduResult,
      bingStatus: indexNowResult.status, // 200 为成功
      urls: uniqueUrls // 调试用，可以看到推送了哪些
    });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}