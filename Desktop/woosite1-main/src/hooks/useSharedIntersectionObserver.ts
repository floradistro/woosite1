import { useEffect, useRef, useCallback, useState } from 'react';

// Mobile-optimized intersection observer configuration
const MOBILE_CONFIG = {
  rootMargin: '50px', // Smaller margin for mobile to reduce unnecessary triggers
  threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], // More granular thresholds for smoother animations
};

const DESKTOP_CONFIG = {
  rootMargin: '100px',
  threshold: [0, 0.1, 0.5, 1],
};

// Detect mobile device
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Global intersection observer instance for better performance
let globalObserver: IntersectionObserver | null = null;
const observedElements = new Map<Element, Set<(entry: IntersectionObserverEntry) => void>>();

// Initialize global observer with mobile-optimized settings
const initializeGlobalObserver = () => {
  if (typeof window === 'undefined' || globalObserver) return;

  const config = isMobile() ? MOBILE_CONFIG : DESKTOP_CONFIG;

  globalObserver = new IntersectionObserver(
    (entries) => {
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        entries.forEach((entry) => {
          const callbacks = observedElements.get(entry.target);
          if (callbacks) {
            callbacks.forEach((callback) => {
              try {
                callback(entry);
              } catch (error) {
                console.warn('Error in intersection observer callback:', error);
              }
            });
          }
        });
      });
    },
    {
      root: null,
      ...config,
    }
  );
};

// Original hook for backward compatibility - returns visible sections as Set
export const useSharedIntersectionObserver = (threshold = 0.1, rootMargin = '50px') => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize global observer if it doesn't exist
    if (!globalObserver) {
      initializeGlobalObserver();
    }

    if (!globalObserver) return;

    const handleIntersection = (entry: IntersectionObserverEntry) => {
      const element = entry.target;
      if (entry.isIntersecting && element.id) {
        setVisibleSections(prev => new Set([...prev, element.id]));
      } else if (!entry.isIntersecting && element.id) {
        setVisibleSections(prev => {
          const newSet = new Set(prev);
          newSet.delete(element.id);
          return newSet;
        });
      }
    };

    // Observe all sections with IDs
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      // Add callback for this component
      if (!observedElements.has(section)) {
        observedElements.set(section, new Set());
        globalObserver!.observe(section);
      }
      
      observedElements.get(section)!.add(handleIntersection);
    });

    return () => {
      // Clean up callbacks for this component
      sections.forEach(section => {
        const callbacks = observedElements.get(section);
        if (callbacks) {
          callbacks.delete(handleIntersection);
          
          // If no more callbacks, unobserve the element
          if (callbacks.size === 0) {
            globalObserver?.unobserve(section);
            observedElements.delete(section);
          }
        }
      });
    };
  }, [threshold, rootMargin]);

  return visibleSections;
};

// New advanced hook for custom callback usage
export const useIntersectionObserver = (
  callback: (entry: IntersectionObserverEntry) => void,
  options?: {
    enabled?: boolean;
    once?: boolean;
  }
) => {
  const elementRef = useRef<Element | null>(null);
  const callbackRef = useRef(callback);
  const hasTriggeredRef = useRef(false);
  const { enabled = true, once = false } = options || {};

  // Update callback ref when callback changes
  callbackRef.current = callback;

  // Memoized callback wrapper
  const wrappedCallback = useCallback((entry: IntersectionObserverEntry) => {
    if (once && hasTriggeredRef.current) return;
    
    callbackRef.current(entry);
    
    if (once && entry.isIntersecting) {
      hasTriggeredRef.current = true;
    }
  }, [once]);

  const observe = useCallback((element: Element | null) => {
    if (!enabled || !element || elementRef.current === element) return;

    // Clean up previous observation
    if (elementRef.current && globalObserver) {
      const callbacks = observedElements.get(elementRef.current);
      if (callbacks) {
        callbacks.delete(wrappedCallback);
        if (callbacks.size === 0) {
          globalObserver.unobserve(elementRef.current);
          observedElements.delete(elementRef.current);
        }
      }
    }

    elementRef.current = element;

    // Initialize global observer if needed
    if (!globalObserver) {
      initializeGlobalObserver();
    }

    if (globalObserver && element) {
      // Add callback to the set for this element
      if (!observedElements.has(element)) {
        observedElements.set(element, new Set());
        globalObserver.observe(element);
      }
      observedElements.get(element)!.add(wrappedCallback);
    }
  }, [enabled, wrappedCallback]);

  const unobserve = useCallback(() => {
    if (elementRef.current && globalObserver) {
      const callbacks = observedElements.get(elementRef.current);
      if (callbacks) {
        callbacks.delete(wrappedCallback);
        if (callbacks.size === 0) {
          globalObserver.unobserve(elementRef.current);
          observedElements.delete(elementRef.current);
        }
      }
    }
    elementRef.current = null;
    hasTriggeredRef.current = false;
  }, [wrappedCallback]);

  useEffect(() => {
    return () => {
      unobserve();
    };
  }, [unobserve]);

  return { observe, unobserve };
};

// Cleanup function for global observer
export const cleanupGlobalObserver = () => {
  if (globalObserver) {
    globalObserver.disconnect();
    globalObserver = null;
    observedElements.clear();
  }
};

// Performance monitoring for intersection observer
export const measureIntersectionPerformance = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  const startMark = 'intersection-observer-start';
  const endMark = 'intersection-observer-end';

  return {
    start: () => performance.mark(startMark),
    end: () => {
      performance.mark(endMark);
      performance.measure('intersection-observer', startMark, endMark);
      
      const measure = performance.getEntriesByName('intersection-observer')[0];
      if (measure) {
        console.log(`Intersection Observer: ${measure.duration.toFixed(2)}ms`);
      }
      
      // Clean up marks
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures('intersection-observer');
    },
  };
};

// Alternative hook for single element observation
export const useElementIntersection = (elementRef: React.RefObject<Element>, options?: IntersectionObserverInit) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '50px', ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, options]);

  return isVisible;
}; 