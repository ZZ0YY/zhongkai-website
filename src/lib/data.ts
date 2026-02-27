/**
 * ============================================================================
 * 数据中心 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【修复说明】
 * 1. 统一博客 URL 配置，确保与博客部署地址一致
 * 2. 修复文章跳转链接，使用 abbrlink 作为文章 ID
 * 3. 优化分类映射，支持更多博客分类
 * 4. 域名统一为 www.zkzxgzb.com
 * 5. 【修复】正确处理 Hexo categories 对象格式
 */

import { 
  NavItem, 
  NewsItem, 
  Teacher, 
  EventItem, 
  Course, 
  SchoolInfo,
  Honor,
  Software,
  HexoPost,
  CombinedPost
} from './types';

// ============================================================================
// ISR 配置 - 60秒重新验证
// ============================================================================
export const revalidate = 60;

// ============================================================================
// 博客 URL 配置（统一配置，便于维护）
// ============================================================================
/**
 * 【重要】博客部署地址
 * 博客嵌入官网路径：/news/blog/
 */
export const BLOG_URL = 'https://www.zkzxgzb.com/news/blog';

/**
 * 博客 API 地址（content.json）
 */
const HEXO_API_URL = `${BLOG_URL}/content.json`;

// ============================================================================
// 分类映射配置
// ============================================================================
/**
 * CATEGORY_MAP - Hexo 分类到官网模块的映射
 */
const CATEGORY_MAP: Record<string, string> = {
  '新闻动态': 'news',
  '校园新闻': 'news',
  '通知公告': 'news',
  '教务动态': 'news',
  '校园活动': 'events',
  '课程教学': 'courses',
  '师资力量': 'teachers',
  '办学成果': 'achievements',
  '荣誉时刻': 'achievements',
};

/**
 * 反向映射：模块名 -> Hexo 分类名
 * 【说明】可以在这里添加更多分类名，用逗号分隔
 */
const MODULE_TO_CATEGORY: Record<string, string[]> = {
  'news': ['新闻动态', '校园新闻', '通知公告', '教务动态', '学校新闻', '新闻'],
  'courses': ['课程教学', '课程', '教学'],
  'teachers': ['师资力量', '教师风采', '教师', '名师风采', '优秀教师'],
  'events': ['校园活动', '活动', '校园生活', '学生活动'],
  'achievements': ['办学成果', '荣誉时刻', '成果', '荣誉', '获奖'],
};

// ============================================================================
// 学校基本信息
// ============================================================================
export const SCHOOL_INFO: SchoolInfo = {
  name: "惠州仲恺中学",
  fullName: "惠州市仲恺中学",
  address: "广东省惠州市仲恺高新区陈江街道",
  phone: "0752-3323215",
  email: "zyj2111479855@gmail.com",
  founded: 1964, // 前身为陈江农业中学，1964年创办
  level: "广东省一级学校",
  description: "仲恺中学是以中国民主革命先驱、伟大的爱国主义者廖仲恺先生的名字命名的名人纪念性完全中学，是惠州仲恺高新区唯一的一所区直属中学，广东省一级学校。",
  studentOrgName: "仲恺中学融媒体中心 & 信息社",
  motto: "人生最重是精神，精神日新德日新",
  philosophy: "师名人风范，育一代英才", // 办学理念
  strategy: "三品三促", // 办学思路
};

// ============================================================================
// 导航配置
// ============================================================================
export const NAV_ITEMS: NavItem[] = [
  { label: '网站首页', path: '/' },
  { label: '学校概况', path: '/about' },
  { label: '课程教学', path: '/courses' },
  { label: '校园活动', path: '/events' },
  { label: '师资力量', path: '/teachers' },
  { label: '办学成果', path: '/achievements' },
  { label: '教学软件', path: '/software' },
  { label: '新闻动态', path: '/news' },
  { label: '联系我们', path: '/contact' },
];

