import React from 'react';

interface CarouselArrowProps {
  direction: 'left' | 'right';
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ref?: React.RefObject<HTMLButtonElement>;
  className?: string;
  id?: string;
}

const CarouselArrow = React.forwardRef<HTMLButtonElement, CarouselArrowProps>(
  ({ direction, onClick, className = '', id }, ref) => {
    const isLeft = direction === 'left';
    
    return (
      <button 
        ref={ref}
        id={id}
        className={`absolute ${isLeft ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 z-20 cursor-pointer hover:scale-110 transition-all duration-300 ${className}`}
        onClick={onClick}
      >
        <div className="flex flex-col items-center gap-2 hover:opacity-100">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
            <svg className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d={isLeft ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} 
              />
            </svg>
          </div>
          <span className="text-white/60 text-xs font-light tracking-wide">
            {isLeft ? 'Back' : 'Scroll'}
          </span>
        </div>
      </button>
    );
  }
);

CarouselArrow.displayName = 'CarouselArrow';

export default CarouselArrow; 