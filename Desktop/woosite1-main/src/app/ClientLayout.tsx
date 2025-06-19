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
    <div className="min-h-screen bg-[#4a4a4a]">
      {/* Fixed Status Bar - stays at top */}
      <StatusBar />
      
      {/* Header - only show in browser mode */}
      {!isPWA && <Header />}
      
      {/* Main scrollable content with proper padding for fixed elements */}
      <main 
        className="w-full"
        style={{
          paddingTop: isPWA ? 'env(safe-area-inset-top)' : '0',
          paddingBottom: isPWA ? 'calc(83px + env(safe-area-inset-bottom))' : '0',
          minHeight: isPWA 
            ? 'calc(100vh - env(safe-area-inset-top) - 83px - env(safe-area-inset-bottom))' 
            : 'auto'
        }}
      >
        {children}
      </main>
      
      {/* Footer - only show in browser mode and not on profile pages */}
      {!isPWA && !isProfilePage && <Footer />}
      
      {/* Bottom Navigation - only show in PWA mode */}
      {isPWA && <BottomNavBar />}
      
      {/* PWA Install Prompt - only show in browser mode */}
      {!isPWA && <PWAInstallPrompt />}
    </div>
  );
} 