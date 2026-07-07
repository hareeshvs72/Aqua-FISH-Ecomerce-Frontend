import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SparkleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BoxIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="22.08" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="12 19 5 12 12 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PaymentSuccess() {
  const [confettiParticles, setConfettiParticles] = useState([]);
  const [animateCheck, setAnimateCheck] = useState(false);
 const navigate = useNavigate()
  useEffect(() => {
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];
    const particles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage from left
      y: -10 - Math.random() * 20, // percentage from top (start offscreen)
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.8,
      duration: Math.random() * 2.5 + 2,
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'rect'
    }));
    setConfettiParticles(particles);

    // Trigger checkmark path drawing animation delay
    const timer = setTimeout(() => {
      setAnimateCheck(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      
      {/* Decorative subtle abstract backgrounds */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gray-100 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-blue-50 opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-red-50 opacity-40 blur-3xl pointer-events-none" />

      {/* Confetti Animation Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {confettiParticles.map((p) => (
          <div
            key={p.id}
            className="absolute transition-all"
            style={{
              left: `${p.x}%`,
              top: `${p.y}vh`,
              width: `${p.size}px`,
              height: p.shape === 'rect' ? `${p.size * 0.6}px` : `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? '50%' : '2px',
              transform: `rotate(${p.rotation}deg)`,
              opacity: 0.85,
              animation: `fall ${p.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>

      {/* Custom Keyframe Styles */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes scaleIn {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes slideUp {
          0% {
            transform: translateY(15px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Center Card layout */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 z-10">
        <div 
          className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full p-8 sm:p-12 text-center animate-scale-in relative overflow-hidden"
          style={{ boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)' }}
        >
          {/* Premium Diagonal Stripe Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-gray-900 via-red-600 to-gray-900" />

          {/* Animated Green Circle & Success Checkmark */}
          <div className="relative mx-auto w-24 h-24 mb-8 flex items-center justify-center">
            {/* Pulsing ring outer glow */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 scale-125 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-emerald-500/10 scale-110" />
            
            {/* Main Circle background */}
            <div className="relative w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg 
                className="w-10 h-10 text-white" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3"
              >
                <path 
                  d="M5 13l4 4L19 7" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 50,
                    strokeDashoffset: animateCheck ? 0 : 50,
                    transition: 'stroke-dashoffset 0.6s ease-out'
                  }}
                />
              </svg>
            </div>
            
            {/* Tiny accent sparklers */}
            <SparkleIcon className="absolute -top-1 -right-1 w-6 h-6 text-amber-500 opacity-75 animate-bounce" style={{ animationDuration: '3s' }} />
            <SparkleIcon className="absolute -bottom-1 -left-1 w-5 h-5 text-blue-500 opacity-75 animate-bounce" style={{ animationDuration: '4s' }} />
          </div>

          {/* Header Typography */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Payment Successful!
            </h1>
            <p className="mt-4 text-base text-gray-500 leading-relaxed max-w-sm mx-auto">
              Thank you for shopping with <span className="font-semibold text-gray-900">Aqua Store</span>. Your order has been placed successfully.
            </p>
          </div>

          {/* Minimal Navigation Buttons */}
          <div className="mt-10 flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={()=>navigate("/orders")}  className="w-full py-4 px-6 bg-gray-950 hover:bg-gray-900 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-gray-950/10 focus:ring-2 focus:ring-gray-950/20">
              <BoxIcon className="w-5 h-5" />
              <span>Track Your Order</span>
            </button>
            <button onClick={()=>navigate("/")} className="w-full py-4 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 focus:ring-2 focus:ring-gray-100">
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
          </div>

          {/* Secure transaction badge */}
          <p className="mt-8 text-xs text-gray-400 flex items-center justify-center space-x-1.5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span>Secured with 256-bit SSL encryption.</span>
          </p>

        </div>
      </main>

      {/* Modern Compact Minimalist Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400 z-10">
        <div>
          <span>© 2026 Aqua Store Inc. All rights reserved.</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Contact Support</a>
        </div>
      </footer>

    </div>
  );
}