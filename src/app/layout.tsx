/**
 * 根布局文件 - 惠州仲恺中学官网
 */

import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/school";
import { SCHOOL_INFO, SITE_CONFIG, PAGE_CONFIGS } from "@/lib/data";

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
  title: {
    default: PAGE_CONFIGS.home.title,
    template: `%s | ${SCHOOL_INFO.name}`,
  },
  description: PAGE_CONFIGS.home.description,
  keywords: PAGE_CONFIGS.home.keywords,
  authors: [{ name: SCHOOL_INFO.studentOrgName }],
  icons: {
    icon: "/favicon.ico",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${notoSansSC.variable} ${notoSerifSC.variable} font-sans antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
