import { useEffect, useCallback, useRef } from 'react';

// Mobile performance optimization hook
export const useMobilePerformance = () => {
  const rafIdRef = useRef<number | null>(null);

  // Optimize viewport for mobile
  const optimizeViewport = useCallback(() => {
    if (typeof window === 'undefined') return;

    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover'
      );
    }

    // Set CSS custom properties for safe areas
    document.documentElement.style.setProperty(
      '--safe-area-inset-top',
      'env(safe-area-inset-top, 0px)'
    );
    document.documentElement.style.setProperty(
      '--safe-area-inset-bottom',
      'env(safe-area-inset-bottom, 0px)'
    );
  }, []);

  // Smooth scroll handler with RAF throttling
  const createSmoothScrollHandler = useCallback((callback: () => void) => {
    return () => {
      if (rafIdRef.current) return;
      
      rafIdRef.current = requestAnimationFrame(() => {
        callback();
        rafIdRef.current = null;
      });
    };
  }, []);

  // Preload critical assets
  const preloadCriticalAssets = useCallback((assets: string[]) => {
    if (typeof window === 'undefined') return;

    assets.forEach((asset) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (asset.endsWith('.css')) {
        link.as = 'style';
      } else if (asset.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
        link.as = 'image';
      } else if (asset.match(/\.(woff|woff2|ttf|otf)$/)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }
      
      link.href = asset;
      document.head.appendChild(link);
    });
  }, []);

  // Optimize image loading for mobile
  const optimizeImageLoading = useCallback((
    img: HTMLImageElement,
    src: string,
    options?: {
      sizes?: string;
      priority?: boolean;
    }
  ) => {
    // Use native lazy loading
    if (!options?.priority) {
      img.loading = 'lazy';
    }

    // Add decoding async for better performance
    img.decoding = 'async';

    // Set sizes for responsive images
    if (options?.sizes) {
      img.sizes = options.sizes;
    }

    img.src = src;
  }, []);

  // Enable passive event listeners
  const addPassiveListener = useCallback((
    element: HTMLElement,
    event: string,
    handler: EventListener
  ) => {
    element.addEventListener(event, handler, { passive: true });
    
    return () => {
      element.removeEventListener(event, handler);
    };
  }, []);

  // Check if user prefers reduced motion
  const respectReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }

    return prefersReducedMotion;
  }, []);

  // Performance measurement utility
  const measurePerformance = useCallback((metricName: string) => {
    if (typeof window === 'undefined' || !window.performance) return;

    const startMark = `${metricName}-start`;
    const endMark = `${metricName}-end`;

    return {
      start: () => performance.mark(startMark),
      end: () => {
        performance.mark(endMark);
        performance.measure(metricName, startMark, endMark);
        
        const measure = performance.getEntriesByName(metricName)[0];
        if (measure && process.env.NODE_ENV === 'development') {
          console.log(`${metricName}: ${measure.duration.toFixed(2)}ms`);
        }
        
        // Clean up marks
        performance.clearMarks(startMark);
        performance.clearMarks(endMark);
        performance.clearMeasures(metricName);
      },
    };
  }, []);

  // Initialize mobile optimizations
  useEffect(() => {
    optimizeViewport();
    respectReducedMotion();
    
    // Add performance classes to body
    document.body.classList.add('gpu-accelerated', 'smooth-transition');
    
    // Preload critical fonts
    preloadCriticalAssets([
      '/fonts/SF-Pro-Display-Regular.otf',
      '/fonts/SF-Pro-Display-Medium.otf',
      '/DonGraffiti.otf'
    ]);

    // Cleanup function
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [optimizeViewport, respectReducedMotion, preloadCriticalAssets]);

  return {
    createSmoothScrollHandler,
    optimizeImageLoading,
    addPassiveListener,
    measurePerformance,
    respectReducedMotion,
  };
}; 