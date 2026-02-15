/**
 * ============================================================================
 * 数据配置文件 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【新手指南】
 * 这个文件包含网站所有的静态数据。修改网站内容时，主要修改这个文件即可。
 * 
 * 【如何修改数据】
 * 1. 找到对应的常量（如 NEWS_DATA）
 * 2. 修改数组中的对象
 * 3. 保存文件，页面会自动更新
 * 
 * 【如何添加新数据】
 * 1. 在 types.ts 中定义类型
 * 2. 在这个文件中创建对应的常量
 * 3. 导出常量供其他文件使用
 * 
 * 【注意事项】
 * - 图片URL目前使用占位图（picsum.photos）
 * - 实际使用时替换为真实图片URL
 * - 数据格式要符合 types.ts 中定义的类型
 */

import { 
  NavItem, 
  NewsItem, 
  Teacher, 
  EventItem, 
  Course, 
  SchoolInfo,
  Honor 
} from './types';

// ============================================================================
// 学校基本信息
// ============================================================================
/**
 * SCHOOL_INFO - 学校基本信息
 * 
 * 【如何修改】
 * 直接修改下面的字段值即可
 * 例如：name: "惠州仲恺中学" 改为 name: "新学校名称"
 */
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
/**
 * NAV_ITEMS - 顶部导航菜单
 * 
 * 【如何添加新菜单项】
 * 在数组中添加新对象：
 * { label: '新页面', path: '/new-page' }
 * 
 * 【路由说明】
 * - '/' 表示首页
 * - '/about' 表示关于页面
 * - Next.js 会自动匹配 app/about/page.tsx
 */
export const NAV_ITEMS: NavItem[] = [
  { label: '网站首页', path: '/' },
  { label: '学校概况', path: '/about' },
  { label: '课程教学', path: '/courses' },
  { label: '校园活动', path: '/events' },
  { label: '师资力量', path: '/teachers' },
  { label: '办学成果', path: '/achievements' },
  { label: '新闻动态', path: '/news' },
  { label: '联系我们', path: '/contact' },
];

// ============================================================================
// 首页轮播图数据
// ============================================================================
/**
 * HERO_SLIDES - 首页轮播图
 * 
 * 【如何修改】
 * 修改 image URL 为实际图片地址
 * 修改 title 和 subtitle 为实际文案
 * 
 * 【图片建议】
 * - 尺寸：1920x1080 或更高
 * - 格式：JPG 或 WebP
 * - 大小：建议 500KB 以内
 */
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
// 新闻数据
// ============================================================================
/**
 * NEWS_DATA - 新闻动态列表
 * 
 * 【如何添加新闻】
 * 在数组中添加新对象：
 * {
 *   id: 4,  // ID 必须唯一
 *   title: "新闻标题",
 *   date: "2024-01-15",
 *   category: "教务动态",
 *   summary: "新闻摘要...",
 *   image: "图片URL"
 * }
 * 
 * 【分类建议】
 * - 教务动态：教学相关新闻
 * - 校园活动：学生活动新闻
 * - 荣誉时刻：获奖喜报
 * - 通知公告：重要通知
 */
