"use client";

import { useEffect, useState } from "react";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkStandalone = () => {
      const standalone = window.matchMedia("(display-mode: standalone)").matches;
      const iosStandalone = (window.navigator as any).standalone === true;
      return standalone || iosStandalone;
    };

    setIsStandalone(checkStandalone());

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Don't show if already installed
    if (checkStandalone()) return;

    // Check if user has dismissed before
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show again after 7 days if dismissed
    if (dismissed && daysSinceDismissed < 7) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 30 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, show custom instructions after 30 seconds
    if (iOS && !checkStandalone()) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <div className="bg-zinc-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 pointer-events-auto transform transition-all duration-500 ease-out animate-slide-up">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
            <img src="/icon-192x192.png" alt="Flora" className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-white font-medium text-lg">Install Flora Distro</h3>
            <p className="text-zinc-400 text-sm">Quick access to premium cannabis</p>
          </div>
        </div>

        {isIOS ? (
          <div className="space-y-3">
            <p className="text-zinc-300 text-sm">
              To install on iOS:
            </p>
            <ol className="text-zinc-400 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">1.</span>
                Tap the share button <span className="inline-block w-4 h-4 align-middle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                    <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">2.</span>
                Scroll down and tap "Add to Home Screen"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">3.</span>
                Tap "Add" to install
              </li>
            </ol>
            <button
              onClick={handleDismiss}
              className="w-full py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors"
            >
              Got it
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleDismiss}
              className="flex-1 py-3 bg-zinc-800 text-white rounded-full font-medium hover:bg-zinc-700 transition-colors"
            >
              Not now
            </button>
            <button
              onClick={handleInstall}
              className="flex-1 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 