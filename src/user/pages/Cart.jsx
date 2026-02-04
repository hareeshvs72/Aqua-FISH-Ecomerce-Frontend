import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowRight,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cartItems, setCartItems] = useState([
    { 
      id: 1, 
      name: "Golden Guppy Fish", 
      category: "Freshwater Fish", 
      price: 299, 
      qty: 2, 
      img: "https://images.unsplash.com/photo-1524704659694-9f65b2a6020c?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 2, 
      name: "Blue Betta Fish", 
      category: "Exotic Fish", 
      price: 499, 
      qty: 1, 
      img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400" 
    },
    { 
      id: 3, 
      name: "Aquarium Water Filter", 
      category: "Accessories", 
      price: 1299, 
      qty: 1, 
      img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400" 
    }
  ]);
   
  const navigate =useNavigate()

  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0), [cartItems]);
  const shipping = subtotal > 2000 ? 0 : 150;
  const tax = 120;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    setIsLoaded(true);
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => {
      const gsap = window.gsap;
      gsap.from(".fade-in", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" });
      gsap.from(".line-anim", { width: 0, duration: 1, ease: "power4.inOut" });
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    if (window.gsap) {
      window.gsap.to(`#item-${id}`, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        onComplete: () => {
          setCartItems(prev => prev.filter(item => item.id !== id));
        }
      });
    } else {
      setCartItems(prev => prev.filter(item => item.id !== id));
    }
  };

  if (isLoaded && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-px h-24 bg-neutral-200 mb-8"></div>
        <h2 className="text-2xl font-light tracking-widest uppercase mb-4">Empty Cart</h2>
        <button className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 border-b border-red-600 pb-1 hover:text-black hover:border-black transition-all">
          Discover Collections
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white text-neutral-900 font-sans antialiased transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* HEADER */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-50 px-4 md:px-6 py-4 md:py-6 flex justify-between items-center">
        <button onClick={()=>navigate("/")} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors">
          <ArrowLeft size={14} /> Shop
        </button>
        <span className="text-xs font-black uppercase tracking-[0.5em]">Aqua<span className="text-red-600">Store</span></span>
        <div className="w-10"></div>
      </nav>

      <main className="max-w-[1200px] mx-auto pt-24 md:pt-32 pb-12 md:pb-24 px-4 md:px-6 lg:px-12">
        <div className="mb-10 md:mb-16">
          <h1 className="fade-in text-3xl md:text-5xl font-light tracking-tight mb-4 text-center md:text-left">Your Shopping Cart</h1>
          <div className="line-anim h-px bg-neutral-200 w-full"></div>
          <div className="flex flex-col md:flex-row justify-between mt-4 gap-2">
            <p className="fade-in text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-400 text-center md:text-left">{cartItems.length} Unique Selections</p>
            <p className="fade-in text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-400 italic text-center md:text-left">Premium Aquatic Supply</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 md:gap-20">
          
          {/* PRODUCT LIST */}
          <div className="lg:col-span-7 space-y-8 md:space-y-12">
            {cartItems.map((item) => (
              <div key={item.id} id={`item-${item.id}`} className="fade-in flex flex-col sm:flex-row gap-6 md:gap-8 pb-8 md:pb-12 border-b border-neutral-50 group relative">
                
                {/* Image Container */}
                <div className="w-full sm:w-32 md:w-44 h-48 md:h-56 bg-neutral-50 overflow-hidden relative grayscale-[0.3] sm:grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 rounded-sm">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
                </div>

                {/* Details Container */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-red-600 block mb-1">{item.category}</span>
                        <h3 className="text-lg md:text-xl font-medium tracking-tight text-neutral-800">{item.name}</h3>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-neutral-300 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <X size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Serial Code: AS-{item.id}09-26</p>
                  </div>

                  <div className="mt-6 md:mt-0 flex items-center sm:items-end justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-100 rounded-full px-2 py-1 bg-white">
                      <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black transition-colors"><Minus size={12} /></button>
                      <span className="w-8 text-center text-xs font-bold">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-red-600 transition-colors"><Plus size={12} /></button>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right">
                      <p className="text-[9px] md:text-xs text-neutral-400 mb-0 md:mb-1 uppercase tracking-widest">Subtotal</p>
                      <p className="text-lg md:text-xl font-light tracking-tighter">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY SIDEBAR */}
          <aside className="lg:col-span-5">
            <div className="fade-in bg-neutral-50 p-6 md:p-10 rounded-sm sticky top-28">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8 md:mb-10 text-neutral-400">Order Summary</h2>
              
              <div className="space-y-4 md:space-y-6 text-sm mb-10 md:mb-12">
                <div className="flex justify-between font-light">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="tabular-nums">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-light">
                  <span className="text-neutral-500">Logistics</span>
                  <span className={`tabular-nums ${shipping === 0 ? "text-red-600 font-medium" : ""}`}>
                    {shipping === 0 ? "Complimentary" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-light">
                  <span className="text-neutral-500">Service Tax</span>
                  <span className="tabular-nums">₹{tax}</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6 md:pt-8 mb-10 md:mb-12 flex justify-between items-baseline">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Estimate Total</span>
                <span className="text-3xl md:text-4xl font-light tracking-tighter text-red-600 tabular-nums">₹{total.toLocaleString()}</span>
              </div>

              <div className="space-y-4">
                <button className="w-full py-4 md:py-5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-600 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]">
                  Confirm & Checkout
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[8px] md:text-[9px] text-center text-neutral-400 uppercase tracking-widest mt-6 leading-relaxed">
                  Secure checkout powered by AquaStore Systems
                </p>
              </div>

              <div className="mt-10 md:mt-16 grid grid-cols-2 gap-4 md:gap-8 border-t border-neutral-100 pt-8">
                <div className="flex flex-col gap-2">
                  <ShieldCheck size={16} className="text-neutral-300" />
                  <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-neutral-400 leading-tight">Authenticity<br/>Guaranteed</span>
                </div>
                <div className="flex flex-col gap-2">
                  <Truck size={16} className="text-neutral-300" />
                  <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest text-neutral-400 leading-tight">Climate Controlled<br/>Transit</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Cart;