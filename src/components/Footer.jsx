import React, { useEffect, useRef, useState } from 'react';

// Dynamic GSAP Loader for environment stability
const loadGSAP = () => {
  return new Promise((resolve) => {
    if (window.gsap) {
      resolve(window.gsap);
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    const scrollScript = document.createElement('script');
    scrollScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";
    
    script.onload = () => {
      document.head.appendChild(scrollScript);
      scrollScript.onload = () => resolve(window.gsap);
    };
    document.head.appendChild(script);
  });
};

const Footer = () => {
  const footerRef = useRef(null);
  const ctaRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadGSAP().then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (!isReady || !window.gsap) return;

    const gsap = window.gsap;
    if (window.ScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    const ctx = gsap.context(() => {
      // 1. CTA Pulse Animation
      gsap.to(ctaRef.current, {
        scale: 1.05,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // 2. Entrance Stagger for Footer Sections
      gsap.fromTo(".footer-section", 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.15, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom-=100px",
          }
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, [isReady]);

  // Handler for link hover animation
  const onLinkEnter = (e) => {
    if (!window.gsap) return;
    window.gsap.to(e.currentTarget, { y: -4, color: "#dc2626", duration: 0.3 });
  };

  const onLinkLeave = (e) => {
    if (!window.gsap) return;
    window.gsap.to(e.currentTarget, { y: 0, color: "#a1a1aa", duration: 0.3 });
  };

  return (
    <footer 
      ref={footerRef} 
      className="bg-black text-white pt-24 pb-12 px-6 md:px-12 border-t border-zinc-900 overflow-hidden font-sans"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section: Branding & CTA */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 mb-20">
          <div className="footer-section text-center lg:text-left space-y-4">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
              Ready to <span className="text-red-600 underline decoration-1 underline-offset-8">Dive</span> In?
            </h2>
            <p className="text-zinc-500 text-sm tracking-widest uppercase font-medium">
              Start your premium aquatic journey today.
            </p>
          </div>
          
          <div className="footer-section">
            <button 
              ref={ctaRef}
              className="px-12 py-5 bg-red-600 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:bg-white hover:text-black transition-colors duration-300 active:scale-95"
            >
              Explore Rare Species
            </button>
          </div>
        </div>

        {/* Middle Section: Grid Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20 border-y border-zinc-900 py-16">
          <div className="footer-section space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Categories</h4>
            <nav className="flex flex-col gap-4">
              {['Freshwater', 'Marine Fish', 'Corals', 'Invertebrates'].map(item => (
                <a key={item} href="#" onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave} className="text-sm font-bold text-zinc-400 w-fit">
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-section space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Support</h4>
            <nav className="flex flex-col gap-4">
              {['Shipping Policy', 'Live Arrival Guarantee', 'Tank Cycling', 'Water Care'].map(item => (
                <a key={item} href="#" onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave} className="text-sm font-bold text-zinc-400 w-fit">
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-section space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Company</h4>
            <nav className="flex flex-col gap-4">
              {['About Aqua', 'Our Hatchery', 'Sustainability', 'Careers'].map(item => (
                <a key={item} href="#" onMouseEnter={onLinkEnter} onMouseLeave={onLinkLeave} className="text-sm font-bold text-zinc-400 w-fit">
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-section space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Newsletter</h4>
            <div className="space-y-4">
              <p className="text-xs text-zinc-500 font-light italic">Join 5,000+ hobbyists for stock alerts.</p>
              <div className="flex border-b border-zinc-800 pb-2 focus-within:border-red-600 transition-colors">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="bg-transparent text-[11px] w-full outline-none placeholder:text-zinc-800 uppercase tracking-widest"
                />
                <button className="text-[10px] font-black text-red-600 ml-2">GO</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-section flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <span className="text-red-600 font-black text-xs">A</span>
            </div>
            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.4em]">© 2026 Aqua Store Interactive</span>
          </div>
          
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <a key={item} href="#" className="text-[9px] font-black text-zinc-800 hover:text-white transition-colors uppercase tracking-widest">{item}</a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;