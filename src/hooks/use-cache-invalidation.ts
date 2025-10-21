'use client';

import { useCallback } from 'react';

// Global cache invalidation event system
const CACHE_INVALIDATION_EVENT = 'cache-invalidation';

export const useCacheInvalidation = () => {
  const invalidateCache = useCallback(() => {
    console.log('🗑️ Cache invalidation triggered - clearing all cached data');
    
    // Dispatch a custom event to notify all components to clear their cache
    window.dispatchEvent(new CustomEvent(CACHE_INVALIDATION_EVENT, {
      detail: { timestamp: Date.now() }
    }));
  }, []);

  const subscribeToCacheInvalidation = useCallback((callback: () => void) => {
    const handleInvalidation = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('📨 Cache invalidation received', customEvent.detail);
      callback();
    };

    window.addEventListener(CACHE_INVALIDATION_EVENT, handleInvalidation);

    // Return cleanup function
    return () => {
      window.removeEventListener(CACHE_INVALIDATION_EVENT, handleInvalidation);
    };
  }, []);

  return {
    invalidateCache,
    subscribeToCacheInvalidation,
  };
};