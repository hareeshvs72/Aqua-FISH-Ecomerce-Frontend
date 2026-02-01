import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Contact = () => {
  const containerRef = useRef(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

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
      // --- CONTACT PAGE INTRO ANIMATIONS ---
      gsap.from(".contact-title", {
        scrollTrigger: {
          trigger: ".contact-intro",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      });

      gsap.from(".contact-divider", {
        scrollTrigger: {
          trigger: ".contact-intro",
          start: "top 80%",
        },
        scaleX: 0,
        duration: 1.5,
        delay: 0.5,
        ease: "power4.inOut"
      });

      // --- FORM FIELD STAGGER ---
      gsap.from(".form-field", {
        scrollTrigger: {
          trigger: ".contact-form-container",
          start: "top 75%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
      });

      // --- INFO ICONS ANIMATION ---
      gsap.from(".info-item", {
        scrollTrigger: {
          trigger: ".contact-info-section",
          start: "top 85%",
        },
        x: -30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out"
      });
      
    }, containerRef);

    return () => ctx.revert();
  }, [gsapLoaded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("Sending...");
    setTimeout(() => {
      setFormStatus("Message Sent Successfully!");
      e.target.reset();
      setTimeout(() => setFormStatus(null), 5000);
    }, 1500);
  };

  return (
   <>
        <div className="flex flex-col min-h-screen bg-white selection:bg-red-600 selection:text-white">
          <main ref={containerRef} className="flex-grow">
            
            {/* VARIETY 1: PAGE INTRO */}
            <section className="contact-intro px-6 py-20 md:py-32 text-center max-w-4xl mx-auto">
              <h1 className="contact-title text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 text-black">
                Contact Us
              </h1>
              <div className="contact-divider h-1 w-24 bg-red-600 mx-auto mb-8 origin-center"></div>
              <p className="text-gray-500 uppercase tracking-[0.3em] text-sm md:text-base font-light">
                We’d love to help you with your aquarium needs.
              </p>
            </section>
    
            {/* FORM & INFO GRID */}
            <section className="px-6 pb-32">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                
                {/* MINIMAL CONTACT INFO */}
                <div className="lg:col-span-4 contact-info-section space-y-16 py-10">
                  <div className="info-item flex items-start space-x-6">
                    <div className="w-2 h-2 bg-red-600 mt-2.5 shrink-0"></div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-2">Email Support</h4>
                      <p className="text-2xl font-bold text-black tracking-tight">hello@aquafish.com</p>
                    </div>
                  </div>
    
                  <div className="info-item flex items-start space-x-6">
                    <div className="w-2 h-2 bg-red-600 mt-2.5 shrink-0"></div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-2">Direct Line</h4>
                      <p className="text-2xl font-bold text-black tracking-tight">+1 (888) 234-5678</p>
                    </div>
                  </div>
    
                  <div className="info-item flex items-start space-x-6">
                    <div className="w-2 h-2 bg-red-600 mt-2.5 shrink-0"></div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-2">Our Gallery</h4>
                      <p className="text-xl font-medium text-gray-500 leading-relaxed tracking-tight">
                        124 Marine Dr, Blue Coast<br />California, 90210
                      </p>
                    </div>
                  </div>
    
                  {/* QUICK CONNECT (Socials) */}
                  <div className="info-item pt-10 border-t border-gray-100 flex space-x-8">
                    {['IG', 'TW', 'FB'].map(s => (
                      <span key={s} className="text-xs font-black uppercase tracking-widest text-black hover:text-red-600 cursor-pointer transition-colors">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
    
                {/* MAIN CONTACT FORM */}
                <div className="lg:col-span-8 contact-form-container bg-white border border-gray-100 p-8 md:p-16 shadow-2xl shadow-gray-200/50">
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="form-field group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block text-gray-400 group-focus-within:text-black transition-colors">Name</label>
                        <input required type="text" placeholder="John Doe" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-red-600 transition-all font-medium text-lg placeholder:text-gray-200" />
                      </div>
                      <div className="form-field group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block text-gray-400 group-focus-within:text-black transition-colors">Email</label>
                        <input required type="email" placeholder="john@example.com" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-red-600 transition-all font-medium text-lg placeholder:text-gray-200" />
                      </div>
                    </div>
                    
                    <div className="form-field group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block text-gray-400 group-focus-within:text-black transition-colors">Subject</label>
                      <input required type="text" placeholder="Inquiry about Discus" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-red-600 transition-all font-medium text-lg placeholder:text-gray-200" />
                    </div>
    
                    <div className="form-field group">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 block text-gray-400 group-focus-within:text-black transition-colors">Message</label>
                      <textarea rows="4" required placeholder="Tell us more..." className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-red-600 transition-all font-medium text-lg placeholder:text-gray-200 resize-none"></textarea>
                    </div>
    
                    <div className="form-field pt-6">
                      <button type="submit" className="group relative w-full md:w-auto px-16 py-5 bg-red-600 text-white font-black uppercase tracking-widest overflow-hidden transition-all hover:bg-black active:scale-95 shadow-xl shadow-red-600/20 hover:shadow-black/20">
                        <span className="relative z-10">Send Message</span>
                      </button>
                      
                      {formStatus && (
                        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-red-600 animate-pulse">
                          {formStatus}
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </main>
    
          <style dangerouslySetInnerHTML={{ __html: `
            input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px white inset; }
            html { scroll-behavior: smooth; }
          `}} />
        </div>
   </>
  );
};

export default Contact;