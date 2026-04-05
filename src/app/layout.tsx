/**
 * 根布局文件 - 惠州仲恺中学官网
 */

import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Header, Footer } from "@/components/school";
import { SCHOOL_INFO, SITE_CONFIG, PAGE_CONFIGS } from "@/lib/data";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// 判断是否为生产环境
const isProd = process.env.NODE_ENV === 'production';
const CDN_BASE = 'https://cdn.20080601.xyz';

// Google Analytics 追踪 ID
const GA_MEASUREMENT_ID = "G-4VCY02G1FZ";

// ============================================================================
// Viewport 配置（Next.js 15 独立 export）
// ============================================================================
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1E3A8A',
};

// 字体配置
const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

// 网站元数据
export const metadata: Metadata = {
  // 使用 metadataBase 确保所有相对 URL 在元数据中被正确解析为绝对路径
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: PAGE_CONFIGS.home.title,
    template: `%s | ${SCHOOL_INFO.name}`,
  },
  description: PAGE_CONFIGS.home.description,
  keywords: PAGE_CONFIGS.home.keywords,
  authors: [{ name: SCHOOL_INFO.studentOrgName }],
  // 生产环境下使用 CDN 绝对路径，开发环境使用相对路径
  icons: {
    icon: [
      { url: isProd ? `${CDN_BASE}/favicon.ico` : '/favicon.ico', sizes: 'any' },
      { url: isProd ? `${CDN_BASE}/favicon.png` : '/favicon.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: [
      { url: isProd ? `${CDN_BASE}/apple-touch-icon.png` : '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  openGraph: {
    title: PAGE_CONFIGS.home.title,
    description: PAGE_CONFIGS.home.description,
    url: SITE_CONFIG.url,
    siteName: SCHOOL_INFO.name,
    locale: "zh_CN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ============================================================================
// Organization JSON-LD 结构化数据（全局）
// ============================================================================
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": SCHOOL_INFO.fullName,
  "alternateName": SCHOOL_INFO.name,
  "url": SITE_CONFIG.url,
  "logo": `${CDN_BASE}/apple-touch-icon.png`,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "惠州市",
    "addressRegion": "广东省",
    "streetAddress": SCHOOL_INFO.address,
    "addressCountry": "CN",
  },
  "telephone": SCHOOL_INFO.phone,
  "email": SCHOOL_INFO.email,
  "foundingDate": String(SCHOOL_INFO.founded),
  "description": SCHOOL_INFO.description,
  "sameAs": [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      {/* Google Analytics - gtag.js */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      {/* Organization JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <body className={`${notoSansSC.variable} ${notoSerifSC.variable} font-sans antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