export const NEWS_DATA: NewsItem[] = [
  {
    id: 1,
    title: "我校召开新学期教学工作部署会议",
    date: "2023-09-01",
    category: "教务动态",
    summary: "为确保新学期教学工作平稳有序进行，全面提升教学质量，我校于学术报告厅召开新学期教学工作部署会议。会议明确了本学期教学工作的重点任务和目标。",
    image: "https://picsum.photos/600/400?random=10"
  },
  {
    id: 2,
    title: "喜报：我校学子在市科技创新大赛中斩获佳绩",
    date: "2023-08-25",
    category: "荣誉时刻",
    summary: "在刚刚结束的惠州市青少年科技创新大赛中，我校代表队凭借作品《智能灌溉系统》荣获一等奖，展现了我校学生的创新能力和实践水平。",
    image: "https://picsum.photos/600/400?random=11"
  },
  {
    id: 3,
    title: "青春心向党主题演讲比赛圆满落幕",
    date: "2023-08-10",
    category: "校园活动",
    summary: "为庆祝建党活动，弘扬爱国主义精神，校团委组织了精彩的演讲比赛。同学们用真挚的情感、生动的语言，表达了对党和祖国的热爱。",
    image: "https://picsum.photos/600/400?random=12"
  },
  {
    id: 4,
    title: "2024年秋季招生工作正式启动",
    date: "2023-07-15",
    category: "通知公告",
    summary: "根据市教育局统一部署，我校2024年秋季招生工作正式启动。欢迎广大优秀学子报考惠州仲恺中学，共创美好未来。",
    image: "https://picsum.photos/600/400?random=13"
  },
  {
    id: 5,
    title: "我校教师荣获省级教学能手称号",
    date: "2023-06-20",
    category: "荣誉时刻",
    summary: "在广东省中小学教师教学能力大赛中，我校语文组张老师凭借出色的教学设计和课堂表现，荣获省级教学能手称号。",
    image: "https://picsum.photos/600/400?random=14"
  },
  {
    id: 6,
    title: "校园文化艺术节精彩纷呈",
    date: "2023-05-18",
    category: "校园活动",
    summary: "为期一周的第十五届校园文化艺术节圆满落幕，书法、绘画、歌唱、舞蹈等各类比赛精彩纷呈，充分展示了我校学生的艺术才华。",
    image: "https://picsum.photos/600/400?random=15"
  }
];

// ============================================================================
// 教师数据
// ============================================================================
/**
 * TEACHERS_DATA - 师资力量列表
 * 
 * 【如何添加教师】
 * 在数组中添加新对象：
 * {
 *   id: 5,
 *   name: "教师姓名",
 *   title: "职称",
 *   subject: "任教学科",
 *   image: "头像URL",
 *   description: "个人简介"
 * }
 */
export const TEACHERS_DATA: Teacher[] = [
  {
    id: 1,
    name: "张老师",
    title: "高级教师",
    subject: "语文",
    image: "https://picsum.photos/300/300?random=20",
    description: "惠州市优秀班主任，拥有30年丰富的教学经验，深受学生爱戴。多次获得市级优秀教师称号。"
  },
  {
    id: 2,
    name: "李老师",
    title: "骨干教师",
    subject: "数学",
    image: "https://picsum.photos/300/300?random=21",
    description: "数学奥林匹克竞赛优秀辅导员，教学风格幽默风趣，注重逻辑思维培养。"
  },
  {
    id: 3,
    name: "王老师",
    title: "外籍教师",
    subject: "英语口语",
    image: "https://picsum.photos/300/300?random=22",
    description: "来自英国，拥有TESOL证书，致力于为学生创造纯正的英语语言环境。"
  },
  {
    id: 4,
    name: "陈老师",
    title: "一级教师",
    subject: "物理",
    image: "https://picsum.photos/300/300?random=23",
    description: "专注于物理实验教学创新，多次在省市级教学比赛中获奖。"
  },
  {
    id: 5,
    name: "刘老师",
    title: "高级教师",
    subject: "化学",
    image: "https://picsum.photos/300/300?random=24",
    description: "化学教研组组长，指导学生多次在化学竞赛中获奖。"
  },
  {
    id: 6,
    name: "黄老师",
    title: "骨干教师",
    subject: "历史",
    image: "https://picsum.photos/300/300?random=25",
    description: "历史学科带头人，善于将历史故事融入教学，课堂生动有趣。"
  }
];

// ============================================================================
// 课程数据
// ============================================================================
/**
 * COURSES_DATA - 课程教学列表
 * 
 * 【课程类型说明】
 * - 国家课程：语文、数学、英语等基础学科
 * - 校本课程：学校自主开发的特色课程
 * - 德育活动：爱国主义教育、社会实践等
 */
