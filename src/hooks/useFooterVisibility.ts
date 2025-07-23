"use client"

import { useState, useEffect } from 'react';

export const useFooterVisibility = () => {
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [hasScrolledPastFooter, setHasScrolledPastFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if footer is visible in viewport
      const footerVisible = footerRect.top < windowHeight && footerRect.bottom > 0;
      setIsFooterVisible(footerVisible);
      
      // Check if user has scrolled past the footer (footer is above viewport)
      const scrolledPastFooter = footerRect.bottom < 0;
      setHasScrolledPastFooter(scrolledPastFooter);
    };

    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    isFooterVisible,
    hasScrolledPastFooter,
    shouldHidePopups: hasScrolledPastFooter
  };
}; 