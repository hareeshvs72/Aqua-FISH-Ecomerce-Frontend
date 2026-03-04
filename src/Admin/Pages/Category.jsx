import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  X, 
  ChevronRight, 
  LayoutGrid, 
  Layers, 
  Waves, 
  Fish, 
  Package 
} from 'lucide-react';

const Category = () => {
  // Initial Mock Data
  const [categories, setCategories] = useState([
    { id: 1, name: 'Freshwater Fish', slug: 'freshwater-fish', count: 142, icon: 'Fish' },
    { id: 2, name: 'Saltwater Fish', slug: 'saltwater-fish', count: 85, icon: 'Waves' },
    { id: 3, name: 'Exotic Fish', slug: 'exotic-fish', count: 24, icon: 'Layers' },
    { id: 4, name: 'Aquarium Accessories', slug: 'accessories', count: 312, icon: 'Package' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', slug: '', icon: 'Package' });
  
  const containerRef = useRef(null);

  // Load GSAP via CDN and run animations
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => {
      const gsap = window.gsap;
      if (!gsap) return;

      const ctx = gsap.context(() => {
        gsap.from(".header-element", {
          y: -20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out"
        });
        
        gsap.from(".category-card", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)",
          delay: 0.2
        });
      }, containerRef);
    };
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Filtered Categories
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, slug: category.slug, icon: category.icon });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '', icon: 'Package' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id ? { ...c, ...formData } : c
      ));
    } else {
      const newCat = {
        id: Date.now(),
        ...formData,
        count: 0
      };
      setCategories([...categories, newCat]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    const gsap = window.gsap;
    if (gsap) {
      gsap.to(`.card-${id}`, {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setCategories(prev => prev.filter(c => c.id !== id));
        }
      });
    } else {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const IconComponent = ({ name, className }) => {
    const icons = { Fish, Waves, Layers, Package };
    const Icon = icons[name] || Package;
    return <Icon className={className} />;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="header-element">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <LayoutGrid size={24} />
              </div>
              Category Management
            </h1>
            <p className="text-slate-500 mt-1">Organize and manage your store's aquatic collections.</p>
          </div>
          
          <button 
            onClick={() => handleOpenModal()}
            className="header-element flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="header-element mt-8 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Grid Display */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div 
            key={category.id}
            className={`category-card card-${category.id} bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden`}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <IconComponent name={category.icon} className="w-6 h-6" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(category)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800">{category.name}</h3>
              <p className="text-sm text-slate-400 mt-1 uppercase tracking-wider font-medium">/{category.slug}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{category.count} Products</span>
              <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform cursor-pointer">
                View All <ChevronRight size={16} />
              </div>
            </div>
          </div>
        ))}
        
        {filteredCategories.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="inline-flex items-center justify-center p-4 bg-slate-50 rounded-full text-slate-400 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-600">No categories found</h3>
            <p className="text-slate-400">Try adjusting your search terms.</p>
          </div>
        )}
      </div>

      {/* Modern Slide-over / Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex-1 overflow-y-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category Name</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. Rare Corals"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">URL Slug</label>
                <div className="flex items-center">
                  <span className="bg-slate-50 border border-r-0 border-slate-200 px-3 py-2 rounded-l-lg text-slate-400 text-sm">aquastore.com/</span>
                  <input 
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-r-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">Select Icon</label>
                <div className="grid grid-cols-4 gap-3">
                  {['Fish', 'Waves', 'Layers', 'Package'].map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setFormData({...formData, icon: iconName})}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        formData.icon === iconName 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-slate-100 hover:border-slate-300 text-slate-400'
                      }`}
                    >
                      <IconComponent name={iconName} className="w-6 h-6" />
                      <span className="text-[10px] font-bold uppercase">{iconName}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 bg-white sticky bottom-0">
                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                {editingCategory && (
                   <button 
                   type="button"
                   onClick={() => handleDelete(editingCategory.id)}
                   className="w-full mt-3 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-50 transition-colors"
                 >
                   Delete Category
                 </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;