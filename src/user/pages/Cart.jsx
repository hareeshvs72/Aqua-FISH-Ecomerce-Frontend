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
import { useAuth } from '@clerk/clerk-react';
import { getCartAPI, removeFromCartAPI, updateCartQuantityAPI, createOrderAPI } from '../../Service/allApi';

const Cart = () => {
  const [isLoadedUI, setIsLoadedUI] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const navigate = useNavigate();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [phone, setPhone] = useState('');
  const [addressError, setAddressError] = useState('');

  const handleCheckoutSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode || !phone) {
      setAddressError("Please fill in all address and contact fields.");
      return;
    }

    setIsPlacingOrder(true);
    setAddressError('');
    try {
      const token = await getToken();
      if (!token) {
        setAddressError("Authentication failed. Please sign in again.");
        return;
      }

      const reqHeader = { Authorization: `Bearer ${token}` };
      const body = {
        items: cartItems.map(item => ({
          product: item.productId?._id || item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress
      };

      console.log("Placing order with body:", body);

      const res = await createOrderAPI(body, reqHeader);
      console.log("Order API response:", res);

      if (res.status === 201 && res.data.success) {
        if (res.data.url) {
          window.location.href = res.data.url;
        } else {
          setIsOrderSuccess(true);
          setPlacedOrderDetails(res.data.data);
          setCartItems([]);
          setIsCheckoutOpen(false);
        }
      } else {
        setAddressError(res.data?.message || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      setAddressError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const fetchCart = async () => {
    if (isLoaded && isSignedIn) {
      try {
        const token = await getToken();
        if (token) {
          const reqHeader = { Authorization: `Bearer ${token}` };
          const res = await getCartAPI(reqHeader);
          if (res.status === 200 && res.data.cart) {
            setCartItems(res.data.cart.items || []);
          }
        }
      } catch (error) {
        console.error("Error fetching cart API:", error);
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoaded, isSignedIn]);

  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cartItems]);
  const shipping = subtotal > 2000 ? 0 : 150;
  const tax = 120;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    setIsLoadedUI(true);
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

  const updateQty = async (productId, delta, currentQuantity) => {
    const newQty = Math.max(1, currentQuantity + delta);
    
    // Optimistic UI update
    setCartItems(prev => prev.map(item => {
      if (item.productId?._id === productId || item.productId === productId) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));

    try {
      const token = await getToken();
      if(token) {
        const reqHeader = { Authorization: `Bearer ${token}` };
        const body = { productId, quantity: newQty };
        await updateCartQuantityAPI(body, reqHeader);
      }
    } catch(err) {
      console.error(err);
      fetchCart(); // Revert on failure
    }
  };

  const removeItem = async (productId) => {
    if (window.gsap) {
      window.gsap.to(`#item-${productId}`, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        onComplete: async () => {
          setCartItems(prev => prev.filter(item => (item.productId?._id !== productId && item.productId !== productId)));
        }
      });
    } else {
      setCartItems(prev => prev.filter(item => (item.productId?._id !== productId && item.productId !== productId)));
    }

    try {
      const token = await getToken();
      if(token) {
        const reqHeader = { Authorization: `Bearer ${token}` };
        const body = { productId };
        await removeFromCartAPI(body, reqHeader);
      }
    } catch(err) {
      console.error(err);
      fetchCart(); // Revert on failure
    }
  };

  if (isOrderSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <style>{`
          @keyframes lineReveal {
            from { height: 0; }
            to { height: 96px; }
          }
          .animate-line {
            animation: lineReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
        <div className="w-px bg-red-600 mb-8 animate-line"></div>
        <h2 className="text-3xl font-light tracking-widest uppercase mb-4 text-neutral-900">Order Secured</h2>
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Thank you for your acquisition.</p>
        {placedOrderDetails && (
          <p className="text-[10px] uppercase tracking-widest text-red-600 font-mono mb-8">
            Reference ID: {placedOrderDetails._id}
          </p>
        )}
        <div className="max-w-md w-full bg-neutral-50 p-6 rounded-sm border border-neutral-100 text-left mb-8">
          <h4 className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-4 border-b border-neutral-200 pb-2">Delivery Manifest</h4>
          <p className="text-xs font-light text-neutral-600 mb-2"><strong className="font-medium text-neutral-800">Destination:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
          <p className="text-xs font-light text-neutral-600 mb-2"><strong className="font-medium text-neutral-800">Transit:</strong> Climate Controlled Courier</p>
          <p className="text-xs font-light text-neutral-600"><strong className="font-medium text-neutral-800">Est. Arrival:</strong> 3-5 Business Days</p>
        </div>
        <button onClick={() => navigate('/fish')} className="px-8 py-3 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-600 transition-all shadow-md">
          Explore Collections
        </button>
      </div>
    );
  }

  if (isLoadedUI && !isSignedIn) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-px h-24 bg-neutral-200 mb-8"></div>
        <h2 className="text-2xl font-light tracking-widest uppercase mb-4">Account Required</h2>
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-8">Please sign in to access your curated cart.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all">
          Secure Login
        </button>
      </div>
    );
  }

  if (isLoadedUI && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-px h-24 bg-neutral-200 mb-8"></div>
        <h2 className="text-2xl font-light tracking-widest uppercase mb-4">Empty Bag</h2>
        <button onClick={() => navigate('/fish')} className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 border-b border-red-600 pb-1 hover:text-black hover:border-black transition-all">
          Discover Collections
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white text-neutral-900 font-sans antialiased transition-opacity duration-1000 ${isLoadedUI ? 'opacity-100' : 'opacity-0'}`}>
      
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
            {cartItems.map((item) => {
              const prodId = item.productId?._id || item.productId;
              return (
              <div key={prodId} id={`item-${prodId}`} className="fade-in flex flex-col sm:flex-row gap-6 md:gap-8 pb-8 md:pb-12 border-b border-neutral-50 group relative">
                
                {/* Image Container */}
                <div className="w-full sm:w-32 md:w-44 h-48 md:h-56 bg-neutral-50 overflow-hidden relative grayscale-[0.3] sm:grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 rounded-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
                </div>

                {/* Details Container */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        {/* <span className="text-[9px] font-bold uppercase tracking-widest text-red-600 block mb-1">{item.category}</span> */}
                        <h3 className="text-lg md:text-xl font-medium tracking-tight text-neutral-800">{item.name}</h3>
                      </div>
                      <button 
                        onClick={() => removeItem(prodId)}
                        className="p-2 text-neutral-300 hover:text-red-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <X size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Serial Code: AS-{prodId?.toString().slice(-4)}-26</p>
                  </div>

                  <div className="mt-6 md:mt-0 flex items-center sm:items-end justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-neutral-100 rounded-full px-2 py-1 bg-white">
                      <button onClick={() => updateQty(prodId, -1, item.quantity)} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black transition-colors"><Minus size={12} /></button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => updateQty(prodId, 1, item.quantity)} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-red-600 transition-colors"><Plus size={12} /></button>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right">
                      <p className="text-[9px] md:text-xs text-neutral-400 mb-0 md:mb-1 uppercase tracking-widest">Subtotal</p>
                      <p className="text-lg md:text-xl font-light tracking-tighter">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )})}
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
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 md:py-5 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-600 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                >
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

      {/* CHECKOUT SIDEBAR OVERLAY */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs transition-opacity duration-300">
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            .animate-slide-in {
              animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => setIsCheckoutOpen(false)}></div>
          
          {/* Sidebar Panel */}
          <div className="relative w-full max-w-md bg-white h-screen shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto border-l border-neutral-100 animate-slide-in">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-neutral-800">Checkout Info</h3>
                <button 
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-2 text-neutral-400 hover:text-black transition-colors"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {addressError && (
                <div className="mb-6 p-4 bg-red-50 border-l border-red-500 text-red-600 text-xs font-light">
                  {addressError}
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Shipping Address</label>
                  <textarea
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    placeholder="Street Address, Apartment, Suite"
                    className="w-full p-3 border border-neutral-200 focus:border-red-600 focus:outline-none text-xs font-light rounded-sm bg-neutral-50"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      placeholder="City"
                      className="w-full p-3 border border-neutral-200 focus:border-red-600 focus:outline-none text-xs font-light rounded-sm bg-neutral-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-2">State</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      placeholder="State"
                      className="w-full p-3 border border-neutral-200 focus:border-red-600 focus:outline-none text-xs font-light rounded-sm bg-neutral-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Pincode</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                      placeholder="Pincode"
                      className="w-full p-3 border border-neutral-200 focus:border-red-600 focus:outline-none text-xs font-light rounded-sm bg-neutral-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Country</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                      placeholder="Country"
                      className="w-full p-3 border border-neutral-200 focus:border-red-600 focus:outline-none text-xs font-light rounded-sm bg-neutral-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    className="w-full p-3 border border-neutral-200 focus:border-red-600 focus:outline-none text-xs font-light rounded-sm bg-neutral-50"
                  />
                </div>
              </form>
            </div>

            <div className="mt-8 border-t border-neutral-100 pt-6">
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">Order Total</span>
                <span className="text-2xl font-light tracking-tighter text-red-600">₹{total.toLocaleString()}</span>
              </div>
              <button 
                onClick={handleCheckoutSubmit}
                disabled={isPlacingOrder}
                className="w-full py-4 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {isPlacingOrder ? "Processing Order..." : "Place Order"}
                {!isPlacingOrder && <ArrowRight size={14} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;