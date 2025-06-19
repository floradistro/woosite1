// Shared style constants for consistent styling across the app

// Section styles
export const sectionStyles = {
  base: "relative overflow-hidden -mt-px",
  withInsetShadow: "relative overflow-hidden -mt-px",
  withBackground: "relative bg-[#464646] overflow-hidden -mt-px",
  darkBackground: "relative bg-[#3a3a3a] overflow-hidden -mt-px",
};

// Button styles
export const buttonStyles = {
  primary: "group relative inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:via-green-400 hover:to-emerald-500 text-white rounded-lg font-bold text-base md:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-0 select-none overflow-hidden",
  secondary: "inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white to-white/95 hover:from-white hover:to-white text-black rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl focus:outline-none focus:ring-0 select-none",
  accent: "group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-300 hover:via-orange-300 hover:to-red-300 text-black font-bold text-lg rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-0 select-none",
  ghost: "text-white/70 hover:text-white transition-colors duration-300 underline underline-offset-4 decoration-white/30 hover:decoration-white/60",
};

// Carousel styles
export const carouselStyles = {
  container: {
    boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)',
    scrollBehavior: 'smooth' as const,
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
    backgroundSize: '50px 50px'
  },
  enhanced: {
    boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.06)',
    scrollBehavior: 'smooth' as const,
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
    backgroundSize: '50px 50px',
    backdropFilter: 'blur(1px) saturate(120%)',
    WebkitBackdropFilter: 'blur(1px) saturate(120%)'
  }
};

// Text styles
export const textStyles = {
  sectionTitle: "text-white/95 font-extralight text-luxury-3xl md:text-luxury-4xl tracking-luxury-normal mb-3 hover:text-white transition-colors duration-500 cursor-default",
  sectionSubtitle: "text-white/70 font-light text-luxury-base md:text-luxury-lg mb-4",
  paragraph: "text-white/95 font-light text-luxury-sm md:text-luxury-base leading-relaxed drop-shadow-md",
  muted: "text-white/60 font-light text-sm tracking-[0.1em] italic hover:text-white/70 transition-colors duration-300 cursor-default",
};

// Animation classes
export const animationStyles = {
  fadeInUp: "opacity-0 animate-[fadeInUp_1s_ease-out_0.3s_forwards]",
  fadeInUpDelayed: "opacity-0 animate-[fadeInUp_1s_ease-out_0.5s_forwards]",
  fadeInUpMoreDelayed: "opacity-0 animate-[fadeInUp_1s_ease-out_0.7s_forwards]",
};

// Gradient styles
export const gradientStyles = {
  divider: "w-24 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-4",
  accentDivider: "w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto",
  subtleDivider: "w-12 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-2",
};

// Card styles
export const cardStyles = {
  glass: "bg-gradient-to-br from-white/8 to-white/3 hover:from-white/12 hover:to-white/6 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-500",
  product: "bg-gradient-to-r from-white/12 to-white/8 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.08)] rounded-lg transition-all duration-500",
};

// Layout styles
export const layoutStyles = {
  container: "container mx-auto px-4 md:px-6",
  maxWidth: "max-w-4xl mx-auto",
  maxWidthLarge: "max-w-5xl mx-auto",
  centered: "flex items-center justify-center",
}; 