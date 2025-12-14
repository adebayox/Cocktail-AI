import React, { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

const InstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches 
      || window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for beforeinstallprompt (Android/Desktop Chrome)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      
      // Check if user dismissed before
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed && !standalone) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Show iOS prompt if on iOS and not installed
    if (iOS && !standalone) {
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        // Delay showing to not be intrusive
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    const result = await installPrompt.prompt();
    console.log("Install prompt result:", result);
    
    setInstallPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", "true");
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

