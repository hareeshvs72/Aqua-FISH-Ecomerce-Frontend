import React from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancell() {
  const handleRetry = () => {
    console.log("Retrying payment...");
  };

 
 const navigate = useNavigate()
  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-slate-50 via-red-50/10 to-slate-100 flex items-center justify-center p-4 font-sans selection:bg-red-100 selection:text-red-900 relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
        
        {/* Subtle decorative floating red bubbles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-red-200/20 border border-red-300/10"
            style={{
              width: Math.random() * 30 + 15,
              height: Math.random() * 30 + 15,
              left: `${Math.random() * 90}%`,
              bottom: `${Math.random() * 20}%`,
            }}
            animate={{
              y: [0, -120],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Container Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white border border-slate-100 rounded-[24px] shadow-xl shadow-slate-200/60 p-8 md:p-10 relative z-10 text-center"
      >
        {/* Logo / Brand Header */}
        <div className="flex justify-center items-center gap-2 mb-8">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white font-black text-xs shadow-sm shadow-red-500/20">
            A
          </div>
          <span className="font-bold tracking-tight text-slate-800 text-sm">
            AQUA<span className="text-red-600 font-light">STORE</span>
          </span>
        </div>

        {/* Cancel Icon */}
        <div className="relative flex justify-center mb-6">
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute w-20 h-20 rounded-full bg-red-600/10"
          />
          
          <motion.div 
            initial={{ scale: 0.7, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 15 }}
            className="relative w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-600/30 border-4 border-white"
          >
            <X className="w-9 h-9 stroke-[2.5]" />
          </motion.div>
        </div>

        {/* Content */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Payment Cancelled
        </h1>

        <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 max-w-sm mx-auto">
          Your payment was cancelled before completion. No amount has been charged to your account.
        </p>

        {/* Navigation Action Buttons */}
        <div className="space-y-3">
          {/* Primary: Retry Payment */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={()=>navigate('/cart')}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-red-600/20 transition-all duration-150"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Payment</span>
          </motion.button>

          {/* Secondary: Return to Store */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={()=>navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-150"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Store</span>
          </motion.button>
        </div>

        {/* Help Widget Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-1 text-xs text-slate-400">
          <HelpCircle className="w-4 h-4 text-red-500" />
          <span>Need help?</span>
          <a href="#support" className="text-red-600 hover:text-red-700 hover:underline font-semibold ml-1">
            Contact Customer Support
          </a>
        </div>

      </motion.div>
    </div>
  );
}