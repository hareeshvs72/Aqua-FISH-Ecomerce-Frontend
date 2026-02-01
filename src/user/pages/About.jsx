import React, { useEffect, useRef, useState } from 'react';
import { Fish, ShieldCheck, HeartPulse, Truck, ArrowRight, Droplets } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const About= () => {
  const mainRef = useRef(null);
  const underlineRef = useRef(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    const initGSAP = async () => {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
      setGsapLoaded(true);
    };

    initGSAP();
  }, []);

  useEffect(() => {
    if (!gsapLoaded) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".hero-text", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.2
      })
      .from(underlineRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        ease: "power2.inOut"
      }, "-=0.5");

      gsap.from(".mission-content", {
        scrollTrigger: {
          trigger: ".mission-section",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      });

      gsap.from(".mission-line", {
        scrollTrigger: {
          trigger: ".mission-section",
          start: "top 85%",
        },
        height: 0,
        duration: 1.5,
        ease: "power4.out"
      });

      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 90%",
          toggleActions: "play none none none"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all"
      });

      gsap.from(".process-step", {
        scrollTrigger: {
          trigger: ".process-section",
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
      });

      gsap.to(".cta-btn", {
        boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
        repeat: -1,
        yoyo: true,
        duration: 1.5
      });
    }, mainRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [gsapLoaded]);

  const features = [
    {
      title: "Hand-Selected Fish",
      desc: "Every specimen is individually inspected for health, color, and vitality by our expert biologists.",
      icon: <Fish className="w-6 h-6 text-red-600" />
    },
    {
      title: "Expert Knowledge",
      desc: "With over 20 years of experience, we provide scientific guidance for maintaining your aquatic ecosystem.",
      icon: <ShieldCheck className="w-6 h-6 text-red-600" />
    },
    {
      title: "Safe Delivery",
      desc: "Our proprietary oxygen-enriched packaging ensures your new arrivals arrive stress-free and healthy.",
      icon: <Truck className="w-6 h-6 text-red-600" />
    },
    {
      title: "Ethical Sourcing",
      desc: "We partner only with sustainable breeders and certified collectors to protect natural habitats.",
      icon: <HeartPulse className="w-6 h-6 text-red-600" />
    }
  ];

  const steps = [
    { id: "01", title: "Curation", desc: "Sourcing only the finest breeds." },
    { id: "02", title: "Monitoring", desc: "Strict quarantine and health checks." },
    { id: "03", title: "Packaging", desc: "Temperature-controlled secure boxing." },
    { id: "04", title: "Arrival", desc: "Direct to your aquarium doorstep." }
  ];

  return (
    <>
        <div ref={mainRef} className="bg-white text-black font-sans selection:bg-red-100 selection:text-red-600 min-h-screen">
          {!gsapLoaded && <div className="fixed inset-0 bg-white z-50" />}
          
          {/* SECTION 1: INTRO */}
          <section className="min-h-[85vh] flex flex-col justify-center px-6 md:px-24 pt-20">
            <div className="max-w-4xl">
              <h1 className="hero-text text-6xl md:text-9xl font-bold tracking-tighter mb-6">
                About <span className="text-red-600">Us</span>
              </h1>
              <div ref={underlineRef} className="h-2 w-32 bg-red-600 mb-8"></div>
              <p className="hero-text text-xl md:text-3xl font-light leading-relaxed text-gray-700 max-w-2xl">
                Passion for aquatic life, delivered with care. We believe an aquarium is more than a tank—it's a living piece of art.
              </p>
            </div>
          </section>
    
          {/* SECTION 2: MISSION */}
          <section className="mission-section py-32 px-6 md:px-24 border-y border-gray-100 bg-white">
            <div className="grid md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4 flex items-center gap-6">
                <div className="mission-line w-1.5 bg-red-600 h-32 origin-top"></div>
                <h2 className="text-4xl font-black uppercase tracking-widest">Our Mission</h2>
              </div>
              <div className="md:col-span-8 mission-content">
                <p className="text-lg md:text-3xl text-gray-800 leading-snug font-medium mb-10">
                  To elevate the standards of the aquatic industry through ethical sourcing, rigorous health protocols, and unparalleled customer education.
                </p>
                <div className="flex gap-16 flex-wrap">
                  <div>
                    <span className="block text-4xl font-bold text-black mb-1">100%</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Ethically Sourced</span>
                  </div>
                  <div>
                    <span className="block text-4xl font-bold text-black mb-1">24/7</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Care Support</span>
                  </div>
                  <div>
                    <span className="block text-4xl font-bold text-black mb-1">Elite</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Breed Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
    
          {/* SECTION 3: WHY CHOOSE US */}
          <section className="py-32 px-6 md:px-24 bg-gray-50">
            <div className="mb-20 text-center md:text-left">
              <h2 className="text-sm font-black text-red-600 uppercase tracking-[0.4em] mb-4">The Standard</h2>
              <h3 className="text-5xl md:text-6xl font-bold tracking-tight">Why Aquarists Trust Us</h3>
            </div>
            <div className="features-grid grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <div 
                  key={i} 
                  className="feature-card bg-white p-10 rounded-3xl border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-red-600 group cursor-default"
                >
                  <div className="mb-8 inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    {f.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-4 group-hover:text-red-600 transition-colors">{f.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
    
          {/* SECTION 4: PROCESS (The Journey) */}
          <section className="process-section py-32 px-6 md:px-24 bg-white overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
              <div className="max-w-xl">
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight">The Journey</h2>
                <p className="text-gray-500 mt-6 text-lg">Meticulous care from our facility to your sanctuary.</p>
              </div>
              <div className="hidden lg:block h-[2px] flex-grow bg-gray-100 mx-16 mb-6"></div>
            </div>
            <div className="grid md:grid-cols-4 gap-12 relative">
              {steps.map((step, i) => (
                <div key={i} className="process-step relative group cursor-pointer py-4">
                  <div className="relative overflow-visible">
                    <span className="text-8xl font-black text-gray-50 group-hover:text-red-50 transition-colors duration-500 select-none block leading-none">
                      {step.id}
                    </span>
                    <div className="pl-2 pt-2 transition-all duration-500 group-hover:translate-x-3">
                      <h4 className="text-2xl font-bold mb-3 flex items-center gap-3 group-hover:text-red-600 transition-colors">
                        <span className="w-2.5 h-2.5 bg-red-600 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out shrink-0"></span>
                        {step.title}
                      </h4>
                      <p className="text-gray-500 leading-relaxed text-sm md:text-base group-hover:text-gray-800 transition-colors max-w-[240px]">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
    
          {/* SECTION 5: CTA */}
          <section className="py-32 px-6 md:px-24 bg-white mb-20">
            <div className="bg-black text-white rounded-[3rem] p-12 md:p-32 text-center relative overflow-hidden">
              <div className="absolute top-[-10%] right-[-5%] p-8 opacity-10 rotate-12 pointer-events-none">
                <Droplets size={300} strokeWidth={1} />
              </div>
              <div className="absolute bottom-[-10%] left-[-5%] p-8 opacity-10 -rotate-12 pointer-events-none">
                <Fish size={300} strokeWidth={1} />
              </div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-7xl font-bold mb-10 leading-[1.1] tracking-tight">
                  Every fish deserves a <span className="text-red-600 italic">healthy</span> home.
                </h2>
                <button className="cta-btn bg-red-600 hover:bg-red-700 text-white px-12 py-6 rounded-full font-bold text-xl flex items-center gap-4 mx-auto transition-all transform hover:scale-105 active:scale-95">
                  Explore Collection <ArrowRight size={24} />
                </button>
              </div>
            </div>
          </section>
        </div>
      
    </>
   
  );
};

export default About;