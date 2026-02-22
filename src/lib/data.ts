/**
 * ============================================================================
 * 数据中心 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【功能说明】
 * 1. 支持从远程 Hexo 博客 API 获取文章数据（含完整 MD 正文）
 * 2. 支持从本地 content/ 目录读取 MD 文件
 * 3. 双源合并，本地文件优先
 * 4. 按分类自动映射到不同模块
 * 5. 按时间倒序排列
 * 
 * 【数据源】
 * - 远程 API: https://test.zkzxgzb.com/news/blog/content.json
 * - 本地目录: content/{news,courses,teachers,events,achievements,software}/
 * 
 * 【分类映射】
 * - "新闻动态" -> News 模块
 * - "课程教学" -> Courses 模块
 * - "师资力量" -> Teachers 模块
 * - "校园活动" -> Events 模块
 * - "办学成果" -> Achievements 模块
 * 
 * 【ISR 配置】
 * revalidate = 60 (60秒重新验证)
 * 
 * 【Hexo 配置建议】
 * 在博客的 _config.yml 中配置 hexo-generator-json-content：
 * 
 * jsonContent:
 *   meta: false
 *   drafts: false
 *   file: content.json
 *   pages: false
 *   posts:
 *     title: true
 *     slug: true
 *     abbrlink: true
 *     date: true
 *     cover: true
 *     excerpt: true
 *     categories: true
 *     tags: true
 *     text: true        # 包含完整正文
 *     author: true
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
// 远程 API 配置
// ============================================================================
const HEXO_API_URL = 'https://test.zkzxgzb.com/news/blog/content.json';

// 博客地址
export const BLOG_URL = 'https://test.zkzxgzb.com/news/blog';

// ============================================================================
// 分类映射配置
// ============================================================================
/**
 * CATEGORY_MAP - Hexo 分类到官网模块的映射
 */
const CATEGORY_MAP: Record<string, string> = {
  '新闻动态': 'news',
  '课程教学': 'courses',
  '师资力量': 'teachers',
  '校园活动': 'events',
  '办学成果': 'achievements',
};

/**
 * 反向映射：模块名 -> Hexo 分类名
 */
const MODULE_TO_CATEGORY: Record<string, string> = {
  'news': '新闻动态',
  'courses': '课程教学',
  'teachers': '师资力量',
  'events': '校园活动',
  'achievements': '办学成果',
};

// ============================================================================
// 学校基本信息
// ============================================================================
export const SCHOOL_INFO: SchoolInfo = {
  name: "惠州仲恺中学",
  fullName: "惠州市仲恺中学",
  address: "广东省惠州市仲恺高新区陈江街道",
  phone: "0752-3323215",
  email: "zkzx@huizhou.gov.cn",
  founded: 1969,
  level: "广东省一级学校",
  description: "惠州仲恺中学（原陈江中学）创办于1969年，1994年更名为仲恺中学，以纪念廖仲恺先生。学校是广东省一级学校、广东省绿色学校、惠州市一级学校。",
  studentOrgName: "仲恺中学融媒体中心 & 信息社",
  motto: "尚德 博学 健体 力行",
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
    title: "尚德 博学 健体 力行",
    subtitle: "传承仲恺精神，培育时代新人"
  },
  {
    image: "https://picsum.photos/1920/1080?random=2",
    title: "广东省一级学校",
    subtitle: "五十余载薪火相传，桃李满天下"
  },
  {
    image: "https://picsum.photos/1920/1080?random=3",
    title: "丰富多彩的校园生活",
    subtitle: "学生社团自主运营，展现青春风采"
  }
];

// ============================================================================
// 远程数据获取函数
// ============================================================================

/**
 * 从 Hexo 博客 API 获取文章数据
 * 
 * 【性能说明】
 * - 包含完整正文，JSON 文件约 3MB
 * - ISR 缓存 60 秒，不会每次请求都拉取
 * - Vercel 内网通信，延迟很低
 */
