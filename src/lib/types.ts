/**
 * ============================================================================
 * 类型定义文件 - 惠州仲恺中学官网
 * ============================================================================
 * 
 * 【新手指南】
 * TypeScript 类型定义文件用于定义数据结构，帮助编辑器提供智能提示和类型检查。
 * 
 * 如何使用：
 * 1. 导入类型：import { NewsItem } from '@/lib/types';
 * 2. 使用类型：const news: NewsItem = { ... };
 * 
 * 【如何添加新类型】
 * 1. 使用 interface 关键字定义新类型
 * 2. 添加所有需要的字段及其类型
 * 3. 导出类型供其他文件使用
 */

/**
 * ============================================================================
 * 导航相关类型
 * ============================================================================
 */

/**
 * NavItem - 导航菜单项
 * 用于定义顶部导航栏的菜单项
 * 
 * @property label - 显示的文本（如："网站首页"）
 * @property path - 跳转路径（如："/" 或 "/about"）
 * 
 * 【示例】
 * const navItem: NavItem = {
 *   label: '学校概况',
 *   path: '/about'
 * };
 */
export interface NavItem {
  label: string;
  path: string;
}

/**
 * ============================================================================
 * 新闻相关类型
 * ============================================================================
 */

/**
 * NewsItem - 新闻/文章项
 * 用于新闻动态、通知公告等内容
 * 
 * @property id - 唯一标识符
 * @property title - 新闻标题
 * @property date - 发布日期（格式：YYYY-MM-DD）
 * @property category - 新闻分类（如："教务动态"、"校园活动"）
 * @property summary - 新闻摘要
 * @property image - 封面图片URL
 * @property content? - 新闻正文内容（可选，详情页使用）
 * 
 * 【如何添加新字段】
 * 在接口中添加新字段，例如：
 * author?: string;  // 作者（可选）
 * views?: number;   // 阅读量（可选）
 */
export interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  content?: string;  // 详情页使用
  author?: string;   // 作者
  views?: number;    // 阅读量
}

/**
 * ============================================================================
 * 教师相关类型
 * ============================================================================
 */

/**
 * Teacher - 教师信息
 * 用于师资力量展示
 * 
 * @property id - 唯一标识符
 * @property name - 教师姓名
 * @property title - 职称（如："高级教师"、"骨干教师"）
 * @property subject - 任教学科
 * @property image - 头像图片URL
 * @property description - 个人简介
 */
export interface Teacher {
  id: number;
  name: string;
  title: string;
  subject: string;
  image: string;
  description: string;
  // 【扩展字段示例】
  education?: string;    // 学历
  experience?: number;   // 教龄
  achievements?: string[]; // 主要成就
}

/**
 * ============================================================================
 * 活动相关类型
 * ============================================================================
 */

/**
 * EventItem - 校园活动项
 * 用于校园活动展示
 * 
 * @property id - 唯一标识符
 * @property title - 活动标题
 * @property date - 活动日期（格式：YYYY-MM-DD）
 * @property month - 月份显示（如："12月"）
 * @property day - 日期显示（如："01"）
 * @property location - 活动地点
 * @property image - 活动图片URL
 * @property description? - 活动描述（可选）
 */
export interface EventItem {
  id: number;
  title: string;
  date: string;
  month: string;
  day: string;
  location: string;
  image: string;
  description?: string;
}

/**
 * ============================================================================
 * 课程相关类型
 * ============================================================================
 */

/**
 * Course - 课程信息
 * 用于课程教学展示
 * 
 * @property id - 唯一标识符
 * @property title - 课程名称
 * @property type - 课程类型（国家课程、校本课程、德育活动）
 * @property description - 课程描述
 * @property image - 课程图片URL
 * @property features - 课程特色标签数组
 */
export interface Course {
  id: number;
  title: string;
  type: '国家课程' | '校本课程' | '德育活动';
  description: string;
  image: string;
  features: string[];
  // 【扩展字段示例】
  teacher?: string;     // 授课教师
  duration?: string;    // 课程时长
  targetGrade?: string; // 适用年级
}

/**
 * ============================================================================
 * 学校信息类型
 * ============================================================================
 */

/**
 * SchoolInfo - 学校基本信息
 * 用于全局显示学校基本信息
 * 
 * 【如何修改学校信息】
 * 直接修改 src/lib/data.ts 中的 SCHOOL_INFO 常量
 */
export interface SchoolInfo {
  name: string;           // 学校名称
  fullName?: string;      // 学校全称
  address: string;        // 学校地址
  phone: string;          // 联系电话
  email: string;          // 电子邮箱
  founded: number;        // 建校年份
  level: string;          // 学校等级
  description: string;    // 学校简介
  studentOrgName: string; // 学生组织名称
  // 【扩展字段示例】
  motto?: string;         // 校训
  principal?: string;     // 校长
  website?: string;       // 学校官网
}

