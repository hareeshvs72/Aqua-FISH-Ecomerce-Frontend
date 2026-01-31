import React, { useEffect, useRef, useState } from 'react';

/**
 * Premium Aqua Store Preloader - Deep Silhouette Variant
 * Optimized for environments where GSAP is loaded via CDN to avoid resolution errors.
 */

const loadGSAP = () => {
  return new Promise((resolve) => {
    if (window.gsap) {
      resolve(window.gsap);
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => resolve(window.gsap);
    document.head.appendChild(script);
  });
};

const DeepSilhouettePreloader = () => {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadGSAP().then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (!isReady || !window.gsap) return;

    const gsap = window.gsap;
    const ctx = gsap.context(() => {
      // 1. Smooth Wave Animation
      gsap.to(".wave-line", {
        attr: { d: "M0 25 Q25 10 50 25 T100 25" },
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
      
      // 2. Fish Silhouette Left-to-Right Loop
      gsap.fromTo(".fish-silhouette", 
        { x: -60, opacity: 0 }, 
        { 
          x: 300, 
          opacity: 1, 
          duration: 3, 
          ease: "power1.inOut", 
          repeat: -1,
          onRepeat: function() {
            // Reset opacity for a smooth entry on each loop
            gsap.set(".fish-silhouette", { opacity: 0 });
          }
        }
      );

      // 3. Subtle Progress Bar Fill
      gsap.fromTo(".progress-fill", 
        { scaleX: 0 }, 
        { 
          scaleX: 1, 
          duration: 4, 
          repeat: -1, 
          ease: "none", 
          transformOrigin: "left" 
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 font-sans">
      <div 
        ref={containerRef} 
        className={`flex flex-col items-center gap-10 w-full max-w-md transition-opacity duration-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Animated Visual Area */}
        <div className="relative w-full h-32 overflow-hidden border-b border-zinc-900/50">
          {/* Fish Icon */}
          <div className="fish-silhouette absolute top-1/2 -translate-y-1/2 z-20">
            <svg width="40" height="25" viewBox="0 0 40 25" fill="none">
              <path 
                d="M2 12.5C2 12.5 10 2 20 2C30 2 38 12.5 38 12.5C38 12.5 30 23 20 23C10 23 2 12.5 2 12.5Z" 
                fill="white" 
                className="opacity-90"
              />
              <circle cx="30" cy="12.5" r="2.5" fill="#dc2626" />
              {/* Subtle back fin */}
              <path d="M2 12.5L-5 5V20L2 12.5Z" fill="white" className="opacity-40" />
            </svg>
          </div>

          {/* Wave Path */}
          <svg className="w-full h-full opacity-30" preserveAspectRatio="none">
            <path 
              className="wave-line" 
              d="M0 25 Q25 40 50 25 T100 25" 
              fill="none" 
              stroke="#dc2626" 
              strokeWidth="1.5" 
            />
          </svg>
        </div>

        {/* Brand & Progress Section */}
        <div className="text-center space-y-6">
          <div className="space-y-1">
            <h1 className="text-white font-extralight text-3xl tracking-[0.3em] uppercase italic">
              AQUA <span className="font-black text-red-600">STORE</span>
            </h1>
            <p className="text-zinc-500 font-mono text-[9px] tracking-[0.5em] uppercase">
              Loading Fresh Aquatic Life...
            </p>
          </div>

          {/* Luxury Progress Bar */}
          <div className="relative w-64 h-[2px] bg-zinc-900 mx-auto overflow-hidden rounded-full">
            <div className="progress-fill absolute inset-0 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
          </div>
        </div>

        {/* Design Accents */}
        <div className="flex gap-16 pt-8 opacity-20">
          <div className="w-8 h-[1px] bg-white" />
          <div className="w-1 h-1 bg-red-600 rounded-full" />
          <div className="w-8 h-[1px] bg-white" />
        </div>
      </div>
      
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default DeepSilhouettePreloader;