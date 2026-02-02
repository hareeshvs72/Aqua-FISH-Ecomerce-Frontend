import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, CheckCircle2, AlertCircle, Waves, Fish, ShieldCheck, Anchor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [gsapLoaded, setGsapLoaded] = useState(false);

  const cardRef = useRef(null);
  const bgRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate()

  // Load GSAP
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => setGsapLoaded(true);
    document.head.appendChild(script);
  }, []);

    useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  // GSAP Animations
  useEffect(() => {
    if (!gsapLoaded || !window.gsap) return;
    const gsap = window.gsap;

    // Entrance sequence
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    
    tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 })
      .fromTo(cardRef.current, 
        { opacity: 0, y: 50, scale: 0.98 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1.2 }, 
        "-=1"
      )
      .fromTo(".stagger-field", 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8 }, 
        "-=0.5"
      );

    // Continuous aquatic drift
    gsap.to(".floating-glow", {
      y: "random(-40, 40)",
      x: "random(-40, 40)",
      duration: "random(6, 12)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, [gsapLoaded]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const triggerError = () => {
    setStatus('error');
    if (window.gsap) {
      window.gsap.to(cardRef.current, { 
        x: [-10, 10, -7, 7, 0], 
        duration: 0.4, 
        ease: "power2.inOut" 
      });
    }
    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || formData.password !== formData.confirmPassword) {
      triggerError();
      return;
    }
    
    setStatus('loading');
    // Simulate success
    setTimeout(() => {
      setStatus('success');
      if (window.gsap) {
        window.gsap.fromTo(".success-icon", { scale: 0 }, { scale: 1, ease: "back.out(1.7)", duration: 0.5 });
      }
    }, 1500);
  };

  return (
    <div ref={bgRef} className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black text-white font-sans p-4">
      
      {/* Background Layer: Deep Abyss */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className="floating-glow absolute rounded-full blur-[100px] bg-red-900/5 opacity-40"
            style={{
              width: `${400 + i * 100}px`,
              height: `${400 + i * 100}px`,
              left: `${(i * 25) % 100}%`,
              top: `${(i * 40) % 100}%`,
            }}
          />
        ))}
        {/* Particle Bubbles */}
        <svg className="absolute w-full h-full opacity-20">
          {[...Array(15)].map((_, i) => (
            <circle key={i} cx={`${Math.random() * 100}%`} cy={`${Math.random() * 100}%`} r={Math.random() * 2 + 0.5} fill="white">
              <animate attributeName="cy" from="110%" to="-10%" dur={`${15 + Math.random() * 10}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.4;0" dur={`${15 + Math.random() * 10}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>

      {/* Main Glassmorphism Card */}
      <div 
        ref={cardRef}
        className="relative z-10 w-full max-w-[480px] max-h-[92vh] overflow-y-auto custom-scrollbar p-6 sm:p-10 md:p-12 rounded-[2.5rem] border bg-white/10 backdrop-blur-xl border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all"
      >
        {status === 'success' ? (
          <div className="py-20 flex flex-col items-center text-center">
            <CheckCircle2 className="success-icon text-red-600 mb-6" size={80} />
            <h2 className="text-3xl font-bold mb-4">Account Created</h2>
            <p className="text-white/60 mb-8">Welcome to the inner circle of the reef.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="px-8 py-3 bg-red-600 rounded-xl font-bold hover:bg-red-500 transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                <Fish size={30} className="text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-center text-white">Create Your Account</h1>
              <p className="text-white/50 text-sm font-light text-center tracking-wide">Join our aqua world today</p>
            </div>

            <form ref={formRef} className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              <div className="stagger-field space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Full Name</label>
                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl group transition-all">
                  <User className="ml-4 text-white/20 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input 
                    name="fullName"
                    type="text" 
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Deep Sea Explorer"
                    className="w-full bg-transparent py-3.5 px-3 outline-none text-sm placeholder:text-white/10 caret-red-600"
                  />
                </div>
              </div>

              <div className="stagger-field space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Email Address</label>
                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl group transition-all">
                  <Mail className="ml-4 text-white/20 group-focus-within:text-red-500 transition-colors" size={18} />
                  <input 
                    name="email"
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ocean@example.com"
                    className="w-full bg-transparent py-3.5 px-3 outline-none text-sm placeholder:text-white/10 caret-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="stagger-field space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Password</label>
                  <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl group transition-all">
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full bg-transparent py-3.5 px-4 outline-none text-sm placeholder:text-white/10 caret-red-600"
                    />
                  </div>
                </div>
                <div className="stagger-field space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-white/40 ml-1">Confirm</label>
                  <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl group transition-all">
                    <input 
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"} 
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full bg-transparent py-3.5 px-4 outline-none text-sm placeholder:text-white/10 caret-red-600"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="mr-3 text-white/20 hover:text-white">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="stagger-field pt-2">
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 text-white font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group tracking-widest bg-red-600 hover:bg-red-500 hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  onMouseEnter={(e) => window.gsap?.to(e.currentTarget, { scale: 1.02, duration: 0.3 })}
                  onMouseLeave={(e) => window.gsap?.to(e.currentTarget, { scale: 1, duration: 0.3 })}
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>SIGN UP</span>
                      <UserPlus size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="stagger-field mt-8 text-center">
              <button onClick={()=>navigate('/login')} className="text-[11px] sm:text-xs text-white/40 hover:text-white transition-all">
                Already have an account? <span className="text-red-500 font-black tracking-tighter ml-1 hover:underline">LOG IN</span>
              </button>
            </div>
          </>
        )}

        {/* Error Feedback Overlay */}
        {status === 'error' && (
          <div className="absolute top-4 left-0 right-0 flex justify-center px-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full text-[10px] font-black text-white shadow-lg">
              <AlertCircle size={14} />
              PLEASE CHECK ALL FIELDS
            </div>
          </div>
        )}
      </div>

     

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        input:focus { border-color: rgba(220, 38, 38, 0.5) !important; box-shadow: 0 0 10px rgba(220, 38, 38, 0.1); }
      `}} />
    </div>
  );
};

export default Login;