/**
 * ============================================================================
 * 荣誉相关类型
 * ============================================================================
 */

/**
 * Honor - 学校荣誉
 * 用于学校荣誉展示
 * 
 * @property id - 唯一标识符
 * @property title - 荣誉名称
 * @property year - 获得年份
 * @property description? - 荣誉描述
 */
export interface Honor {
  id: number;
  title: string;
  year: number;
  description?: string;
  image?: string;
}

/**
 * ============================================================================
 * 教学软件类型
 * ============================================================================
 */

/**
 * Software - 教学软件
 * 用于教学软件分享展示
 * 
 * @property id - 唯一标识符
 * @property title - 软件名称
 * @property category - 软件分类（教学工具、学习资源、办公软件等）
 * @property description - 软件简介
 * @property image - 软件截图或图标
 * @property platform - 适用平台（Windows、Mac、Web、iOS、Android）
 * @property downloadUrl - 下载链接（可选）
 * @property officialUrl - 官网链接（可选）
 */
export interface Software {
  id: number;
  title: string;
  category: '教学工具' | '学习资源' | '办公软件' | '学科软件' | '其他';
  description: string;
  image: string;
  platform: string[];
  downloadUrl?: string;
  officialUrl?: string;
  tags?: string[];
}

/**
 * ============================================================================
 * Hexo 博客数据类型
 * ============================================================================
 */

/**
 * HexoCategory - Hexo 分类对象
 * 
 * 【说明】
 * Hexo 的 categories 可能是字符串或对象
 */
export interface HexoCategory {
  name: string;
  slug?: string;
  path?: string;
}

/**
 * HexoPost - Hexo 文章数据结构
 * 
 * 【字段说明】
 * 根据 hexo-generator-json-content 插件配置生成
 * 
 * @property title - 文章标题
 * @property slug - URL 友好的短链接标识
 * @property abbrlink - abbrlink 插件生成的短链接 ID
 * @property date - 发布日期 (YYYY-MM-DD HH:mm:ss)
 * @property updated - 更新日期
 * @property cover - 封面图片 URL
 * @property excerpt - 文章摘要
 * @property description - 文章描述
 * @property text - 文章正文（纯文本）
 * @property categories - 分类数组
 * @property tags - 标签数组
 * @property author - 作者
 * @property path - 文章路径
 * @property permalink - 永久链接
 */
export interface HexoPost {
  title: string;
  slug: string;
  abbrlink?: string;
  date: string;
  updated?: string;
  cover?: string;
  excerpt?: string;
  description?: string;
  text?: string;
  /** 【新增】完整的 Markdown 源码（包含 Frontmatter 和正文） */
  raw?: string;
  categories?: (string | HexoCategory)[];
  tags?: string[];
  author?: string;
  path?: string;
  permalink?: string;
  comments?: boolean;
  keywords?: string[];
}

/**
 * CombinedPost - 合并后的统一文章格式
 * 
 * 【数据来源】
 * - local: 本地 content/ 目录的 MD 文件
 * - remote: Hexo 博客 API
 * 
 * 【字段说明】
 * @property _source - 数据来源 ('local' | 'remote')
 * @property _slug - 远程文章的 slug（用于生成博客跳转链接）
 */
export interface CombinedPost {
  id: number | string;
  title: string;
  date: string;
  category?: string;
  summary?: string;
  image: string;
  content?: string;
  author?: string;
  tags?: string[];
  // 教师特有字段
  name?: string;
  title_field?: string;
  subject?: string;
  description?: string;
  // 课程特有字段
  type?: string;
  features?: string[];
  // 活动特有字段
  month?: string;
  day?: string;
  location?: string;
  // 内部字段
  _source: 'local' | 'remote';
  _slug: string | null;
  /** 【新增】Hexo 文章的相对路径，用于精准跳转 */
  _path: string | null;
  /** 【新增】Hexo 文章的永久链接，用于精准跳转 */
  _permalink: string | null;
  /** 【新增】文章所属模块，用于生成正确的详情页链接 */
  _module?: string;
}

/**
 * ============================================================================
 * 页面配置类型
 * ============================================================================
 */

/**
 * PageConfig - 页面配置
 * 用于配置各个页面的元数据
 * 
 * @property title - 页面标题
 * @property description - 页面描述（用于SEO）
 * @property keywords - 关键词数组（用于SEO）
 */
export interface PageConfig {
  title: string;
  description: string;
  keywords: string[];
}

/**
 * ============================================================================
 * API 响应类型（为未来功能预留）
 * ============================================================================
 */

/**
 * ApiResponse - 通用API响应格式
 * 当接入后端API时使用
 * 
 * @property success - 请求是否成功
 * @property data - 返回的数据
 * @property message - 响应消息
 * @property error? - 错误信息（可选）
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}

/**
 * PaginatedResponse - 分页响应格式
 * 用于列表数据的分页返回
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