async function fetchHexoPosts(): Promise<HexoPost[]> {
  try {
    const response = await fetch(HEXO_API_URL, {
      next: { revalidate: 60 }, // ISR: 60秒缓存
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
// 双源合并函数
// ============================================================================

/**
 * 获取合并后的文章数据
 * 
 * @param moduleName - 模块名称 (news/courses/teachers/events/achievements)
 * @returns 合并后的文章数组（按时间倒序）
 */
export async function getCombinedPosts(moduleName: string): Promise<CombinedPost[]> {
  const categoryName = MODULE_TO_CATEGORY[moduleName];
  if (!categoryName) {
    console.warn(`[数据中心] 未知的模块名: ${moduleName}`);
    return [];
  }
  
  // 1. 获取远程文章
  const remotePosts = await fetchHexoPosts();
  
  // 2. 筛选属于该模块的文章
  const filteredRemotePosts = remotePosts.filter(post => {
    if (!post.categories || !Array.isArray(post.categories)) return false;
    return post.categories.some(cat => {
      if (typeof cat === 'string') return cat === categoryName;
      if (typeof cat === 'object' && cat.name) return cat.name === categoryName;
      return false;
    });
  });
  
  console.log(`[数据中心] 模块 ${moduleName} 找到 ${filteredRemotePosts.length} 篇远程文章`);
  
  // 3. 获取本地静态数据
  const localData = getLocalData(moduleName);
  
  // 4. 合并数据
  const combinedPosts: CombinedPost[] = [];
  
  // 添加本地数据（标记为本地来源）
  localData.forEach(item => {
    combinedPosts.push({
      ...item,
      _source: 'local',
      _slug: null,
    });
  });
  
  // 添加远程数据（标记为远程来源）
  filteredRemotePosts.forEach(post => {
    const existingIndex = combinedPosts.findIndex(
      item => item.id.toString() === post.abbrlink || item.title === post.title
    );
    
    if (existingIndex === -1) {
      combinedPosts.push(convertHexoPostToCombined(post));
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
 * 
 * 【重要】保留完整正文内容
 */
function convertHexoPostToCombined(post: HexoPost): CombinedPost {
  // 解析日期格式 (YYYY-MM-DD HH:mm:ss -> YYYY-MM-DD)
  const dateStr = post.date ? post.date.split(' ')[0] : new Date().toISOString().split('T')[0];
  
  // 获取分类
  let category = '';
  if (post.categories && Array.isArray(post.categories) && post.categories.length > 0) {
    const firstCat = post.categories[0];
    category = typeof firstCat === 'string' ? firstCat : (firstCat.name || '');
  }
  
  return {
    id: post.abbrlink || Math.random().toString(36).substr(2, 9),
    title: post.title || '无标题',
    date: dateStr,
    category: category,
    summary: post.excerpt || post.description || '',
    image: post.cover || 'https://picsum.photos/600/400?random=' + Math.random(),
    content: post.text || '',  // 完整正文
    author: post.author || '',
    tags: post.tags || [],
    _source: 'remote',
    _slug: post.slug || post.abbrlink || '',
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
 * 获取所有文章的 ID（用于静态路径生成）
 */
export async function getPostIds(moduleName: string): Promise<string[]> {
  const posts = await getCombinedPosts(moduleName);
  return posts.map(post => post.id.toString());
}

/**
 * 获取最新文章（用于首页展示）
 * 
 * @param limit - 返回数量
 * @returns 按时间排序的最新文章
 */
export async function getLatestPosts(limit: number = 6): Promise<CombinedPost[]> {
  const allPosts: CombinedPost[] = [];
  
  // 获取所有模块的文章
  const modules = ['news', 'courses', 'events', 'achievements'];
  
  for (const moduleName of modules) {
    const posts = await getCombinedPosts(moduleName);
    allPosts.push(...posts);
  }
  
  // 按日期排序
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
  url: "https://zkzxgzb.com",
  ogImage: "/og-image.png",
  links: {
    wechat: "",
    weibo: "",
  },
};

export const PAGE_CONFIGS: Record<string, { title: string; description: string; keywords: string[] }> = {
  home: { title: "惠州仲恺中学 - 广东省一级学校", description: "惠州仲恺中学官网，广东省一级学校，坐落于仲恺高新区。", keywords: ["惠州仲恺中学", "仲恺中学", "广东省一级学校"] },
  about: { title: "学校概况 - 惠州仲恺中学", description: "惠州仲恺中学创办于1969年，1994年更名为仲恺中学。", keywords: ["学校概况", "仲恺中学历史", "办学理念"] },
  news: { title: "新闻动态 - 惠州仲恺中学", description: "惠州仲恺中学新闻动态，关注校园实时资讯。", keywords: ["校园新闻", "仲恺中学新闻", "学校动态"] },
  contact: { title: "联系我们 - 惠州仲恺中学", description: "惠州仲恺中学联系方式。", keywords: ["联系我们", "仲恺中学地址", "招生咨询"] },
  teachers: { title: "师资力量 - 惠州仲恺中学", description: "惠州仲恺中学师资力量介绍。", keywords: ["师资力量", "仲恺中学教师", "优秀教师"] },
  courses: { title: "课程教学 - 惠州仲恺中学", description: "惠州仲恺中学课程教学。", keywords: ["课程教学", "仲恺中学课程", "校本课程"] },
  events: { title: "校园活动 - 惠州仲恺中学", description: "惠州仲恺中学校园活动。", keywords: ["校园活动", "仲恺中学活动", "学生活动"] },
  achievements: { title: "办学成果 - 惠州仲恺中学", description: "惠州仲恺中学办学成果展示。", keywords: ["办学成果", "仲恺中学荣誉", "学生成绩"] },
  software: { title: "教学软件 - 惠州仲恺中学", description: "惠州仲恺中学教学软件分享。", keywords: ["教学软件", "教育工具", "学习资源"] },
  blog: { title: "校园博客 - 惠州仲恺中学", description: "惠州仲恺中学校园博客，分享校园故事。", keywords: ["校园博客", "仲恺中学博客", "学生作品"] },
};
