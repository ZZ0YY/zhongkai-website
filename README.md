# 惠州仲恺中学官网 - 开发指南

## 📚 项目概述

这是惠州仲恺中学官方网站的 Next.js 版本，由学生社团（仲恺中学融媒体中心 & 信息社）自主设计与维护。

### 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **部署**: Vercel

---

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:3000 查看网站

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

---

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx          # 根布局（包含 Header 和 Footer）
│   ├── page.tsx            # 首页
│   ├── not-found.tsx       # 404 页面
│   ├── sitemap.ts          # 动态生成网站地图
│   ├── about/              # 学校概况页面
│   ├── contact/            # 联系我们页面
│   ├── news/               # 新闻动态页面
│   │   ├── page.tsx        # 新闻列表
│   │   └── [id]/           # 新闻详情（动态路由）
│   ├── courses/            # 课程教学页面
│   ├── teachers/           # 师资力量页面
│   ├── events/             # 校园活动页面
│   └── achievements/       # 办学成果页面
│
├── components/             # 组件目录
│   ├── school/             # 学校网站专用组件
│   │   ├── Header.tsx      # 顶部导航栏
│   │   ├── Footer.tsx      # 底部页脚
│   │   └── PageHeader.tsx  # 页面横幅
│   └── ui/                 # shadcn/ui 组件库
│
└── lib/                    # 工具库
    ├── data.ts             # 静态数据配置
    └── types.ts            # TypeScript 类型定义
```

---

## 📝 如何修改网站内容

### 修改学校基本信息

编辑 `src/lib/data.ts` 中的 `SCHOOL_INFO`：

```typescript
export const SCHOOL_INFO = {
  name: "惠州仲恺中学",
  address: "广东省惠州市仲恺高新区陈江街道",
  phone: "0752-3323215",
  email: "zkzx@huizhou.gov.cn",
  // ...
};
```

### 修改导航菜单

编辑 `src/lib/data.ts` 中的 `NAV_ITEMS`：

```typescript
export const NAV_ITEMS = [
  { label: '网站首页', path: '/' },
  { label: '学校概况', path: '/about' },
  // 添加新菜单项...
];
```

### 添加新闻

编辑 `src/lib/data.ts` 中的 `NEWS_DATA`：

```typescript
export const NEWS_DATA: NewsItem[] = [
  {
    id: 7,  // ID 必须唯一
    title: "新闻标题",
    date: "2024-01-15",
    category: "教务动态",
    summary: "新闻摘要...",
    image: "图片URL"
  },
  // ...
];
```

### 添加教师

编辑 `src/lib/data.ts` 中的 `TEACHERS_DATA`：

```typescript
export const TEACHERS_DATA: Teacher[] = [
  {
    id: 7,
    name: "教师姓名",
    title: "职称",
    subject: "任教学科",
    image: "头像URL",
    description: "个人简介"
  },
  // ...
];
```

---

## 🔍 SEO 配置

### 301 重定向（保护 SEO 权重）

原网站使用 `.html` 后缀的 URL，新网站使用无后缀的 URL。为了保护 SEO 权重，已配置 301 永久重定向。

**重定向配置位置**：
- `next.config.ts` - Next.js 重定向配置
- `vercel.json` - Vercel 平台重定向配置（双重保障）

**URL 映射关系**：

| 原网站 | 新网站 |
|--------|--------|
| /index.html | / |
| /about.html | /about |
| /blog.html | /news |
| /teacher.html | /teachers |
| /courses.html | /courses |
| /events.html | /events |
| /contact.html | /contact |
| /notice.html | /news |
| /research.html | /achievements |
| /scholarship.html | /achievements |

### 网站地图

- 自动生成：`src/app/sitemap.ts`
- 访问地址：https://zkzxgzb.com/sitemap.xml

### Robots.txt

- 文件位置：`public/robots.txt`
- 已配置百度、搜狗、360等中国搜索引擎爬虫

---

## 🎨 主题颜色

网站使用仲恺中学主题色系：

| 颜色名称 | 色值 | 用途 |
|----------|------|------|
| zk-red | #8B0000 | 主色调，Logo、标题、按钮 |
| zk-blue | #1E3A8A | 辅助色，链接、信息卡片 |
| zk-gold | #F59E0B | 点缀色，荣誉、装饰 |

**使用方法**：

```html
<div className="text-zk-red">红色文字</div>
<div className="bg-zk-blue">蓝色背景</div>
```

---

## 📱 响应式设计

网站采用移动优先的响应式设计：

- **手机**: 单列布局
- **平板**: 两列布局
- **桌面**: 三列或四列布局

**断点**：

```css
sm: 640px   /* 手机横屏 */
md: 768px   /* 平板 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大屏 */
```

---

## 🔧 常见问题

### 如何添加新页面？

1. 在 `src/app/` 下创建新文件夹
2. 添加 `page.tsx` 文件
3. 在 `src/lib/data.ts` 的 `NAV_ITEMS` 中添加导航链接
4. 在 `PAGE_CONFIGS` 中添加 SEO 配置

### 如何修改图片？

目前使用的是 picsum.photos 占位图。替换为真实图片：

1. 将图片放入 `public/images/` 目录
2. 修改 `src/lib/data.ts` 中的图片 URL

### 如何添加表单提交功能？

1. 创建 API 路由：`src/app/api/contact/route.ts`
2. 在表单组件中添加提交逻辑
3. 处理表单数据（发送邮件、存储数据库等）

### 如何嵌入百度地图？

1. 访问百度地图开放平台获取嵌入代码
2. 在 `src/app/contact/page.tsx` 中替换地图占位区域

---

## 📞 联系方式

- **学校**: 惠州仲恺中学
- **地址**: 广东省惠州市仲恺高新区陈江街道
- **电话**: 0752-3323215
- **运营团队**: 仲恺中学融媒体中心 & 信息社

---

## 📄 许可证

© 2024 惠州仲恺中学. All Rights Reserved.