export const COURSES_DATA: Course[] = [
  {
    id: 1,
    title: "国家基础课程",
    type: "国家课程",
    description: "严格按照国家课程标准，开齐开足语文、数学、英语、物理、历史等基础学科，为学生打下坚实的知识基础。",
    image: "https://picsum.photos/600/400?random=30",
    features: ["扎实基础", "科学素养", "人文底蕴"]
  },
  {
    id: 2,
    title: "创客与编程",
    type: "校本课程",
    description: "依托学校科技馆，开设Python编程、3D打印、机器人控制等前沿科技课程，培养学生的创新能力和动手能力。",
    image: "https://picsum.photos/600/400?random=31",
    features: ["创新思维", "动手实践", "科技前沿"]
  },
  {
    id: 3,
    title: "仲恺文化研学",
    type: "德育活动",
    description: "探访廖仲恺先生纪念碑、陈江人文古迹，传承红色基因与本土文化，培养学生的家国情怀。",
    image: "https://picsum.photos/600/400?random=32",
    features: ["爱国教育", "实地研学", "文化传承"]
  },
  {
    id: 4,
    title: "艺术与审美",
    type: "校本课程",
    description: "开设书法、绘画、音乐、舞蹈等艺术课程，培养学生的审美情趣和艺术修养。",
    image: "https://picsum.photos/600/400?random=33",
    features: ["艺术修养", "审美能力", "创意表达"]
  },
  {
    id: 5,
    title: "体育与健康",
    type: "国家课程",
    description: "开设篮球、足球、田径、游泳等体育课程，增强学生体质，培养团队协作精神。",
    image: "https://picsum.photos/600/400?random=34",
    features: ["强健体魄", "团队协作", "终身运动"]
  },
  {
    id: 6,
    title: "社会实践",
    type: "德育活动",
    description: "组织学生参与社区服务、志愿服务等社会实践活动，培养学生的社会责任感。",
    image: "https://picsum.photos/600/400?random=35",
    features: ["社会责任", "实践能力", "公民意识"]
  }
];

// ============================================================================
// 活动数据
// ============================================================================
/**
 * EVENTS_DATA - 校园活动列表
 * 
 * 【日期格式说明】
 * - date: 完整日期，格式 YYYY-MM-DD
 * - month: 显示月份，如 "12月"
 * - day: 显示日期，如 "01"
 */
export const EVENTS_DATA: EventItem[] = [
  {
    id: 1,
    title: "第十五届校园文化艺术节",
    date: "2023-12-01",
    month: "12月",
    day: "01",
    location: "学校大礼堂",
    image: "https://picsum.photos/500/350?random=40",
    description: "为期一周的艺术盛宴，包含书法、绘画、歌唱、舞蹈等多种比赛项目。"
  },
  {
    id: 2,
    title: "秋季田径运动会",
    date: "2023-11-15",
    month: "11月",
    day: "15",
    location: "学校体育场",
    image: "https://picsum.photos/500/350?random=41",
    description: "全校师生参与的体育盛会，展现仲恺学子的运动风采。"
  },
  {
    id: 3,
    title: "成人礼暨高考誓师大会",
    date: "2023-05-04",
    month: "05月",
    day: "04",
    location: "学校广场",
    image: "https://picsum.photos/500/350?random=42",
    description: "高三学子成人礼仪式，激励学子为梦想奋斗。"
  },
  {
    id: 4,
    title: "科技创新大赛",
    date: "2023-10-20",
    month: "10月",
    day: "20",
    location: "科技馆",
    image: "https://picsum.photos/500/350?random=43",
    description: "展示学生科技创新成果，激发创新潜能。"
  },
  {
    id: 5,
    title: "春季研学活动",
    date: "2023-04-15",
    month: "04月",
    day: "15",
    location: "廖仲恺纪念园",
    image: "https://picsum.photos/500/350?random=44",
    description: "探访革命先烈故居，传承红色基因。"
  },
  {
    id: 6,
    title: "元旦文艺晚会",
    date: "2023-12-31",
    month: "12月",
    day: "31",
    location: "学校大礼堂",
    image: "https://picsum.photos/500/350?random=45",
    description: "辞旧迎新，师生同乐，共度美好时光。"
  }
];

