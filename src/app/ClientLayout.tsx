'use client'

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Header from "./components/Header";
import { useMobilePerformance } from "@/hooks/useMobilePerformance";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProfilePage = pathname?.startsWith('/profile');
  
  // Initialize mobile performance optimizations
  useMobilePerformance();

  return (
    <div className="min-h-screen bg-[#4a4a4a] relative">

      
      {/* Header */}
      <Header />
      
      {/* Main scrollable content */}
      <main 
        className="w-full"
        style={{
          minHeight: '100vh'
        }}
      >
        {children}
      </main>
      
      {/* Footer - only show on desktop and not on profile pages */}
      {!isProfilePage && <Footer />}
    </div>
  );
} 