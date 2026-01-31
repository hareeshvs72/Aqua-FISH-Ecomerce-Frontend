import React, { useEffect, useRef, useState } from "react";

/**
 * Pnf Component - Hooked Variant
 * Fully responsive + ZERO scrollbar
 * Theme, design & GSAP logic unchanged
 */

const loadGSAP = () => {
  return new Promise((resolve) => {
    if (window.gsap) {
      resolve(window.gsap);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => resolve(window.gsap);
    document.head.appendChild(script);
  });
};

const Pnf = () => {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadGSAP().then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (!isReady || !window.gsap) return;

    const gsap = window.gsap;
    const ctx = gsap.context(() => {
      // Hook bobbing
      gsap.to(".hook-line", {
        height: 140,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Content reveal
      gsap.from(".reveal-item", {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Background dust
      gsap.to(".bg-dust", {
        y: "random(-40, 40)",
        opacity: "random(0.1, 0.3)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    /* HARD VIEWPORT CLIP – prevents any scroll */
    <div className="fixed inset-0 overflow-hidden bg-white">
      <div
        ref={containerRef}
        className="w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 relative font-sans select-none"
      >
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-dust absolute w-1 h-1 bg-zinc-400 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center w-full max-w-md relative z-10">
          {/* Hook */}
          <div className="flex flex-col items-center mb-10 sm:mb-12">
            <div className="hook-line w-[1.5px] bg-zinc-200 h-[60px] sm:h-[80px]" />
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 
              border-b-[3px] border-l-[3px] 
              border-red-600 rounded-bl-[2.5rem] 
              -mt-[1px] relative"
            >
              <div
                className="absolute right-0 bottom-3 sm:bottom-4 
                w-2 h-[3px] bg-red-600 rotate-[45deg] rounded-full"
              />
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-10">
            <h1 className="reveal-item text-5xl sm:text-7xl font-black text-black tracking-tighter uppercase leading-none">
              HOOKED
            </h1>

            <h2 className="reveal-item text-red-600 font-bold tracking-[0.25em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] uppercase">
              Error 404 / Tank Empty
            </h2>

            <p className="reveal-item text-zinc-400 text-xs sm:text-sm max-w-[220px] sm:max-w-[240px] mx-auto font-medium">
              You've cast your line into a page that doesn't exist anymore.
            </p>
          </div>

          {/* Button */}
          <div className="reveal-item">
            <a
              href="/"
              className="group relative px-8 sm:px-10 py-3 sm:py-4 
              bg-black text-white rounded-full 
              text-[9px] sm:text-[10px] font-black 
              uppercase tracking-[0.18em] sm:tracking-[0.2em] 
              overflow-hidden block shadow-2xl 
              active:scale-95 transition-transform"
            >
              <span className="relative z-10">Swim Back Home</span>
              <div
                className="absolute inset-0 bg-red-600 
                translate-y-full group-hover:translate-y-0 
                transition-transform duration-500 
                ease-[cubic-bezier(0.87,0,0.13,1)]"
              />
            </a>
          </div>

          {/* Footer */}
          <div className="reveal-item mt-12 sm:mt-16 flex items-center gap-3 sm:gap-4 opacity-10">
            <div className="w-5 sm:w-6 h-[1px] bg-black" />
            <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-[0.6em] sm:tracking-[0.8em]">
              Aqua Protocol
            </span>
            <div className="w-5 sm:w-6 h-[1px] bg-black" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pnf;
