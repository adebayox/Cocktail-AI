import React, { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

const InstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  // Days before showing prompt again after dismissal (7 days)
  const REMINDER_INTERVAL_DAYS = 7;

  const shouldShowPrompt = () => {
    // Check if already installed
    if (isStandalone) return false;

    // Check dismissal status
    const dismissedData = localStorage.getItem("pwa-install-dismissed");
    if (!dismissedData) return true; // Never dismissed

    try {
      const dismissed = JSON.parse(dismissedData);
      const dismissedDate = new Date(dismissed.timestamp);
      const now = new Date();
      const daysSinceDismissed = (now - dismissedDate) / (1000 * 60 * 60 * 24);

      // Show again if enough days have passed
      if (daysSinceDismissed >= REMINDER_INTERVAL_DAYS) {
        return true;
      }

      // Also show if user has visited multiple times (engagement-based)
      const visitCount = dismissed.visitCount || 0;
      if (visitCount >= 3 && daysSinceDismissed >= 3) {
        return true;
      }

      return false;
    } catch {
      return true; // If parse fails, show it
    }
  };

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches 
      || window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Track visit count
    const dismissedData = localStorage.getItem("pwa-install-dismissed");
    if (dismissedData && !standalone) {
      try {
        const dismissed = JSON.parse(dismissedData);
        dismissed.visitCount = (dismissed.visitCount || 0) + 1;
        dismissed.lastVisit = new Date().toISOString();
        localStorage.setItem("pwa-install-dismissed", JSON.stringify(dismissed));
      } catch {
        // Ignore parse errors
      }
    }

    // Listen for beforeinstallprompt (Android/Desktop Chrome)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      
      if (shouldShowPrompt()) {
        // Delay slightly to not be intrusive
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Show iOS prompt if on iOS and should show
    if (iOS && shouldShowPrompt()) {
      // Delay showing to not be intrusive
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();
    console.log("Install prompt result:", result);
    
    // Mark as installed
    localStorage.setItem("pwa-install-dismissed", JSON.stringify({
      timestamp: new Date().toISOString(),
      installed: true
    }));
    
    setInstallPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // Store dismissal with timestamp and visit count
    const dismissedData = localStorage.getItem("pwa-install-dismissed");
    let data = { timestamp: new Date().toISOString(), visitCount: 0 };
    
    if (dismissedData) {
      try {
        const existing = JSON.parse(dismissedData);
        data.visitCount = existing.visitCount || 0;
      } catch {
        // Reset if corrupted
      }
    }
    
    localStorage.setItem("pwa-install-dismissed", JSON.stringify(data));
  };

  // Don't show if already installed
  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-md mx-auto bg-black border-4 border-brutal-accent p-6 shadow-brutal-accent-lg">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-brutal-accent hover:text-white transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={3} />
        </button>

        {/* Content */}
        <div className="pr-8">
          <h3 className="font-display font-black text-brutal-accent text-lg uppercase mb-2">
            Install App
          </h3>
          
          {isIOS ? (
            // iOS instructions
            <div className="space-y-3">
              <p className="font-mono text-sm text-white/80">
                Install this app on your device:
              </p>
              <ol className="font-mono text-sm text-white/80 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-brutal-accent font-bold">1.</span>
                  <span>Tap the share button <span className="inline-block px-2 py-0.5 bg-white/10 text-xs">↑</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brutal-accent font-bold">2.</span>
                  <span>Scroll and tap "Add to Home Screen"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brutal-accent font-bold">3.</span>
                  <span>Tap "Add" to install</span>
                </li>
              </ol>
              <button
                onClick={handleDismiss}
                className="w-full mt-4 py-3 bg-brutal-accent text-black font-display font-bold uppercase border-4 border-brutal-accent hover:bg-black hover:text-brutal-accent transition-colors"
              >
                Got it
              </button>
            </div>
          ) : (
            // Android/Desktop install
            <div className="space-y-4">
              <p className="font-mono text-sm text-white/80">
                Add to your home screen for quick access
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 py-3 bg-brutal-accent text-black font-display font-bold uppercase border-4 border-brutal-accent hover:bg-black hover:text-brutal-accent transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" strokeWidth={2.5} />
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="py-3 px-4 border-4 border-white/30 text-white/60 font-mono text-sm uppercase hover:border-white/60 hover:text-white transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;

