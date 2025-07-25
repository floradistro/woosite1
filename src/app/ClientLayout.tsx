'use client'

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Header from "./components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useMobilePerformance } from "@/hooks/useMobilePerformance";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProfilePage = pathname?.startsWith('/profile');
  
  // Initialize mobile performance optimizations
  useMobilePerformance();

  return (
    <div className="min-h-screen bg-[#4a4a4a] relative">
      {/* Header with glass blur */}
      <Header />
      
      {/* Main scrollable content */}
      <main 
        className="w-full pt-[60px] pb-[calc(60px+env(safe-area-inset-bottom))] md:pt-[60px] md:pb-0"
        style={{
          minHeight: '100vh'
        }}
      >
        {children}
      </main>
      
      {/* Bottom Navigation - only show on mobile */}
      <BottomNavigation />
      
      {/* Footer - only show on desktop and not on profile pages */}
      <div className="hidden md:block">
        {!isProfilePage && <Footer />}
      </div>
    </div>
  );
} 