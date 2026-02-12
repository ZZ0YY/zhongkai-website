/**
 * ============================================================================
 * Tailwind CSS 配置文件 - 惠州仲恺中学官网
 * ============================================================================
 * * 【新手指南】
 * 这个文件用于配置 Tailwind CSS 的自定义主题。
 * * 主要配置项：
 * 1. content: 指定 Tailwind 扫描哪些文件来生成 CSS
 * 2. theme.extend: 扩展默认主题，添加自定义颜色、字体等
 * 3. plugins: 添加 Tailwind 插件
 * * 【如何添加新颜色】
 * 在 theme.extend.colors 中添加：
 * 'my-color': '#123456',
 * 然后在组件中使用：className="text-my-color" 或 "bg-my-color"
 */

import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ====================================================================
        // 仲恺中学主题色系
        // ====================================================================
        
        /**
         * zk-red (深红色) - 主色调
         * 代表学校的历史传承与革命传统
         * 用途：Logo、标题、重要按钮、强调元素
         */
        'zk-red': '#8B0000',
        
        /**
         * zk-blue (深蓝色) - 辅助色
         * 代表学术氛围与沉稳气质
         */
        'zk-blue': '#1E3A8A',
        
        /**
         * zk-gold (金色) - 点缀色
         * 代表荣誉与活力
         */
        'zk-gold': '#F59E0B',
        
        /**
         * zk-gray (浅灰色) - 背景色
         */
        'zk-gray': '#F3F4F6',

        // ====================================================================
        // shadcn/ui 组件库颜色（保持兼容）
        // ====================================================================
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      
      // ====================================================================
      // 字体配置
      // ====================================================================
      fontFamily: {
        /**
         * sans - 无衬线字体（正文使用）
         * Noto Sans SC 是 Google 提供的中文无衬线字体
         */
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        
        /**
         * serif - 衬线字体（标题使用）
         */
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        
        /**
         * serif-sc - 中文衬线字体类
         */
        'serif-sc': ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
      
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },

      // ====================================================================
      // 自定义动画配置
      // ====================================================================
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    }
  },
  plugins: [tailwindcssAnimate],
};

export default config;