/**
 * 教学软件详情页面 - 惠州仲恺中学官网
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, MarkdownRenderer } from "@/components/school";
import { SOFTWARE_DATA, SCHOOL_INFO, SITE_CONFIG } from "@/lib/data";
import { getMarkdownContent } from "@/lib/markdown";

export async function generateStaticParams() {
  return SOFTWARE_DATA.map((software) => ({
    id: software.id.toString(),
  }));
}

export async function generateMetadata({ 
  params 
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const software = SOFTWARE_DATA.find((s) => s.id.toString() === id);
  
  if (!software) return { title: "软件未找到" };
  
  // Canonical URL
  const canonicalUrl = `${SITE_CONFIG.url}/software/${id}`;
  
  return {
    title: `${software.title} - ${SCHOOL_INFO.name}`,
    description: software.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: software.title,
      description: software.description,
      type: 'article',
      url: canonicalUrl,
      images: [
        {
          url: software.image,
          width: 1200,
          height: 630,
          alt: software.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: software.title,
      description: software.description,
      images: [software.image],
    },
  };
}

export default async function SoftwareDetailPage({ 
  params 
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const software = SOFTWARE_DATA.find((s) => s.id.toString() === id);
  
  if (!software) notFound();
  
  const mdContent = getMarkdownContent('software', id);
  
  const title = mdContent.exists && mdContent.frontmatter.title 
    ? mdContent.frontmatter.title 
    : software.title;
  
  // 构建 JSON-LD 结构化数据 - SoftwareApplication
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "applicationCategory": software.category,
    "operatingSystem": software.platform.join(', '),
    "description": software.description,
    "image": [
      software.image,
    ],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CNY",
    },
    "author": {
      "@type": "Organization",
      "name": SCHOOL_INFO.name,
    },
    "publisher": {
      "@type": "Organization",
      "name": SCHOOL_INFO.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_CONFIG.url}/apple-touch-icon.png`,
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/software/${id}`,
    },
  };
  
  return (
    <div>
      {/* JSON-LD 结构化数据 - SoftwareApplication */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <PageHeader title={software.category} subtitle={title} bgImage={software.image} />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/software" prefetch={false} className="inline-flex items-center text-zk-blue hover:text-zk-red mb-8">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回软件列表
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold font-serif-sc text-gray-900 mb-6">{title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                software.category === '教学工具' ? 'bg-zk-red' :
                software.category === '学习资源' ? 'bg-zk-blue' :
                software.category === '办公软件' ? 'bg-green-600' : 'bg-zk-gold'
              }`}>
                {software.category}
              </span>
              <div className="flex items-center gap-2">
                <span>支持平台：</span>
                {software.platform.map((platform, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-8 rounded-lg overflow-hidden">
              <img src={software.image} alt={title} className="w-full h-auto" loading="eager" />
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {software.downloadUrl && (
                <a href={software.downloadUrl} target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 bg-zk-red text-white font-bold rounded-lg hover:bg-red-800 transition-colors">
                  立即下载
                </a>
              )}
              {software.officialUrl && (
                <a href={software.officialUrl} target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 border border-zk-blue text-zk-blue font-bold rounded-lg hover:bg-zk-blue hover:text-white transition-colors">
                  访问官网
                </a>
              )}
            </div>
            
            {software.tags && software.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {software.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-red-50 text-zk-red rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {mdContent.exists && mdContent.html ? (
              <MarkdownRenderer html={mdContent.html} />
            ) : (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">{software.description}</p>
              </div>
            )}
            
            <div className="mt-12 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold mb-4">平台兼容性</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['Windows', 'Mac', 'Linux', 'Web', 'iOS', 'Android'].map((platform) => (
                  <div key={platform}
                    className={`p-3 rounded text-center text-sm ${
                      software.platform.includes(platform) 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                    {platform}
                    {software.platform.includes(platform) ? ' ✓' : ' ✗'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
