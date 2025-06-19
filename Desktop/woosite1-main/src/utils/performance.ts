// Performance utilities for optimization

// Memoized array creation for star ratings
export const createStarArray = (count: number) => {
  const cache = new Map<number, number[]>();
  
  return (rating: number) => {
    if (!cache.has(rating)) {
      cache.set(rating, Array.from({ length: rating }, (_, i) => i));
    }
    return cache.get(rating)!;
  };
};

export const starArrayCache = createStarArray(5);

// Debounce function for search and scroll handlers
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let lastCallTime = 0;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeSinceLastCall >= wait) {
      lastCallTime = now;
      func(...args);
    } else if (!timeout) {
      const remainingWait = wait - timeSinceLastCall;
      timeout = setTimeout(() => {
        lastCallTime = Date.now();
        func(...args);
        timeout = null;
      }, remainingWait);
    }
  };
}

// Intersection Observer factory with caching
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  if (typeof window === 'undefined') return null;
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};

// Request Animation Frame wrapper
export const rafSchedule = (callback: () => void) => {
  let rafId: number | null = null;
  
  return () => {
    if (rafId) return;
    
    rafId = requestAnimationFrame(() => {
      callback();
      rafId = null;
    });
  };
};

/**
 * Request idle callback with fallback
 */
export function requestIdleCallback(
  callback: IdleRequestCallback,
  options?: IdleRequestOptions
): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Fallback for browsers that don't support requestIdleCallback
  const start = Date.now();
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    } as IdleDeadline);
  }, 1) as unknown as number;
}

/**
 * Cancel idle callback with fallback
 */
export function cancelIdleCallback(id: number): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id as unknown as NodeJS.Timeout);
  }
} 