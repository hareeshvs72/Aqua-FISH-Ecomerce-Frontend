import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn, Fish, Waves, AlertCircle, ShieldCheck, Anchor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const navigate = useNavigate()

  const cardRef = useRef(null);
  const bgRef = useRef(null);

  // Load GSAP
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => setGsapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Entrance & Continuous Animations
  useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "";
  };
}, []);

  useEffect(() => {
    if (!gsapLoaded || !window.gsap) return;
    const gsap = window.gsap;

    const tl = gsap.timeline();
    tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 })
      .fromTo(cardRef.current, { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power4.out" }, "-=0.8");

    // Continuous floating blobs for depth
    gsap.to(".floating-blob", {
      y: "random(-50, 50)",
      x: "random(-50, 50)",
      duration: "random(5, 10)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, [gsapLoaded]);

  const triggerError = () => {
    setError(true);
    if (window.gsap) {
      window.gsap.to(cardRef.current, { x: [-12, 12, -8, 8, 0], duration: 0.45, ease: "power2.inOut" });
    }
    setTimeout(() => setError(false), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) triggerError();
  };

  return (
    <div ref={bgRef} className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black text-white font-sans p-4 sm:p-6 lg:p-8">
      
      {/* Abyssal Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-black pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="floating-blob absolute rounded-full blur-[60px] sm:blur-[100px] bg-blue-900/10"
            style={{
              width: `${200 + i * 50}px`,
              height: `${200 + i * 50}px`,
              left: `${(i * 20) % 100}%`,
              top: `${(i * 30) % 100}%`,
            }}
          />
        ))}
        {/* Animated Bubbles */}
        <svg className="absolute w-full h-full opacity-15">
          {[...Array(20)].map((_, i) => (
            <circle key={i} cx={`${Math.random() * 100}%`} cy={`${Math.random() * 100}%`} r={Math.random() * 2 + 0.5} fill="white">
              <animate attributeName="cy" from="110%" to="-10%" dur={`${12 + Math.random() * 10}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.5;0" dur={`${12 + Math.random() * 10}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>

      {/* Main Login Card - Added max-h and overflow-y-auto to prevent Y-axis overflow */}
      <div 
        ref={cardRef}
        className="relative z-10 w-full max-w-[420px] max-h-[90vh] overflow-y-hidden custom-scrollbar p-6 sm:p-10 md:p-14 rounded-[2rem] sm:rounded-[2.5rem] border bg-white/5 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] transition-all"
      >
        <div className="w-full">
          <div className="flex flex-col items-center mb-6 sm:mb-10">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-3 sm:mb-5 bg-red-600 shadow-red-600/20">
              <Fish size={20} className="text-white sm:w-7 sm:h-7" />
            </div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2 text-center">Welcome Back</h1>
            <p className="text-white/40 text-[10px] sm:text-sm font-light text-center tracking-wide px-2">Login to your deep sea world</p>
          </div>

          <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-[9px] sm:text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Identity</label>
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl group transition-all">
                <Mail className="ml-4 text-white/20 group-focus-within:text-red-500 transition-colors" size={16} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Explorer Email"
                  className="w-full bg-transparent py-3 sm:py-4 px-3 outline-none text-sm placeholder:text-white/10 caret-red-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] sm:text-[10px] uppercase tracking-widest font-black text-white/30 ml-1">Access Code</label>
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl group transition-all">
                <Lock className="ml-4 text-white/20 group-focus-within:text-red-500 transition-colors" size={16} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Secret Code"
                  className="w-full bg-transparent py-3 sm:py-4 px-3 outline-none text-sm placeholder:text-white/10 caret-red-500"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="mr-4 text-white/20 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-1">
              <button type="button" className="text-[10px] sm:text-xs text-white/30 hover:text-red-500 transition-colors order-2 sm:order-1">Recover Keys?</button>
              <label className="flex items-center gap-2 cursor-pointer group order-1 sm:order-2">
                <input type="checkbox" className="hidden peer" />
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border border-white/20 peer-checked:bg-red-600 peer-checked:border-red-600 flex items-center justify-center transition-all">
                  <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100" />
                </div>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-white/30 tracking-wider">Secure Link</span>
              </label>
            </div>

            <button 
              type="submit"
              className="w-full py-3 sm:py-4 text-white font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group tracking-widest bg-red-600 hover:bg-red-500 shadow-red-600/20 text-xs sm:text-sm"
              onMouseEnter={(e) => window.gsap?.to(e.currentTarget, { scale: 1.02, duration: 0.3 })}
              onMouseLeave={(e) => window.gsap?.to(e.currentTarget, { scale: 1, duration: 0.3 })}
            >
              <span>ACCESS WORLD</span>
              <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 sm:mt-10 text-center">
            <button onClick={()=>navigate('/signup')} className="text-[10px] sm:text-xs text-white/30 hover:text-white transition-all">
              New explorer? <span className="text-red-500 font-black tracking-tighter ml-1">START EXPEDITION</span>
            </button>
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="absolute -bottom-16 left-0 right-0 flex justify-center px-4">
            <div className="flex items-center gap-2 bg-red-600/20 border border-red-600/40 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[9px] sm:text-[10px] font-black text-red-200 tracking-[0.1em] shadow-lg">
              <AlertCircle size={14} />
              IDENTIFICATION FAILED.
            </div>
          </div>
        )}
      </div>

   

      {/* Custom Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
};

export default Login;