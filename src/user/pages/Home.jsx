import React, { useEffect, useRef, useState } from 'react';

const Home = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const offersRef = useRef(null);
  const categoriesRef = useRef(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initGSAP = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
        setGsapLoaded(true);
      } catch (err) {
        console.error("Failed to load GSAP", err);
      }
    };

    initGSAP();
  }, []);

  useEffect(() => {
    if (!gsapLoaded || !window.gsap) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // --- SECTION 1: HERO PARALLAX ---
      gsap.to(videoRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: "20%", 
        ease: "none"
      });

      gsap.from(".hero-content > *", {
        y: 60,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out"
      });

      // --- SECTION 2: FEATURED FISH PARALLAX ---
      const fishCards = gsap.utils.toArray('.fish-card');
      fishCards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=50",
            toggleActions: "play none none reverse"
          },
          y: 80 + (i % 3) * 20,
          opacity: 0,
          duration: 1,
          ease: "power2.out"
        });
      });

      // --- SECTION 3: OFFERS ---
      gsap.from(".offer-content", {
        scrollTrigger: {
          trigger: offersRef.current,
          start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 1.2
      });

      gsap.to(".offer-line", {
        scrollTrigger: {
          trigger: offersRef.current,
          start: "top 60%",
        },
        scaleX: 1,
        duration: 1.5,
        ease: "power4.inOut"
      });

      // --- SECTION 4: CATEGORIES ---
      gsap.from(".category-item", {
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "sine.out"
      });

    }, containerRef);

    return () => ctx.revert();
  }, [gsapLoaded]);

  const featuredFish = [
    { name: "Discus Blue Diamond", price: "$89", img: "🐟" },
    { name: "Red Dragon Betta", price: "$45", img: "🐠" },
    { name: "Neon Tetra Pack", price: "$12", img: "🐡" },
    { name: "Electric Blue Ram", price: "$35", img: "🐚" },
    { name: "Gold Dust Molly", price: "$15", img: "🦐" },
    { name: "Koi Angel Fish", price: "$55", img: "🎐" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
     

      <main ref={containerRef} className="bg-white text-black font-sans selection:bg-red-600 selection:text-white overflow-x-hidden flex-grow">
        
        {/* SECTION 1: HERO BANNER */}
        <section 
          ref={heroRef}
          className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden bg-black"
        >
          <div ref={videoRef} className="absolute inset-0 w-full h-[120%] -top-[10%] z-0">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover opacity-70"
            >
              <source src="https://v.ftcdn.net/02/33/27/15/700_F_233271505_vR8NnLq1WpYpMvU7B0i6Dk6pYVvVq1Vw_ST.mp4" type="video/mp4" />
              <source src="https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-fish-swimming-in-the-water-44026-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="hero-content relative z-10 text-white px-4 pt-20">
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-6">
              Premium <br /> Aqua Fish Store
            </h1>
            <p className="text-lg md:text-2xl font-light tracking-widest uppercase mb-10 opacity-90">
              Bring life into your aquarium
            </p>
            <button className="group relative px-10 py-4 md:px-12 md:py-5 bg-red-600 font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg">
              Explore Collection
            </button>
          </div>
        </section>

        {/* SECTION 2: FEATURED FISH */}
        <section 
          ref={featuredRef}
          className="relative z-20 py-24 md:py-32 px-6 md:px-20 bg-white"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-4">
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">Featured Fish</h2>
              <div className="h-1 w-24 bg-red-600 mb-2"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {featuredFish.map((fish, i) => (
                <div key={i} className="fish-card group relative bg-gray-50 p-8 pt-20 border border-gray-100 transition-all duration-500 hover:border-red-600/30 hover:shadow-xl">
                  <div className="absolute top-8 right-8 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                    Featured
                  </div>
                  <div className="text-8xl mb-8 flex justify-center group-hover:scale-110 transition-transform duration-500">
                    {fish.img}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-2">{fish.name}</h3>
                  <p className="text-red-600 font-black text-xl">{fish.price}</p>
                  <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">View Details</span>
                     <div className="w-8 h-px bg-red-600"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: OFFERS & DEALS */}
        <section 
          ref={offersRef}
          className="relative z-20 bg-black py-32 md:py-48 px-6 overflow-hidden"
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[25vw] font-black text-white/5 whitespace-nowrap select-none pointer-events-none">
            OFFERS
          </div>
          
          <div className="offer-content relative z-10 max-w-5xl mx-auto text-white">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
              Flat <span className="text-red-600">20% Off</span> <br /> on Exotic Fish
            </h2>
            <div className="offer-line h-1 w-full bg-red-600 scale-x-0 origin-left mb-12"></div>
            <p className="text-lg md:text-2xl font-light text-gray-300 uppercase tracking-widest mb-12">
              Limited Time Aquarium Deals
            </p>
            <button className="px-8 py-4 border-2 border-red-600 text-red-600 font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
              Claim Offer
            </button>
          </div>
        </section>

        {/* SECTION 4: CATEGORIES */}
        <section 
          ref={categoriesRef}
          className="relative z-20 py-24 md:py-32 px-6 md:px-20 bg-white"
        >
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-black uppercase mb-12 tracking-widest">Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Freshwater Fish', 'Saltwater Fish', 'Accessories', 'Fish Food'].map((cat, i) => (
                <div 
                  key={i} 
                  className="category-item group relative bg-gray-50 border border-gray-100 p-12 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden h-64 shadow-sm"
                >
                  <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                  <div className="relative z-10 transition-colors duration-500 group-hover:text-white">
                    <h4 className="text-lg font-bold uppercase tracking-widest">
                      {cat}
                    </h4>
                    <div className="w-10 h-px bg-red-600 mt-4 mx-auto group-hover:bg-white transition-colors"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER COMPONENT */}
   

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes subtle-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(220,38,38,0.2); }
          50% { box-shadow: 0 0 40px rgba(220,38,38,0.5); }
        }
        .animate-subtle-glow {
          animation: subtle-glow 3s ease-in-out infinite;
        }
        /* Ensure scrolling doesn't hide content */
        html {
          scroll-behavior: smooth;
        }
      `}} />
    </div>
  );
};

export default Home;