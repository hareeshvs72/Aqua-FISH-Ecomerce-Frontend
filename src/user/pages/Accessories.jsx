import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search,
  AlertCircle,
  ShoppingCart,
  Lightbulb,
  Container,
  Wind,
  Droplets,
  Wrench,
  ChevronRight,
  Filter
} from 'lucide-react';

const Accessories = () => {
  const [filters, setFilters] = useState({
    searchQuery: '',
    category: 'All',
    brand: 'All'
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock Accessories Data
  const ACCESSORIES = [
    { id: 201, name: "Ultra-Quiet External Filter", category: "Filters", price: 120, brand: "AquaFlow", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400" },
    { id: 202, name: "Full-Spectrum LED System", category: "Lighting", price: 185, brand: "Lumina", img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400" },
    { id: 203, name: "Rimless 20G Glass Tank", category: "Tanks", price: 240, brand: "ClearView", img: "https://images.unsplash.com/photo-1524704659694-9f65b2a6020c?auto=format&fit=crop&q=80&w=400" },
    { id: 204, name: "Premium Flake Food", category: "Food", price: 15, brand: "NutriFish", img: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&q=80&w=400" },
    { id: 205, name: "Magnetic Glass Scraper", category: "Cleaning", price: 25, brand: "Scrub-X", img: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=400" },
    { id: 206, name: "CO2 Injection Kit", category: "Maintenance", price: 85, brand: "PlantPros", img: "https://images.unsplash.com/photo-1615963244664-5b84446e84ba?auto=format&fit=crop&q=80&w=400" },
    { id: 207, name: "Nano Sponge Filter", category: "Filters", price: 18, brand: "AquaFlow", img: "https://images.unsplash.com/photo-1548449112-96a20133b14f?auto=format&fit=crop&q=80&w=400" },
    { id: 208, name: "Submersible Heater 100W", category: "Maintenance", price: 45, brand: "ThermoStat", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400" },
  ];

  const filteredItems = useMemo(() => {
    return ACCESSORIES.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
      const matchesCat = filters.category === 'All' || item.category === filters.category;
      return matchesSearch && matchesCat;
    });
  }, [filters]);

  useEffect(() => {
    setIsLoaded(true);
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => {
      const gsap = window.gsap;
      gsap.from(".hero-anim", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 });
      gsap.to(".red-divider", { width: "80px", duration: 1, ease: "power2.inOut", delay: 0.5 });
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  useEffect(() => {
    if (isLoaded && window.gsap) {
      window.gsap.fromTo(".item-card", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: true }
      );
    }
  }, [filteredItems, isLoaded]);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const categories = [
    { name: 'Filters', icon: Wind },
    { name: 'Lighting', icon: Lightbulb },
    { name: 'Tanks', icon: Container },
    { name: 'Food', icon: Droplets },
    { name: 'Cleaning', icon: Wrench },
  ];

  return (
    <div className={`min-h-screen bg-white text-black font-sans transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* SECTION 1: PAGE INTRO - Responsive Typography */}
      <header className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-4 md:px-16 bg-white overflow-hidden border-b border-neutral-50">
        <div className="max-w-[1400px] mx-auto text-center flex flex-col items-center">
          <h1 className="hero-anim text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4 leading-none">
            Aquarium <span className="text-red-600">Accessories</span>
          </h1>
          <div className="hero-anim red-divider h-1.5 bg-red-600 w-0 mb-8 rounded-full"></div>
          <p className="hero-anim text-base md:text-xl text-neutral-400 font-medium max-w-2xl leading-relaxed px-4">
            Everything your aquarium needs to stay healthy and beautiful. Professional grade equipment for the modern hobbyist.
          </p>
        </div>
      </header>

      {/* SECTION 2: ACCESSORIES CATEGORIES - Responsive Grid */}
      <section className="px-4 md:px-16 max-w-[1400px] mx-auto mt-8 md:mt-12 mb-12 md:mb-20">
         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => updateFilter('category', cat.name)}
                className={`group p-4 md:p-8 rounded-xl border transition-all text-center flex flex-col items-center gap-3 md:gap-4 ${filters.category === cat.name ? 'border-red-600 bg-red-50/50 shadow-lg shadow-red-100/50' : 'border-neutral-100 hover:border-black bg-neutral-50/50 hover:bg-white'}`}
              >
                <cat.icon size={24} className={`${filters.category === cat.name ? 'text-red-600' : 'text-black'} md:w-7 md:h-7`} />
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest">{cat.name}</span>
              </button>
            ))}
         </div>
      </section>

      {/* SECTION 3 & 4: FILTER & PRODUCT GRID */}
      <main className="px-4 md:px-16 max-w-[1400px] mx-auto pb-20">
        
        {/* Filter & Sort Panel - Stack on mobile */}
        <div className="mb-8 md:mb-12 flex flex-col lg:flex-row gap-4 md:gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text"
              placeholder="Search equipment..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="w-full bg-neutral-50 border-2 border-transparent focus:border-black focus:bg-white pl-12 md:pl-16 pr-4 py-4 md:py-5 text-lg md:text-xl font-bold outline-none transition-all rounded"
            />
          </div>
          
          <div className="flex gap-4 w-full lg:w-auto">
            <button 
              onClick={() => updateFilter('category', 'All')}
              className={`flex-1 lg:flex-none px-6 md:px-10 py-4 md:py-5 text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${filters.category === 'All' ? 'border-black bg-black text-white' : 'border-neutral-200 text-neutral-400 hover:text-black hover:border-black'}`}
            >
              <Filter size={14}/> View All
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
             <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300">
               {filters.category} Collection / <span className="text-black">{filteredItems.length} Products</span>
             </h2>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-12">
              {filteredItems.map((item) => (
                <div key={item.id} className="item-card group">
                  <div className="relative aspect-square overflow-hidden mb-4 md:mb-5 bg-neutral-50 rounded-sm">
                    <img 
                      src={item.img} alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-red-600 text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest">
                      {item.category}
                    </div>
                    
                    {/* Hover Add to Cart - Visible as icon on mobile/touch, full overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 md:p-6">
                      <button className="w-full py-3 md:py-4 bg-red-600 text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-red-600 transition-colors transform translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
                        <ShoppingCart size={14} /> Add to Cart
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <h3 className="text-base md:text-lg font-black uppercase tracking-tighter leading-tight mb-1 md:mb-2 group-hover:text-red-600 transition-colors truncate">{item.name}</h3>
                      <div className="text-neutral-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                        {item.brand} Precision Series
                      </div>
                    </div>
                    <div className="text-base md:text-lg font-black text-black shrink-0">
                      ${item.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 md:py-32 text-center border-2 border-dashed border-neutral-100 rounded-xl px-4">
              <AlertCircle size={32} className="mx-auto mb-4 text-neutral-200" />
              <h3 className="text-lg md:text-xl font-black tracking-tighter mb-2 uppercase">No matches found</h3>
              <p className="text-neutral-400 text-[10px] md:text-xs font-medium mb-8">Try clearing your filters or refining your search.</p>
              <button onClick={() => setFilters({searchQuery: '', category: 'All', brand: 'All'})} className="px-10 py-4 bg-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* SECTION 5: HIGHLIGHT STRIP - Fluid Text */}
      <section className="bg-black py-16 md:py-24 px-6 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto hero-anim">
          <p className="text-white text-2xl sm:text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none mb-4 italic">
            Carefully selected <span className="text-red-600">hardware</span> for <br className="hidden sm:block" /> peak aquarium performance.
          </p>
          <div className="w-12 md:w-16 h-1 md:h-1.5 bg-red-600 mx-auto mt-6 md:mt-8"></div>
        </div>
      </section>

      {/* SECTION 6: FINAL CTA - Stacked buttons on small screens */}
      <section className="py-20 md:py-32 px-6 bg-white text-center border-t border-neutral-50">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 md:mb-10 leading-none">Complete <br/>Your Setup.</h2>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
             <button className="w-full sm:w-auto px-10 md:px-14 py-5 md:py-6 bg-red-600 text-white font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-black transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-red-100">
               Shop All Accessories
             </button>
             <button className="w-full sm:w-auto px-10 md:px-14 py-5 md:py-6 bg-transparent text-black font-black text-[10px] md:text-[11px] uppercase tracking-widest border-2 border-neutral-200 hover:border-black transition-all flex items-center justify-center gap-2 group">
               Need Help? <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accessories;