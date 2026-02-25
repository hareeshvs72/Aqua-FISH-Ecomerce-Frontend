import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Activity,
  Check,
  ChevronRight,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSingleProductAPI } from '../../Service/allApi';

const ProductView = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [product ,setProduct] = useState({})
   const {id} = useParams()
  const navigate =  useNavigate()

  // Main Product Data
  // const product = {
  //   name: "Golden Guppy Fish",
  //   scientificName: "Poecilia reticulata",
  //   category: "Freshwater Exotic",
  //   price: 299,
  //   description: "A vibrant and hardy addition to any community tank. These Golden Guppies exhibit a brilliant metallic sheen and active swimming patterns, perfect for both beginners and enthusiasts.",
  //   details: [
  //     { label: "Fish Type", value: "Freshwater" },
  //     { label: "Size", value: "1.5 - 2.0 Inches" },
  //     { label: "Care Level", value: "Beginner Friendly" },
  //     { label: "Min. Tank Size", value: "10 Gallons" }
  //   ],
  //   images: [
  //     "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=800",
  //     "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&q=80&w=800",
  //     "https://images.unsplash.com/photo-1524704659694-9f65b2a6020c?auto=format&fit=crop&q=80&w=800"
  //   ]
  // };

  // Related Products Data
  const relatedProducts = [
    {
      id: 1,
      name: "Neon Tetra",
      category: "Schooling Fish",
      price: 150,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      name: "Blue Betta Splendens",
      category: "Exotic Solo",
      price: 450,
      image: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 3,
      name: "Cherry Shrimp",
      category: "Invertebrates",
      price: 80,
      image: "https://images.unsplash.com/photo-1610473068502-0e4f21469e3a?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 4,
      name: "Dwarf Gourami",
      category: "Centerpiece Fish",
      price: 350,
      image: "https://images.unsplash.com/photo-1524704659694-9f65b2a6020c?auto=format&fit=crop&q=80&w=400"
    }
  ];
 
