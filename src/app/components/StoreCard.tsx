// React import not needed in React 17+
import { StoreItem } from '@/data/constants';

interface StoreCardProps {
  store: {
    id: number;
    name: string;
    image: string;
    location?: string;
  };
  storeData?: StoreItem;
  index: number;
  getStoreStatus: () => { isOpen: boolean; nextOpenText: string };
}

const StoreCard: React.FC<StoreCardProps> = ({ store, storeData, index, getStoreStatus }) => {
  const handleClick = () => {
    if (storeData) {
      const address = encodeURIComponent(`${storeData.address}, ${storeData.city}`);
      window.open(`https://maps.google.com/?q=${address}`, '_blank', 'noopener,noreferrer');
    }
  };

  const { isOpen, nextOpenText } = getStoreStatus();
  const cityState = storeData && storeData.city ? storeData.city.split(',')[1]?.trim() || storeData.city : store.location;

  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards] hover:scale-[1.02] transition-all duration-300 flex-none w-screen md:flex-1 relative overflow-hidden snap-center" 
      style={{ animationDelay: `${0.5 + index * 0.1}s` }}
    >
      <div className="relative aspect-[3/4] w-full" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)' }}>
        {/* Enhanced overlay with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60 pointer-events-none z-[3]"></div>
        
        {/* Subtle border accent */}
        <div className="absolute inset-0 border border-white/10 pointer-events-none z-[4]"></div>
        
        <img src={store.image} alt={`Flora Distro ${store.name}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        
        {/* Location indicator dot - Always visible */}
        <div className="absolute top-6 right-6 z-20">
          <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg animate-pulse"></div>
        </div>
        
        {/* City name - Enhanced typography */}
        <div className="absolute top-8 left-8 z-20">
          <div className="space-y-1">
            <h3 className="font-extralight text-white/95 text-luxury-2xl md:text-luxury-3xl tracking-luxury-normal transition-all duration-300 leading-tight drop-shadow-lg">
              {store.name}
            </h3>
            {/* Subtle location hint - Always visible */}
            <div className="text-white/80 text-luxury-base md:text-luxury-sm font-light tracking-luxury-wide opacity-90 group-hover:opacity-100 transition-opacity duration-300">
              {cityState}
            </div>
          </div>
        </div>
        
        {/* Enhanced bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          {/* Always visible status bar - at very bottom edge */}
          <div className="px-6 py-3 md:py-2 bg-black/50 md:bg-black/40 backdrop-blur-sm border-t border-white/10 absolute bottom-0 left-0 right-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isOpen ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/90 text-sm md:text-xs font-light tracking-wide">Open Now</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-white/80 text-sm md:text-xs font-light tracking-wide">{nextOpenText}</span>
                  </>
                )}
              </div>
              <div className="text-white/60 text-sm md:text-xs font-light">
                Tap to visit
              </div>
            </div>
          </div>
          
          {/* Mobile-friendly info display - Always visible on mobile */}
          <div className="md:hidden px-8 pb-20 opacity-100 transition-all duration-200">
            {storeData ? (
              <div className="space-y-2 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-white/90 text-sm font-light tracking-wide">
                  {storeData.address}, {storeData.city}
                </div>
                <div className="text-white/70 text-sm font-light tracking-wide">
                  {storeData.hours}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[#4A90E2] text-sm font-medium">Get Directions</span>
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <span className="text-white/80 text-sm font-light tracking-wide">
                  {store.location}
                </span>
              </div>
            )}
          </div>
          
          {/* Desktop hover details */}
          <div className="hidden md:block px-8 pb-16 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
            {storeData ? (
              <div className="space-y-2 bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <div className="text-white/90 text-sm font-light tracking-wide">
                  {storeData.address}, {storeData.city}
                </div>
                <div className="text-white/70 text-xs font-light tracking-wide">
                  {storeData.hours}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#4A90E2] text-xs font-medium">Get Directions</span>
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <span className="text-white/80 text-xs font-light tracking-wide">
                  {store.location}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Corner accent */}
        <div className="absolute bottom-0 right-0 w-8 h-8 z-20">
          <div className="absolute bottom-0 right-0 w-full h-full border-r-2 border-b-2 border-white/20 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard; 