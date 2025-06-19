import React, { useRef, useCallback, memo, useEffect } from 'react';
import { throttle } from '@/utils/performance';
import CarouselArrow from '@/app/components/CarouselArrow';

interface CarouselContainerProps {
  children: React.ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
  className?: string;
  showArrows?: boolean;
  arrowIdPrefix?: string;
}

const CarouselContainer = memo<CarouselContainerProps>(({
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

  const updateArrowVisibility = useCallback((target: HTMLElement) => {
    const leftBtn = leftArrowRef.current;
    const rightBtn = rightArrowRef.current;
    
    if (!leftBtn || !rightBtn) return;
    
    const isAtStart = target.scrollLeft <= 50;
    const isAtEnd = target.scrollLeft >= target.scrollWidth - target.clientWidth - 50;
    
    // Use opacity for arrow visibility
    if (isAtStart) {
      leftBtn.style.opacity = '0';
      leftBtn.style.pointerEvents = 'none';
    } else {
      leftBtn.style.opacity = '0.6';
      leftBtn.style.pointerEvents = 'auto';
    }
    
    if (isAtEnd) {
      rightBtn.style.opacity = '0';
      rightBtn.style.pointerEvents = 'none';
    } else {
      rightBtn.style.opacity = '0.6';
      rightBtn.style.pointerEvents = 'auto';
    }
  }, []);

  const handleScroll = useCallback(
    throttle((e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      updateArrowVisibility(target);
      
      if (onScroll) {
        onScroll(e);
      }
    }, 100),
    [onScroll, updateArrowVisibility]
  );

  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const scrollAmount = direction === 'left' ? -300 : 300;
    carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }, []);

  // Initialize arrow visibility on mount
  useEffect(() => {
    if (carouselRef.current) {
      updateArrowVisibility(carouselRef.current);
    }
  }, [updateArrowVisibility]);

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
            className="opacity-0 pointer-events-none transition-opacity duration-300"
            onClick={(e) => {
              e.preventDefault();
              scrollCarousel('left');
            }}
          />
          
          <CarouselArrow
            ref={rightArrowRef}
            direction="right"
            id={`${arrowIdPrefix}-scroll-right`}
            className="opacity-60 transition-opacity duration-300"
            onClick={(e) => {
              e.preventDefault();
              scrollCarousel('right');
            }}
          />
        </>
      )}
    </div>
  );
});

CarouselContainer.displayName = 'CarouselContainer';

export default CarouselContainer; 