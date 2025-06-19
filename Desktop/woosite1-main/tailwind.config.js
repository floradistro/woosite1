module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/flower/page.tsx',
  ],
  safelist: [
    'scale-[1.03]', 'scale-[1.05]', 'scale-[1.10]', 'scale-[1.25]',
    'hover:scale-[1.03]', 'hover:scale-[1.05]', 'hover:scale-[1.10]', 'hover:scale-[1.25]',
    'hover:-translate-y-1', 'hover:-translate-y-2', 'hover:-translate-y-4',
    'hover:shadow-[0_8px_32px_rgba(0,255,163,0.15)]',
    'hover:shadow-[0_20px_50px_rgba(0,255,163,0.25)]',
    'hover:shadow-[0_35px_60px_rgba(0,255,163,0.35)]',
    'shadow-[0_20px_40px_rgba(0,255,163,0.18)]',
    'hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]',
    'hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]',
    'hover:shadow-[0_0_40px_rgba(99,102,241,0.6)]',
    'hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]',
    'before:opacity-0', 'hover:before:opacity-100',
    'after:opacity-0', 'hover:after:opacity-100',
    'group-hover:scale-110', 'group-hover:scale-125',
    'md:hover:scale-[1.05]', 'md:hover:shadow-[0_35px_60px_rgba(0,255,163,0.35)]', 'md:hover:-translate-y-4',
    'md:before:opacity-0', 'md:group-hover:before:opacity-100', 'md:after:opacity-0', 'md:group-hover:after:opacity-100',
    '-translate-y-2',
    'perspective-1000', 'perspective-1500', 'transform-style-preserve-3d', 'backface-hidden',
    'rotate-y-180', '-rotate-y-180', 'animate-book-open', 'animate-page-flip', 'animate-slide-up-fade',
    'hover:scale-[1.02]', 'scale-[1.02]',
    'font-graffiti', 'don-graffiti',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sf-pro': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'sans': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        'graffiti': ['var(--font-don-graffiti)', 'DonGraffiti', 'Impact', 'Arial Black', 'sans-serif'],
      },
      colors: {
        luxury: {
          gold: '#D4AF37',
          platinum: '#E5E4E2',
          charcoal: '#36454F',
          cream: '#F5F5DC',
          sage: '#9CAF88',
        },
        cannabis: {
          forest: '#355E3B',
          sage: '#87A96B',
          mint: '#98FB98',
        }
      },
      perspective: {
        '1000': '1000px',
        '1500': '1500px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
        '-y-180': 'rotateY(-180deg)',
      },
      animation: {
        'book-open': 'bookOpen 1.5s ease-in-out forwards',
        'page-flip': 'pageFlip 1.5s ease-in-out forwards',
        'slide-up-fade': 'slideUpFade 1s ease-out forwards',
        'book-shadow': 'bookShadow 0.3s ease-in-out forwards',
        'leather-shimmer': 'leatherShimmer 3s ease-in-out infinite',
        'gradientFlash': 'gradientFlash 0.6s ease-out',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'subtle-glow': 'subtleGlow 3s ease-in-out infinite',
      },
      keyframes: {
        bookOpen: {
          // existing keyframes
        },
        pageFlip: {
          // existing keyframes
        },
        slideUpFade: {
          // existing keyframes
        },
        bookShadow: {
          // existing keyframes
        },
        leatherShimmer: {
          // existing keyframes
        },
        gradientFlash: {
          // existing keyframes
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        subtleGlow: {
          '0%': { opacity: '0.6' },
          '50%': { opacity: '0.9' },
          '100%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}; 