import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#F2EDE3',
        ink:       '#1C1810',
        rust:      '#B85C38',
        sage:      '#4E7253',
        dust:      '#9B8C7A',
        fog:       '#CFC4B4',
        cream:     '#FAF6EE',
        dusk:      '#6B5F7A',
        amber:     '#C49A3C',
      },
      fontFamily: {
        mono:  ['var(--font-space-mono)', 'Courier New', 'monospace'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