// ============================================================================
// 首页轮播图数据
// ============================================================================
export const HERO_SLIDES = [
  {
    image: "https://picsum.photos/1920/1080?random=1",
    title: "人生最重是精神，精神日新德日新",
    subtitle: "传承仲恺精神，培育时代新人"
  },
  {
    image: "https://picsum.photos/1920/1080?random=2",
    title: "广东省一级学校",
    subtitle: "名人纪念性完全中学，办学规模居惠州市前列"
  },
  {
    image: "https://picsum.photos/1920/1080?random=3",
    title: "师名人风范，育一代英才",
    subtitle: "三品三促办学思路，促学生成才教师成长学校成功"
  }
];

// ============================================================================
// 远程数据获取函数
// ============================================================================

/**
 * 从 Hexo 博客 API 获取文章数据
 */
async function fetchHexoPosts(): Promise<HexoPost[]> {
  try {
    console.log(`[数据中心] 正在获取博客数据: ${HEXO_API_URL}`);
    
    const response = await fetch(HEXO_API_URL, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`[数据中心] 获取远程数据失败: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    
    // Hexo JSON 结构可能是 { posts: [...] } 或直接是数组
    const posts = Array.isArray(data) ? data : (data.posts || []);
    
    console.log(`[数据中心] 成功获取 ${posts.length} 篇远程文章`);
    return posts;
  } catch (error) {
    console.error('[数据中心] 获取远程数据异常:', error);
    return [];
  }
}

// ============================================================================
// 静态数据（本地后备数据）
// ============================================================================

export const NEWS_DATA: NewsItem[] = [
  {
    id: 1,
    title: "我校召开新学期教学工作部署会议",
    date: "2023-09-01",
    category: "教务动态",
    summary: "为确保新学期教学工作平稳有序进行，全面提升教学质量，我校于学术报告厅召开新学期教学工作部署会议。",
    image: "https://picsum.photos/600/400?random=10"
  },
  {
    id: 2,
    title: "喜报：我校学子在市科技创新大赛中斩获佳绩",
    date: "2023-08-25",
    category: "荣誉时刻",
    summary: "在刚刚结束的惠州市青少年科技创新大赛中，我校代表队凭借作品《智能灌溉系统》荣获一等奖。",
    image: "https://picsum.photos/600/400?random=11"
  },
  {
    id: 3,
    title: "青春心向党主题演讲比赛圆满落幕",
    date: "2023-08-10",
    category: "校园活动",
    summary: "为庆祝建党活动，弘扬爱国主义精神，校团委组织了精彩的演讲比赛。",
    image: "https://picsum.photos/600/400?random=12"
  },
  {
    id: 4,
    title: "2024年秋季招生工作正式启动",
    date: "2023-07-15",
    category: "通知公告",
    summary: "根据市教育局统一部署，我校2024年秋季招生工作正式启动。",
    image: "https://picsum.photos/600/400?random=13"
  },
  {
    id: 5,
    title: "我校教师荣获省级教学能手称号",
    date: "2023-06-20",
    category: "荣誉时刻",
    summary: "在广东省中小学教师教学能力大赛中，我校语文组张老师荣获省级教学能手称号。",
    image: "https://picsum.photos/600/400?random=14"
  },
  {
    id: 6,
    title: "校园文化艺术节精彩纷呈",
    date: "2023-05-18",
    category: "校园活动",
    summary: "为期一周的第十五届校园文化艺术节圆满落幕，各类比赛精彩纷呈。",
    image: "https://picsum.photos/600/400?random=15"
  }
];

export const TEACHERS_DATA: Teacher[] = [
  { id: 1, name: "张老师", title: "高级教师", subject: "语文", image: "https://picsum.photos/300/300?random=20", description: "惠州市优秀班主任，拥有30年丰富的教学经验，深受学生爱戴。" },
  { id: 2, name: "李老师", title: "骨干教师", subject: "数学", image: "https://picsum.photos/300/300?random=21", description: "数学奥林匹克竞赛优秀辅导员，教学风格幽默风趣。" },
  { id: 3, name: "王老师", title: "外籍教师", subject: "英语口语", image: "https://picsum.photos/300/300?random=22", description: "来自英国，拥有TESOL证书，致力于为学生创造纯正的英语语言环境。" },
  { id: 4, name: "陈老师", title: "一级教师", subject: "物理", image: "https://picsum.photos/300/300?random=23", description: "专注于物理实验教学创新，多次在省市级教学比赛中获奖。" },
  { id: 5, name: "刘老师", title: "高级教师", subject: "化学", image: "https://picsum.photos/300/300?random=24", description: "化学教研组组长，指导学生多次在化学竞赛中获奖。" },
  { id: 6, name: "黄老师", title: "骨干教师", subject: "历史", image: "https://picsum.photos/300/300?random=25", description: "历史学科带头人，善于将历史故事融入教学。" }
];

export const COURSES_DATA: Course[] = [
  { id: 1, title: "国家基础课程", type: "国家课程", description: "严格按照国家课程标准，开齐开足语文、数学、英语、物理、历史等基础学科。", image: "https://picsum.photos/600/400?random=30", features: ["扎实基础", "科学素养", "人文底蕴"] },
  { id: 2, title: "创客与编程", type: "校本课程", description: "依托学校科技馆，开设Python编程、3D打印、机器人控制等前沿科技课程。", image: "https://picsum.photos/600/400?random=31", features: ["创新思维", "动手实践", "科技前沿"] },
  { id: 3, title: "仲恺文化研学", type: "德育活动", description: "探访廖仲恺先生纪念碑、陈江人文古迹，传承红色基因与本土文化。", image: "https://picsum.photos/600/400?random=32", features: ["爱国教育", "实地研学", "文化传承"] },
  { id: 4, title: "艺术与审美", type: "校本课程", description: "开设书法、绘画、音乐、舞蹈等艺术课程，培养学生的审美情趣。", image: "https://picsum.photos/600/400?random=33", features: ["艺术修养", "审美能力", "创意表达"] },
  { id: 5, title: "体育与健康", type: "国家课程", description: "开设篮球、足球、田径、游泳等体育课程，增强学生体质。", image: "https://picsum.photos/600/400?random=34", features: ["强健体魄", "团队协作", "终身运动"] },
  { id: 6, title: "社会实践", type: "德育活动", description: "组织学生参与社区服务、志愿服务等社会实践活动。", image: "https://picsum.photos/600/400?random=35", features: ["社会责任", "实践能力", "公民意识"] }
];

export const EVENTS_DATA: EventItem[] = [
  { id: 1, title: "第十五届校园文化艺术节", date: "2023-12-01", month: "12月", day: "01", location: "学校大礼堂", image: "https://picsum.photos/500/350?random=40", description: "为期一周的艺术盛宴，包含书法、绘画、歌唱、舞蹈等多种比赛项目。" },
  { id: 2, title: "秋季田径运动会", date: "2023-11-15", month: "11月", day: "15", location: "学校体育场", image: "https://picsum.photos/500/350?random=41", description: "全校师生参与的体育盛会，展现仲恺学子的运动风采。" },
  { id: 3, title: "成人礼暨高考誓师大会", date: "2023-05-04", month: "05月", day: "04", location: "学校广场", image: "https://picsum.photos/500/350?random=42", description: "高三学子成人礼仪式，激励学子为梦想奋斗。" },
  { id: 4, title: "科技创新大赛", date: "2023-10-20", month: "10月", day: "20", location: "科技馆", image: "https://picsum.photos/500/350?random=43", description: "展示学生科技创新成果，激发创新潜能。" },
  { id: 5, title: "春季研学活动", date: "2023-04-15", month: "04月", day: "15", location: "廖仲恺纪念园", image: "https://picsum.photos/500/350?random=44", description: "探访革命先烈故居，传承红色基因。" },
  { id: 6, title: "元旦文艺晚会", date: "2023-12-31", month: "12月", day: "31", location: "学校大礼堂", image: "https://picsum.photos/500/350?random=45", description: "辞旧迎新，师生同乐，共度美好时光。" }
];

export const HONORS_DATA: Honor[] = [
  { id: 1, title: "广东省一级学校", year: 2006, description: "广东省教育厅评定" },
  { id: 2, title: "广东省绿色学校", year: 2008, description: "广东省教育厅、环保厅联合评定" },
  { id: 3, title: "惠州市一级学校", year: 2004, description: "惠州市教育局评定" },
  { id: 4, title: "德育示范学校", year: 2010, description: "惠州市教育局评定" },
  { id: 5, title: "广东省普通高中教学水平优秀学校", year: 2008, description: "广东省教育厅评定" },
  { id: 6, title: "惠州市文明校园", year: 2015, description: "惠州市文明办评定" }
];

export const SOFTWARE_DATA: Software[] = [
  { id: 1, title: "GeoGebra", category: "学科软件", description: "免费的数学软件，支持几何、代数、微积分等多种数学运算。", image: "https://picsum.photos/600/400?random=60", platform: ["Windows", "Mac", "Linux", "Web", "iOS", "Android"], downloadUrl: "https://www.geogebra.org/download", officialUrl: "https://www.geogebra.org", tags: ["免费", "开源", "数学"] },
  { id: 2, title: "Obsidian", category: "办公软件", description: "强大的知识管理工具，支持双向链接和图谱视图。", image: "https://picsum.photos/600/400?random=61", platform: ["Windows", "Mac", "Linux", "iOS", "Android"], downloadUrl: "https://obsidian.md/download", officialUrl: "https://obsidian.md", tags: ["免费", "笔记", "知识管理"] },
  { id: 3, title: "Scratch", category: "教学工具", description: "MIT开发的图形化编程工具，适合初学者学习编程思维。", image: "https://picsum.photos/600/400?random=62", platform: ["Windows", "Mac", "Web"], downloadUrl: "https://scratch.mit.edu/download", officialUrl: "https://scratch.mit.edu", tags: ["免费", "开源", "编程入门"] },
  { id: 4, title: "PhET互动仿真", category: "学习资源", description: "科罗拉多大学开发的科学仿真实验，涵盖物理、化学、生物等学科。", image: "https://picsum.photos/600/400?random=63", platform: ["Web"], officialUrl: "https://phet.colorado.edu/zh_CN/", tags: ["免费", "在线", "科学实验"] },
  { id: 5, title: "Python + VS Code", category: "学科软件", description: "Python编程环境配置，配合VS Code编辑器。", image: "https://picsum.photos/600/400?random=64", platform: ["Windows", "Mac", "Linux"], downloadUrl: "https://www.python.org/downloads/", officialUrl: "https://code.visualstudio.com", tags: ["免费", "开源", "编程"] },
  { id: 6, title: "LibreOffice", category: "办公软件", description: "免费开源的办公套件，兼容Microsoft Office格式。", image: "https://picsum.photos/600/400?random=65", platform: ["Windows", "Mac", "Linux"], downloadUrl: "https://www.libreoffice.org/download/download/", officialUrl: "https://www.libreoffice.org", tags: ["免费", "开源", "办公套件"] }
];

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 从 Hexo 分类中提取分类名称
 * 【重要】Hexo 的 categories 可能是字符串或对象 {name, slug, permalink}
 */
function extractCategoryName(cat: string | { name?: string; slug?: string } | null | undefined): string {
  if (!cat) return '';
  if (typeof cat === 'string') return cat;
  if (typeof cat === 'object' && cat.name) return cat.name;
  return '';
}

/**
 * 从 Hexo 分类数组中提取分类名称数组
 */
function extractCategoryNames(categories: (string | { name?: string } | null)[] | null | undefined): string[] {
  if (!categories || !Array.isArray(categories)) return [];
  return categories.map(extractCategoryName).filter(Boolean);
}

// ============================================================================
// 双源合并函数
// ============================================================================

/**
 * 获取合并后的文章数据
 */
export async function getCombinedPosts(moduleName: string): Promise<CombinedPost[]> {
  const categoryNames = MODULE_TO_CATEGORY[moduleName];
  if (!categoryNames) {
    console.warn(`[数据中心] 未知的模块名: ${moduleName}`);
    return [];
  }
  
  // 1. 获取远程文章
  const remotePosts = await fetchHexoPosts();
  
  // 2. 筛选属于该模块的文章
  const filteredRemotePosts = remotePosts.filter(post => {
    if (!post.categories || !Array.isArray(post.categories)) return false;
    // 使用辅助函数提取分类名称
    const catNames = extractCategoryNames(post.categories);
    return catNames.some(catName => categoryNames.includes(catName));
  });
  
  console.log(`[数据中心] 模块 ${moduleName} 找到 ${filteredRemotePosts.length} 篇远程文章`);
  
  // 3. 获取本地静态数据
  const localData = getLocalData(moduleName);
  
  // 4. 合并数据
  const combinedPosts: CombinedPost[] = [];
  
  // 添加本地数据
  localData.forEach(item => {
    combinedPosts.push({
      ...item,
      _source: 'local',
      _slug: null,
      _path: null,
      _permalink: null,
      _module: moduleName,
    });
  });
  
  // 添加远程数据（使用 abbrlink 作为唯一标识）
  filteredRemotePosts.forEach(post => {
    // 使用 abbrlink 作为 ID（如果有的话）
    const postId = post.abbrlink || post.slug || Math.random().toString(36).substr(2, 9);
    
    // 检查是否已存在相同 ID 或标题的文章
    const existingIndex = combinedPosts.findIndex(
      item => item.id.toString() === postId.toString() || item.title === post.title
    );
    
    if (existingIndex === -1) {
      const convertedPost = convertHexoPostToCombined(post, postId.toString());
      convertedPost._module = moduleName;
      combinedPosts.push(convertedPost);
    }
  });
  
  // 5. 按日期倒序排列
  combinedPosts.sort((a, b) => {
    const dateA = new Date(a.date || '1970-01-01').getTime();
    const dateB = new Date(b.date || '1970-01-01').getTime();
    return dateB - dateA;
  });
  
  console.log(`[数据中心] 模块 ${moduleName} 合并后共 ${combinedPosts.length} 篇文章`);
  
  return combinedPosts;
}

/**
 * 获取本地静态数据
 */
function getLocalData(moduleName: string): any[] {
  switch (moduleName) {
    case 'news': return NEWS_DATA;
    case 'courses': return COURSES_DATA;
    case 'teachers': return TEACHERS_DATA;
    case 'events': return EVENTS_DATA;
    case 'achievements': return [];
    default: return [];
  }
}

/**
 * 将 Hexo 文章转换为统一格式
 * 【关键修复】
 * 1. 必须使用 abbrlink 作为唯一 ID
 * 2. 提取完整的 raw 源码用于详情页完整渲染
 * 3. 直接保存 Hexo 的 path 和 permalink，解决跳转 404
 */
function convertHexoPostToCombined(post: HexoPost, postId: string): CombinedPost {
  const dateStr = post.date ? post.date.split(' ')[0] : new Date().toISOString().split('T')[0];
  
  // 提取分类名称
  let category = '';
  const catNames = extractCategoryNames(post.categories);
  if (catNames.length > 0) {
    category = catNames[0];
  }
  
  // 提取标签
  let tags: string[] = [];
  if (post.tags && Array.isArray(post.tags)) {
    tags = post.tags.map(tag => {
      if (typeof tag === 'string') return tag;
      if (typeof tag === 'object' && tag && 'name' in tag) return (tag as { name: string }).name;
      return String(tag);
    }).filter(Boolean);
  }
  
  // 【关键修复1】必须使用 abbrlink 作为唯一 ID
  const finalId = post.abbrlink || postId;
  
  return {
    id: finalId,
    title: post.title || '无标题',
    date: dateStr,
    category: category,
    summary: post.excerpt || post.description || '',
    image: post.cover || 'https://picsum.photos/600/400?random=' + Math.random(),
    // 【关键修复2】提取完整的 raw 源码，用于详情页完整渲染
    content: post.raw || post.text || '',
    author: post.author || '惠州仲恺中学',
    tags: tags,
    _source: 'remote',
    _slug: finalId,
    // 【关键修复3】直接保存 Hexo 的 path 和 permalink，解决跳转 404
    _path: post.path || null,
    _permalink: post.permalink || null,
  };
}

/**
 * 根据 ID 获取单篇文章
 */
export async function getPostById(moduleName: string, id: string): Promise<CombinedPost | null> {
  const posts = await getCombinedPosts(moduleName);
  return posts.find(post => post.id.toString() === id) || null;
}

/**
 * 获取所有文章的 ID
 */
export async function getPostIds(moduleName: string): Promise<string[]> {
  const posts = await getCombinedPosts(moduleName);
  return posts.map(post => post.id.toString());
}

/**
 * 获取最新文章（去重，保留模块信息用于生成正确的链接）
 */
export async function getLatestPosts(limit: number = 6): Promise<CombinedPost[]> {
  // 使用 Map 去重，key 为文章 ID
  const postsMap = new Map<string, CombinedPost>();
  
  const modules = ['news', 'events', 'achievements', 'teachers', 'courses'];
  
  for (const moduleName of modules) {
    const posts = await getCombinedPosts(moduleName);
    for (const post of posts) {
      const postId = post.id.toString();
      // 如果文章已存在，跳过（避免重复）
      if (!postsMap.has(postId)) {
        postsMap.set(postId, post);
      }
    }
  }
  
  // 转换为数组并按日期排序
  const allPosts = Array.from(postsMap.values());
  
  allPosts.sort((a, b) => {
    const dateA = new Date(a.date || '1970-01-01').getTime();
    const dateB = new Date(b.date || '1970-01-01').getTime();
    return dateB - dateA;
  });
  
  return allPosts.slice(0, limit);
}

// ============================================================================
// SEO 配置
// ============================================================================
export const SITE_CONFIG = {
  name: "惠州仲恺中学",
  url: "https://www.zkzxgzb.com",
  ogImage: "/og-image.png",
  links: {
    wechat: "",
    weibo: "",
  },
};

export const PAGE_CONFIGS: Record<string, { title: string; description: string; keywords: string[] }> = {
  home: { title: "惠州仲恺中学 - 广东省一级学校", description: "惠州仲恺中学官网，广东省一级学校，坐落于仲恺高新区。", keywords: ["惠州仲恺中学", "仲恺中学", "广东省一级学校"] },
  about: { title: "学校概况 - 惠州仲恺中学", description: "仲恺中学是以中国民主革命先驱廖仲恺先生名字命名的名人纪念性完全中学，创办于1964年，广东省一级学校。", keywords: ["学校概况", "仲恺中学历史", "办学理念", "廖仲恺"] },
  news: { title: "新闻动态 - 惠州仲恺中学", description: "惠州仲恺中学新闻动态，关注校园实时资讯。", keywords: ["校园新闻", "仲恺中学新闻", "学校动态"] },
  contact: { title: "联系我们 - 惠州仲恺中学", description: "惠州仲恺中学联系方式。", keywords: ["联系我们", "仲恺中学地址", "招生咨询"] },
  teachers: { title: "师资力量 - 惠州仲恺中学", description: "惠州仲恺中学师资力量介绍。", keywords: ["师资力量", "仲恺中学教师", "优秀教师"] },
  courses: { title: "课程教学 - 惠州仲恺中学", description: "惠州仲恺中学课程教学。", keywords: ["课程教学", "仲恺中学课程", "校本课程"] },
  events: { title: "校园活动 - 惠州仲恺中学", description: "惠州仲恺中学校园活动。", keywords: ["校园活动", "仲恺中学活动", "学生活动"] },
  achievements: { title: "办学成果 - 惠州仲恺中学", description: "惠州仲恺中学办学成果展示。", keywords: ["办学成果", "仲恺中学荣誉", "学生成绩"] },
  software: { title: "教学软件 - 惠州仲恺中学", description: "惠州仲恺中学教学软件分享。", keywords: ["教学软件", "教育工具", "学习资源"] },
  blog: { title: "校园博客 - 惠州仲恺中学", description: "惠州仲恺中学校园博客，分享校园故事。", keywords: ["校园博客", "仲恺中学博客", "学生作品"] },
};

// ============================================================================
// 校园景观数据（德沁园）
// ============================================================================
export interface CampusSpot {
  name: string;
  description: string;
  meaning: string;
}

export const CAMPUS_LANDSCAPE_DATA: CampusSpot[] = [
  {
    name: "凝香池",
    description: "池中种植荷花，岸边垂柳依依，环境清幽雅致。",
    meaning: "既有聚集美好、累计知识、香远益清之意，又得之于何香凝女士的名讳，表达仲恺师生对先辈的怀念。"
  },
  {
    name: "东征文化墙",
    description: "墙上镌刻东征路线图、历史介绍及廖仲恺先生前线演讲、装填炮弹的浮雕。",
    meaning: "展现廖仲恺先生不顾个人安危与战士并肩作战的革命精神，传承红色记忆。"
  },
  {
    name: "铮铮铁骨",
    description: "浮雕展现廖仲恺先生被陈炯明关押在广州石井兵工厂囚室中仍坚贞不屈的情景。",
    meaning: "彰显廖仲恺先生坚贞不屈的革命气节，激励学子在逆境中坚守信念。"
  },
  {
    name: "宏愿树",
    description: "一棵价值数万元的大榕树，枝繁叶茂，遮天蔽日。",
    meaning: "寄望仲恺学子勤奋学习，前途远大，亦是仲恺师生的愿望树。"
  },
  {
    name: "凭吊台",
    description: "周围松柏环绕，庄严肃穆，上书'仰止'二字。",
    meaning: "取高山仰止之意，是人们缅怀仲恺先生、自省其身之处。"
  }
];

// ============================================================================
// 数据魔方（学校关键数据）
// ============================================================================
export interface SchoolStat {
  value: string;
  unit?: string;
  label: string;
  description?: string;
}

export const SCHOOL_STATS_DATA: SchoolStat[] = [
  {
    value: "94188",
    unit: "㎡",
    label: "校园面积",
    description: "花园式校园，环境优美"
  },
  {
    value: "322",
    unit: "名",
    label: "教职工",
    description: "高素质教师队伍"
  },
  {
    value: "67.1",
    unit: "%",
    label: "中高级教师占比",
    description: "专业教学力量"
  },
  {
    value: "79",
    unit: "个",
    label: "教学班级",
    description: "高中43班，初中36班"
  },
  {
    value: "5388",
    unit: "人",
    label: "在校学生",
    description: "高中学子2694人"
  },
  {
    value: "2800",
    unit: "+",
    label: "住校生",
    description: "完善住宿设施"
  }
];

// ============================================================================
// 交通指南（主要公交线路）
// ============================================================================
export interface BusRoute {
  lineNumber: string;
  startStation: string;
  endStation: string;
  operatingHours: string;
}

export const BUS_ROUTES_DATA: BusRoute[] = [
  { lineNumber: "5路", startStation: "工程职业学院", endStation: "中心医院仲恺院区", operatingHours: "06:30-21:45" },
  { lineNumber: "6路", startStation: "惠州火车站", endStation: "中心医院仲恺院区", operatingHours: "06:30-21:45" },
  { lineNumber: "11路", startStation: "惠州火车站", endStation: "仲恺高铁站", operatingHours: "06:30-20:30" },
  { lineNumber: "201路", startStation: "汤泉", endStation: "沥林北城轨站", operatingHours: "05:40-20:40" },
  { lineNumber: "203路", startStation: "榄塘村总站", endStation: "潼侨工业区", operatingHours: "05:40-20:40" },
  { lineNumber: "205路", startStation: "东江湾商业中心", endStation: "沥林汽车站", operatingHours: "05:50-20:30" },
  { lineNumber: "209路快线", startStation: "惠州北高铁站", endStation: "仲恺汽车站", operatingHours: "06:30-21:00" },
  { lineNumber: "K8路", startStation: "惠州汽车总站", endStation: "惠阳高铁站", operatingHours: "06:00-18:30" }
];
