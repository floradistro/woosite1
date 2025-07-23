import React, { useRef } from 'react';
import CarouselArrow from './CarouselArrow';

interface CarouselContainerProps {
  children: React.ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
  className?: string;
  showArrows?: boolean;
  arrowIdPrefix?: string;
}

const CarouselContainer: React.FC<CarouselContainerProps> = ({
  children,
  onScroll,
  style,
  className = '',
  showArrows = true,
  arrowIdPrefix = 'carousel'
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLButtonElement>(null);
  const rightArrowRef = useRef<HTMLButtonElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const leftBtn = leftArrowRef.current;
    const rightBtn = rightArrowRef.current;
    
    if (leftBtn && rightBtn) {
      if (target.scrollLeft > 50) {
        leftBtn.style.opacity = '0.6';
        leftBtn.style.pointerEvents = 'auto';
      } else {
        leftBtn.style.opacity = '0';
        leftBtn.style.pointerEvents = 'none';
      }
      
      if (target.scrollLeft >= target.scrollWidth - target.clientWidth - 50) {
        rightBtn.style.opacity = '0';
        rightBtn.style.pointerEvents = 'none';
      } else {
        rightBtn.style.opacity = '0.6';
        rightBtn.style.pointerEvents = 'auto';
      }
    }
    
    if (onScroll) {
      onScroll(e);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    const carousel = carouselRef.current;
    if (carousel) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div 
        ref={carouselRef}
        className={`flex overflow-x-auto scrollbar-hide snap-x snap-mandatory md:snap-none relative ${className}`}
        style={style}
        onScroll={handleScroll}
      >
        {children}
      </div>
      
      {showArrows && (
        <>
          <CarouselArrow
            ref={leftArrowRef}
            direction="left"
            id={`${arrowIdPrefix}-scroll-left`}
            className="opacity-0 pointer-events-none"
            onClick={(e) => {
              e.preventDefault();
              scrollCarousel('left');
            }}
          />
          
          <CarouselArrow
            ref={rightArrowRef}
            direction="right"
            id={`${arrowIdPrefix}-scroll-right`}
            className="opacity-60"
            onClick={(e) => {
              e.preventDefault();
              scrollCarousel('right');
            }}
          />
        </>
      )}
    </div>
  );
};

export default CarouselContainer; 