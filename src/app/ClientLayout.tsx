'use client'

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Header from "./components/Header";
import { useMobilePerformance } from "@/hooks/useMobilePerformance";
import { usePWA } from "@/hooks/usePWA";
import PWABottomNav from "@/components/PWABottomNav";
import PWAHeader from "@/components/PWAHeader";
import PWAServiceWorker from "@/components/PWAServiceWorker";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProfilePage = pathname?.startsWith('/profile');
  
  // Initialize mobile performance optimizations
  useMobilePerformance();
  
  // PWA functionality
  const { isPWA, isStandalone } = usePWA();

  // Adjust body padding for PWA mode
  useEffect(() => {
    if (isPWA) {
      document.body.style.paddingTop = 'env(safe-area-inset-top)';
      document.body.style.paddingBottom = 'env(safe-area-inset-bottom)';
    }
  }, [isPWA]);

  return (
    <>
      {/* PWA Service Worker Registration */}
      <PWAServiceWorker />
      
      <div className="min-h-screen bg-[#4a4a4a] relative">
        {/* Conditional Header - PWA vs Regular */}
        {isPWA ? (
          <PWAHeader 
            showBack={pathname !== '/'}
            showSearch={['/flower', '/vape', '/edible', '/concentrate'].includes(pathname)}
          />
        ) : (
          <Header />
        )}
        
        {/* Main scrollable content with PWA adjustments */}
        <main 
          className="w-full"
          style={{
            minHeight: '100vh',
            paddingTop: isPWA ? 'calc(env(safe-area-inset-top) + 3.5rem)' : undefined,
            paddingBottom: isPWA ? 'calc(env(safe-area-inset-bottom) + 4rem)' : undefined,
          }}
        >
          {children}
        </main>
        
        {/* Footer - only show on desktop and not on profile pages and not in PWA */}
        {!isProfilePage && !isPWA && <Footer />}
        
        {/* PWA Bottom Navigation */}
        {isPWA && <PWABottomNav />}
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
      </div>
    </>
  );
} 