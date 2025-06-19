'use client'

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Header from "./components/Header";
import StatusBar from "./components/StatusBar";
import BottomNavBar from "./components/BottomNavBar";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { useMobilePerformance } from "@/hooks/useMobilePerformance";
import { usePWA } from "@/hooks/usePWA";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProfilePage = pathname?.startsWith('/profile');
  const { isPWA } = usePWA();
  
  // Initialize mobile performance optimizations
  useMobilePerformance();

  return (
    <div className="min-h-screen bg-[#4a4a4a] relative">
      {/* Fixed Status Bar - stays at top */}
      <StatusBar />
      
      {/* Header - only show in browser mode */}
      {!isPWA && <Header />}
      
      {/* Main scrollable content with proper padding for fixed elements */}
      <main 
        className="w-full relative"
        style={{
          paddingTop: isPWA ? 'env(safe-area-inset-top)' : '0',
          paddingBottom: 'calc(56px + env(safe-area-inset-bottom))',
          minHeight: '100vh'
        }}
      >
        {children}
      </main>
      
      {/* Footer - only show on desktop and not on profile pages */}
      {!isProfilePage && <Footer />}
      
      {/* Bottom Navigation - fixed at bottom of viewport */}
      <BottomNavBar />
      
      {/* PWA Install Prompt - only show in browser mode */}
      {!isPWA && <PWAInstallPrompt />}
    </div>
  );
} 