"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Reload the page when back online
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto bg-zinc-900 rounded-full flex items-center justify-center">
            <WifiOff className="w-16 h-16 text-zinc-600" />
          </div>
          {isOnline && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-emerald-500/20 rounded-full animate-ping" />
            </div>
          )}
        </div>
        
        <h1 className="text-3xl font-light text-white mb-4">
          {isOnline ? "Back Online!" : "You're Offline"}
        </h1>
        
        <p className="text-zinc-400 mb-8 text-lg font-light">
          {isOnline 
            ? "Reconnecting to Flora Distro..." 
            : "Check your internet connection to continue shopping premium cannabis"
          }
        </p>

        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>

        <div className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Flora Distro works offline too! Your cart and recently viewed items are saved.
          </p>
        </div>
      </div>
    </div>
  );
} 