useEffect(()=>{
  handilSinglePRoducts()
},[])
  // get a single view of products 

  const handilSinglePRoducts = async ()=>{
    try {
      const result = await getSingleProductAPI(id)
      console.log(result.data.data);
      setProduct(result.data.data)
      
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(() => {
    setIsLoaded(true);
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => {
      const gsap = window.gsap;
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      
      tl.from(".back-btn-reveal", { x: -20, opacity: 0, duration: 0.8 })
        .from(".img-reveal", { scale: 1.05, opacity: 0, duration: 1.2 }, "-=0.4")
        .from(".text-reveal", { y: 20, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.6")
        .from(".detail-row", { x: -15, opacity: 0, stagger: 0.1, duration: 0.6 }, "-=0.4")
        .from(".related-reveal", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.2");
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  useEffect(() => {
    if (window.gsap) {
      window.gsap.fromTo(".main-product-img", 
        { opacity: 0, x: 10 }, 
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [activeImg]);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={`min-h-screen bg-white text-neutral-900 font-sans antialiased transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      <main className="max-w-[1440px] mx-auto py-8 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-12 relative">
        {/* Back Button */}
        <div className="back-btn-reveal mb-8 md:mb-12">
          <button onClick={()=>navigate('/fish')} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Shop
          </button>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 mb-20 md:mb-32">
          
          {/* SECTION 1: PRODUCT DISPLAY (LEFT) */}
          <div className="space-y-4 md:space-y-6">
            <div className="img-reveal bg-neutral-50 rounded-sm overflow-hidden aspect-square flex items-center justify-center relative group border border-neutral-100">
              <img 
                src={product?.images} 
                alt={product?.name} 
                className="main-product-img w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white px-3 py-1.5 md:px-4 md:py-2 text-[8px] md:text-[9px] font-bold uppercase tracking-widest shadow-sm">
                Certified Species
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product?.images?.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 border rounded-sm overflow-hidden transition-all duration-300 ${activeImg === i ? 'border-red-600 ring-2 ring-red-50 ring-offset-2' : 'border-neutral-100 opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`view ${i}`} />
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2 & 3: DETAILS & ACTIONS (RIGHT) */}
          <div className="flex flex-col justify-center">
            <div className="mb-8 md:mb-10">
              <span className="text-reveal text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-red-600 block mb-3 md:mb-4">{product?.category}</span>
              <h1 className="text-reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-2 leading-tight">{product?.name}</h1>
              <p className="text-reveal text-[10px] md:text-[11px] font-medium text-neutral-400 uppercase tracking-widest italic mb-6">{product?.scientificName}</p>
              
              <div className="text-reveal flex items-baseline gap-4 mb-6 md:mb-8">
                <span className="text-2xl md:text-3xl font-light tracking-tighter">${product?.price?.toLocaleString()}</span>
                <span className="text-[9px] md:text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  In Stock
                </span>
              </div>

              <p className="text-reveal text-neutral-500 font-light leading-relaxed text-sm md:text-base max-w-md">
                {product?.description}
              </p>
            </div>

            {/* Product Metadata */}
            <div className="space-y-3 md:space-y-4 mb-8 md:mb-12 border-t border-neutral-100 pt-6 md:pt-8">
              {product?.details?.map((detail, idx) => (
                <div key={idx} className="detail-row flex items-center justify-between text-xs md:text-sm py-1">
                  <span className="text-neutral-400 font-light">{detail.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="h-1 w-1 bg-red-600 rounded-full"></span>
                    <span className="font-medium tracking-tight">{detail.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 3: ACTIONS */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex gap-3 md:gap-4">
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 md:py-5 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg ${
                    added ? 'bg-green-600 text-white shadow-green-100' : 'bg-neutral-900 text-white hover:bg-red-600 shadow-neutral-100'
                  }`}
                >
                  {added ? (
                    <>Added to Cart <Check size={16} /></>
                  ) : (
                    <>Add to Cart <ShoppingBag size={14} /></>
                  )}
                </button>
                <button className="hidden sm:flex px-6 md:px-8 border border-neutral-200 hover:border-black transition-colors items-center justify-center">
                   <Activity size={18} strokeWidth={1.5} className="text-neutral-400 hover:text-black" />
                </button>
              </div>
              <button className="w-full py-4 md:py-5 border border-neutral-900 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 group">
                Direct Buy <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* EXTRA INFO */}
            <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 border-t border-neutral-100 pt-6 md:pt-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-neutral-50 rounded-full"><Truck size={16} className="text-neutral-400" /></div>
                <div>
                  <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Logistics</h4>
                  <p className="text-[8px] md:text-[9px] text-neutral-400 leading-tight">Climate-controlled express delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-neutral-50 rounded-full"><ShieldCheck size={16} className="text-neutral-400" /></div>
                <div>
                  <h4 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Warranty</h4>
                  <p className="text-[8px] md:text-[9px] text-neutral-400 leading-tight">7-day health & quality guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        <section className="pt-16 md:pt-24 border-t border-neutral-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
            <div className="related-reveal">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-red-600 block mb-2">Curated</span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight">Related Species</h2>
            </div>
            <button className="related-reveal text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] border-b border-neutral-200 pb-1 hover:border-black transition-all">
              View Collection
            </button>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {relatedProducts.map((item) => (
              <div key={item.id} className="related-reveal group cursor-pointer">
                <div className="aspect-[4/5] bg-neutral-50 rounded-sm overflow-hidden mb-4 relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
                  <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Eye size={16} className="text-neutral-900" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xs md:text-sm font-medium tracking-tight text-neutral-800">{item.name}</h3>
                    <span className="text-[11px] md:text-xs font-light">₹{item.price}</span>
                  </div>
                  <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-neutral-300">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default ProductView;