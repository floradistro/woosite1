// Common gradient styles used throughout the application
export const gradients = {
  // Button gradients
  emerald: 'bg-black hover:bg-gray-900',
  yellow: 'bg-black hover:bg-gray-900',
  white: 'bg-gradient-to-r from-white to-white/95 hover:from-white hover:to-white',
  
  // Card gradients
  cardBase: 'bg-gradient-to-br from-white/5 to-white/2 hover:from-white/8 hover:to-white/4',
  cardGlass: 'bg-gradient-to-br from-white/8 to-white/3 hover:from-white/12 hover:to-white/6',
  cardLight: 'bg-gradient-to-br from-white/8 to-white/4 hover:from-white/12 hover:to-white/8',
  
  // Overlay gradients
  overlayDark: 'bg-gradient-to-b from-transparent via-black/8 to-black/25',
  overlayLight: 'bg-gradient-to-b from-black/10 via-transparent to-black/15',
  overlayBottom: 'bg-gradient-to-t from-black/80 to-transparent',
  
  // Decorative gradients
  divider: 'bg-gradient-to-r from-transparent via-white/60 to-transparent',
  dividerSmall: 'bg-gradient-to-r from-transparent via-white/40 to-transparent',
  shimmer: 'bg-gradient-to-r from-transparent via-white/10 to-transparent',
  
  // Accent gradients
  accentEmerald: 'bg-gradient-to-b from-emerald-400 to-emerald-400/20',
  accentAmber: 'bg-gradient-to-b from-amber-400 to-amber-400/20',
  accentBlue: 'bg-gradient-to-b from-blue-400 to-blue-400/20',
  
  // Background gradients
  bgPrimary: 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800',
  bgSection: 'bg-gradient-to-b from-transparent to-black/20',
  
  // Special effects
  glow: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/10',
  pulse: 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10'
} as const;

// Gradient class builder for dynamic gradients
export const buildGradient = (from: string, via?: string, to?: string, hover?: { from: string, via?: string, to: string }) => {
  const base = via 
    ? `bg-gradient-to-r from-${from} via-${via} to-${to}`
    : `bg-gradient-to-r from-${from} to-${to}`;
    
  if (hover) {
    const hoverClass = hover.via
      ? `hover:from-${hover.from} hover:via-${hover.via} hover:to-${hover.to}`
      : `hover:from-${hover.from} hover:to-${hover.to}`;
    return `${base} ${hoverClass}`;
  }
  
  return base;
}; 