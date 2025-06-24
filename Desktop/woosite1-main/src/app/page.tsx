"use client"

import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo } from 'react';
import { useSharedIntersectionObserver } from '@/hooks/useSharedIntersectionObserver';
import { throttle } from '@/utils/performance';
import { useFooterVisibility } from '@/hooks/useFooterVisibility';
import { FLOWER_PRODUCTS } from '@/app/flower/constants';

// Import sections
import HeroSection from './components/HeroSection';
import Section from './components/Section';
import THCAExplanationSection from './components/THCAExplanationSection';
import ReviewsSection from './components/ReviewsSection';
import ExperienceSection from './components/ExperienceSection';
import StoreLocationsSection from './components/StoreLocationsSection';
import AlternativesSection from './components/AlternativesSection';
import BrandStorySection from './components/BrandStorySection';

// Lazy load heavy components for better performance
const ProductShowcase = dynamic(() => import('@/components/ProductShowcase'), {
  loading: () => <div className="h-96 bg-black/20 animate-pulse" />,
  ssr: true
});

const ExitIntent = dynamic(() => import('@/components/ExitIntent'), {
  ssr: false
});

const ScrollToTop = dynamic(() => import('@/components/ScrollToTop'), {
  ssr: false
});

// Helper function to determine store hours
const getStoreStatus = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Check if currently open (Mon-Sat: 11am-9pm, Sun: 12pm-6pm)
  let isOpen = false;
  if (currentDay >= 1 && currentDay <= 6) { // Monday to Saturday
    isOpen = currentHour >= 11 && currentHour < 21;
  } else if (currentDay === 0) { // Sunday
    isOpen = currentHour >= 12 && currentHour < 18;
  }
  
  let nextOpenText = "Open Tomorrow at 11am";
  if (!isOpen) {
    if (currentDay === 0 && currentHour < 12) { // Sunday before noon
      nextOpenText = "Open Today at 12pm";
    } else if (currentDay >= 1 && currentDay <= 6 && currentHour < 11) { // Weekday before 11am
      nextOpenText = "Open Today at 11am";
    } else if (currentDay === 6) { // Saturday
      nextOpenText = "Open Tomorrow at 12pm"; // Sunday
    }
  }
  
  return { isOpen, nextOpenText };
};

// Custom hook for store status with memoization
const useStoreStatus = () => {
  return useMemo(() => getStoreStatus(), []);
};

export default function Home() {
  const visibleSections = useSharedIntersectionObserver();
  const [timeUntilDeadline, setTimeUntilDeadline] = useState('');
  const storeStatus = useStoreStatus();
  const { shouldHidePopups } = useFooterVisibility();

  // Calculate time until 2PM deadline with throttling
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const deadline = new Date();
      deadline.setHours(14, 0, 0, 0); // 2PM
      
      if (now > deadline) {
        deadline.setDate(deadline.getDate() + 1);
      }
      
      const diff = deadline.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilDeadline(`${hours}h ${minutes}m`);
    };

    // Throttle the time calculation to update only once per minute
    const throttledCalculateTimeLeft = throttle(calculateTimeLeft, 60000);

    calculateTimeLeft(); // Initial calculation
    const interval = setInterval(throttledCalculateTimeLeft, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#4a4a4a] text-white font-light">
      <main>
        <HeroSection timeUntilDeadline={timeUntilDeadline} />
        
        {/* Only difference section */}
        <Section className="relative bg-[#464646] overflow-hidden -mt-px">
          <div className="relative z-10 py-6 w-full">
            <div className="w-full text-center">
              <div className="transition-all duration-1000 opacity-100 translate-y-0">
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-3 md:mb-4">
                  <p className="text-white/90 text-lg md:text-xl lg:text-2xl tracking-luxury-wide font-light drop-shadow-lg">We sell real weed.</p>
                  <p className="text-emerald-300 font-bold hover:text-emerald-200 transition-colors duration-300 text-lg md:text-xl lg:text-2xl drop-shadow-lg">In stores and online.</p>
                </div>
                <p className="text-white/70 text-sm md:text-base lg:text-lg font-light tracking-wide drop-shadow-md">
                  No headshop bullsh*t. No gas station gimmicks. Just premium cannabis, shipped fast.
                </p>
              </div>
            </div>
          </div>
        </Section>
        
        <ProductShowcase products={FLOWER_PRODUCTS} />
        
        <THCAExplanationSection 
          visibleSections={visibleSections} 
          timeUntilDeadline={timeUntilDeadline} 
        />
        
        <ReviewsSection visibleSections={visibleSections} />
        
        <ExperienceSection timeUntilDeadline={timeUntilDeadline} />
        
        <StoreLocationsSection storeStatus={storeStatus} />
        
        <AlternativesSection />
        
        <BrandStorySection />
      </main>
      
      {/* Floating Components */}
      <ScrollToTop />
      <ExitIntent />
    </div>
  );
}
