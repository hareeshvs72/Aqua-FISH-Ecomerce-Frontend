  import React, { useState, useEffect, useMemo } from 'react';
  import { 
    Waves, 
    Search,
    AlertCircle,
    Leaf,
    ShieldCheck,
    ArrowRight
  } from 'lucide-react';
  import { useNavigate } from 'react-router-dom';
  import { useAuth, useClerk } from '@clerk/clerk-react';
import { getAllProductsAPI } from '../../Service/allApi';

  
 
  const Fish = () => {
  
    const [products,setProducts]  = useState([])
    const [category,setCategory] = useState("Fish")
    const [searchKey,setSearchKey] =useState("")
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate()
    const {isSignedIn} =  useAuth()
  const {openSignIn,openSignUp} =  useClerk()
    // Mock Data
    const DATA = {
      Fish: [
        { id: 1, name: "Neon Tetra", type: "Freshwater", difficulty: "Beginner", price: 5, img: "https://images.unsplash.com/photo-1524704659694-9f65b2a6020c?auto=format&fit=crop&q=80&w=400" },
        { id: 2, name: "Discus Fish", type: "Freshwater", difficulty: "Expert", price: 85, img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=400" },
        { id: 3, name: "Yellow Tang", type: "Saltwater", difficulty: "Intermediate", price: 65, img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=400" },
        { id: 4, name: "Clownfish", type: "Saltwater", difficulty: "Beginner", price: 25, img: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&q=80&w=400" },
        { id: 5, name: "Arowana", type: "Exotic", difficulty: "Expert", price: 450, img: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=400" },
        { id: 6, name: "Betta Splendens", type: "Freshwater", difficulty: "Beginner", price: 15, img: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?auto=format&fit=crop&q=80&w=400" },
        { id: 7, name: "Blue Powder Tang", type: "Saltwater", difficulty: "Intermediate", price: 120, img: "https://images.unsplash.com/photo-1548449112-96a20133b14f?auto=format&fit=crop&q=80&w=400" },
        { id: 8, name: "Flowerhorn Cichlid", type: "Exotic", difficulty: "Intermediate", price: 150, img: "https://images.unsplash.com/photo-1615963244664-5b84446e84ba?auto=format&fit=crop&q=80&w=400" },
      ],
      Plants: [
        { id: 101, name: "Anubias Nana", type: "Low Light", difficulty: "Beginner", price: 12, img: "https://images.unsplash.com/photo-1516550130560-ef49ad136601?auto=format&fit=crop&q=80&w=400" },
        { id: 102, name: "Amazon Sword", type: "Medium Light", difficulty: "Beginner", price: 18, img: "https://images.unsplash.com/photo-1508595165502-3e2652e5570d?auto=format&fit=crop&q=80&w=400" },
        { id: 103, name: "Java Moss", type: "Low Light", difficulty: "Beginner", price: 10, img: "https://images.unsplash.com/photo-1584564812239-50c609673891?auto=format&fit=crop&q=80&w=400" },
        { id: 104, name: "Red Ludwigia", type: "High Light", difficulty: "Expert", price: 22, img: "https://images.unsplash.com/photo-1600100397608-f010e42ed97c?auto=format&fit=crop&q=80&w=400" },
      ]
    };
useEffect(()=>{
    handileGetAllProducts()
  },[category,searchKey])
  
    // const filteredItems = useMemo(() => {
    //   const currentList = DATA[filters.category];
    //   return currentList.filter(item => {
    //     return item.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
    //   });
    // }, [filters]);

    useEffect(() => {
      setIsLoaded(true);
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      script.async = true;
      script.onload = () => {
        const gsap = window.gsap;
        gsap.from(".hero-anim", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.2 });
      };
      document.head.appendChild(script);
      return () => {
          if (document.head.contains(script)) {
              document.head.removeChild(script);
          }
      };
    }, []);

    useEffect(() => {
      if (isLoaded && window.gsap) {
        window.gsap.fromTo(".item-card", 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out", overwrite: true }
        );
      }
    }, [category, isLoaded]);

    const updateFilter = (key, value) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearSearch = () => setFilters(prev => ({ ...prev, searchQuery: '' }));

    const scrollToCatalog = () => {
      const element = document.getElementById('catalog');
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
    };
    
    // get all products 
    const handileGetAllProducts = async()=>{
      console.log("inside get all products");
      
        const filter = {
          category:category,
          search:searchKey

        }
        const query = new URLSearchParams(filter).toString()
      const result = await getAllProductsAPI(query)
      console.log(result.data.data);
      setProducts(result.data.data)


    }

     
    return (
      <div className={`min-h-screen bg-white text-black font-sans transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* HERO SECTION */}
        <header className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-6 md:px-16 overflow-hidden">
          {/* Background Accent */}
          <div className="absolute top-0 right-0 w-full md:w-1/3 h-full bg-neutral-50 -z-10 skew-x-0 md:skew-x-12 translate-x-0 md:translate-x-1/2" />
          
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-4xl">
              <h1 className="hero-anim text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 md:mb-8 uppercase break-words">
                Curated <span className="text-red-600">Aquatic</span> <br />
                Excellence.
              </h1>
              <p className="hero-anim text-base md:text-xl text-neutral-500 font-medium max-w-xl mb-8 md:mb-12 leading-relaxed">
                Rare specimens and premium flora sourced from the world's most pristine environments. Engineered for the sophisticated aquarist.
              </p>
              <div className="hero-anim flex flex-col sm:flex-row flex-wrap gap-4">
                <button 
                  onClick={scrollToCatalog}
                  className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-all group"
                >
                  Browse Catalog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-4 px-0 sm:px-6 border-l-0 sm:border-l border-neutral-200 py-2 sm:py-0">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 overflow-hidden shrink-0">
                        <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Join 2k+ Aquarists</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main id="catalog" className="px-6 md:px-16 max-w-[1400px] mx-auto pb-20">
          
          {/* SEARCH & TOGGLE */}
          <div className="mb-8 md:mb-12 flex flex-col lg:flex-row gap-4 md:gap-6 items-center">
            <div className="relative flex-1 w-full">
              <Search size={20} className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text"
                placeholder={`Search ${category.toLowerCase()}...`}
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="w-full bg-neutral-50 border-2 border-transparent focus:border-black focus:bg-white pl-12 md:pl-16 pr-6 py-4 md:py-5 text-lg md:text-xl font-bold outline-none transition-all rounded shadow-sm"
              />
            </div>
            <div className="flex bg-neutral-100 p-1 rounded-lg border border-neutral-200 w-full lg:w-auto overflow-x-auto no-scrollbar">
              <button 
                onClick={() => { setCategory('Fish')}}
                className={`flex-1 lg:flex-none whitespace-nowrap px-6 md:px-12 py-3 md:py-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all rounded-md flex items-center justify-center gap-2 ${category === 'Fish' ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'}`}
              >
                <Waves size={14}/> Live Fish
              </button>
              <button 
                onClick={() => {  setCategory('Plants')}}
                className={`flex-1 lg:flex-none whitespace-nowrap px-6 md:px-12 py-3 md:py-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all rounded-md flex items-center justify-center gap-2 ${category === 'Plants' ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'}`}
              >
                <Leaf size={14}/> Live Plants
              </button>
            </div>
          </div>

          {/* CATALOG SECTION */}
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-50">
              <h2 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-neutral-300">
                {category} Catalog / <span className="text-black">{products.length} Available</span>
              </h2>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-12">
                {products?.map((item) => (
                  <div   onClick={()=>{!isSignedIn ? openSignIn({
                     afterSignInUrl: `/view/${item?._id}/aqua`
                  }) : navigate(`/view/${item?._id}/aqua`)}}  key={item?._id} className="item-card group cursor-pointer">
                    <div className="relative aspect-square overflow-hidden mb-4 md:mb-5 bg-neutral-100 rounded-sm">
                      <img 
                        src={item.img} alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-black text-white text-[8px] font-black px-2 py-1 uppercase">
                        {item.waterType}
                      </div>
                    </div>

                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h3 className="text-base md:text-lg font-black uppercase tracking-tighter leading-tight mb-1 md:mb-2 group-hover:text-red-600 transition-colors truncate">{item.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-neutral-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                          <span className="flex items-center gap-1 shrink-0"><ShieldCheck size={11} className="text-red-600"/> {item.difficulty}</span>
                          <span className="px-1.5 py-0.5 border border-neutral-100 text-[8px] shrink-0">{item.waterType}</span>
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
              <div className="py-20 md:py-32 text-center border-2 border-dashed border-neutral-100 rounded-xl">
                <AlertCircle size={32} className="mx-auto mb-4 text-neutral-200" />
                <h3 className="text-lg md:text-xl font-black tracking-tighter mb-2 uppercase">No Specimens Found</h3>
                <p className="text-neutral-400 text-[10px] md:text-xs font-medium mb-6 md:mb-8">Try searching for a different name.</p>
                <button onClick={()=>setSearchKey("")} className="px-8 md:px-10 py-3 md:py-4 bg-black text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors rounded">
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  export default Fish;