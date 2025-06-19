declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    reloadOnOnline?: boolean;
    disable?: boolean;
    buildExcludes?: RegExp[];
    publicExcludes?: string[];
    cacheOnFrontEndNav?: boolean;
    fallbacks?: {
      document?: string;
    };
    cacheStartUrl?: boolean;
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
    runtimeCaching?: Array<{
      urlPattern: RegExp | ((params: { url: URL }) => boolean);
      handler: "CacheFirst" | "NetworkFirst" | "StaleWhileRevalidate";
      options?: {
        cacheName: string;
        expiration?: {
          maxEntries?: number;
          maxAgeSeconds?: number;
        };
        networkTimeoutSeconds?: number;
      };
    }>;
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  
  export = withPWA;
} 