// ============================================================================
// 荣誉数据
// ============================================================================
/**
 * HONORS_DATA - 学校荣誉列表
 * 用于学校荣誉展示页面
 */
export const HONORS_DATA: Honor[] = [
  {
    id: 1,
    title: "广东省一级学校",
    year: 2006,
    description: "广东省教育厅评定"
  },
  {
    id: 2,
    title: "广东省绿色学校",
    year: 2008,
    description: "广东省教育厅、环保厅联合评定"
  },
  {
    id: 3,
    title: "惠州市一级学校",
    year: 2004,
    description: "惠州市教育局评定"
  },
  {
    id: 4,
    title: "德育示范学校",
    year: 2010,
    description: "惠州市教育局评定"
  },
  {
    id: 5,
    title: "广东省普通高中教学水平优秀学校",
    year: 2008,
    description: "广东省教育厅评定"
  },
  {
    id: 6,
    title: "惠州市文明校园",
    year: 2015,
    description: "惠州市文明办评定"
  }
];

// ============================================================================
// SEO 配置
// ============================================================================
/**
 * SITE_CONFIG - 网站SEO配置
 * 用于生成页面的 meta 标签
 */
export const SITE_CONFIG = {
  name: "惠州仲恺中学",
  url: "https://test.zkzxgzb.com", // 实际域名
  ogImage: "/og-image.png", // Open Graph 图片
  links: {
    wechat: "", // 微信公众号
    weibo: "",  // 微博
  },
};

/**
 * PAGE_CONFIGS - 各页面SEO配置
 * 
 * 【如何添加新页面配置】
 * PAGE_CONFIGS['new-page'] = {
 *   title: '页面标题 | 惠州仲恺中学',
 *   description: '页面描述',
 *   keywords: ['关键词1', '关键词2']
 * };
 */
export const PAGE_CONFIGS: Record<string, { title: string; description: string; keywords: string[] }> = {
  home: {
    title: "惠州仲恺中学 - 广东省一级学校",
    description: "惠州仲恺中学官网，广东省一级学校，坐落于仲恺高新区。提供最新的校园新闻、招生信息、办学成果展示，由学生团队运营。",
    keywords: ["惠州仲恺中学", "仲恺中学", "广东省一级学校", "学生社团", "仲恺高新区学校"],
  },
  about: {
    title: "学校概况 - 惠州仲恺中学",
    description: "惠州仲恺中学创办于1969年，1994年更名为仲恺中学，以纪念廖仲恺先生。学校是广东省一级学校、广东省绿色学校。",
    keywords: ["学校概况", "仲恺中学历史", "办学理念", "学校荣誉"],
  },
  news: {
    title: "新闻动态 - 惠州仲恺中学",
    description: "惠州仲恺中学新闻动态，关注校园实时资讯，了解仲恺最新动态。",
    keywords: ["校园新闻", "仲恺中学新闻", "学校动态"],
  },
  contact: {
    title: "联系我们 - 惠州仲恺中学",
    description: "惠州仲恺中学联系方式，包括学校地址、电话、邮箱等信息。",
    keywords: ["联系我们", "仲恺中学地址", "招生咨询"],
  },
  teachers: {
    title: "师资力量 - 惠州仲恺中学",
    description: "惠州仲恺中学师资力量介绍，德艺双馨，潜心育人。",
    keywords: ["师资力量", "仲恺中学教师", "优秀教师"],
  },
  courses: {
    title: "课程教学 - 惠州仲恺中学",
    description: "惠州仲恺中学课程教学，多元化课程体系，促进全面发展。",
    keywords: ["课程教学", "仲恺中学课程", "校本课程"],
  },
  events: {
    title: "校园活动 - 惠州仲恺中学",
    description: "惠州仲恺中学校园活动，青春活力，精彩无限。",
    keywords: ["校园活动", "仲恺中学活动", "学生活动"],
  },
  achievements: {
    title: "办学成果 - 惠州仲恺中学",
    description: "惠州仲恺中学办学成果展示，桃李芬芳，硕果累累。",
    keywords: ["办学成果", "仲恺中学荣誉", "学生成绩"],
  },
};
