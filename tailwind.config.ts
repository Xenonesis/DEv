import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
        extend: {
                screens: {
                        'xs': '475px',
                        'sm': '640px',
                        'md': '768px',
                        'lg': '1024px',
                        'xl': '1280px',
                        '2xl': '1536px',
                        '3xl': '1600px',
                        '4xl': '1920px'
                },
                colors: {
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
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)',
                        xl: 'calc(var(--radius) + 4px)',
                        '2xl': 'calc(var(--radius) + 8px)',
                        '3xl': 'calc(var(--radius) + 12px)'
                },
                animation: {
                        'blob': 'blob 7s infinite',
                        'float': 'float 6s ease-in-out infinite',
                        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
                        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
                        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'shimmer': 'shimmer 2s linear infinite',
                        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
                        'rotate-slow': 'rotate-slow 20s linear infinite',
                        'scale-pulse': 'scale-pulse 3s ease-in-out infinite',
                },
                keyframes: {
                        blob: {
                                '0%': { transform: 'translate(0px, 0px) scale(1)' },
                                '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                                '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                                '100%': { transform: 'translate(0px, 0px) scale(1)' },
                        },
                        float: {
                                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                                '33%': { transform: 'translateY(-20px) rotate(120deg)' },
                                '66%': { transform: 'translateY(10px) rotate(240deg)' },
                        },
                        'fade-in-up': {
                                'from': { opacity: '0', transform: 'translateY(30px)' },
                                'to': { opacity: '1', transform: 'translateY(0)' },
                        },
                        'gradient-shift': {
                                '0%, 100%': { backgroundPosition: '0% 50%' },
                                '50%': { backgroundPosition: '100% 50%' },
                        },
                        'pulse-slow': {
                                '0%, 100%': { opacity: '1' },
                                '50%': { opacity: '0.7' },
                        },
                        shimmer: {
                                '0%': { backgroundPosition: '-200% 0' },
                                '100%': { backgroundPosition: '200% 0' },
                        },
                        'bounce-subtle': {
                                '0%, 100%': { transform: 'translateY(0)' },
                                '50%': { transform: 'translateY(-5px)' },
                        },
                        'rotate-slow': {
                                'from': { transform: 'rotate(0deg)' },
                                'to': { transform: 'rotate(360deg)' },
                        },
                        'scale-pulse': {
                                '0%, 100%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.05)' },
                        }
                },
                backdropBlur: {
                        xs: '2px',
                },
                spacing: {
                        '18': '4.5rem',
                        '88': '22rem',
                        '128': '32rem',
                        '144': '36rem',
                }
        }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
