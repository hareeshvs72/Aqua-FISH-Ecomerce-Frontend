import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from "@clerk/clerk-react";
import {useNavigate} from 'react-router-dom'
import { 
  PackagePlus, 
  Image as ImageIcon, 
  X, 
  Droplets, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { createProductAPI } from '../../Service/allApi';

const AddProduct = ({ isOpen = true, onClose , setIsModalOpen}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Fish',
    waterType: 'Freshwater',
    difficulty: 'Beginner',
    price: '',
    stock: '',
    isFeatured: false
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const inputsRef = useRef([]);
  const imagePreviewRef = useRef(null);
  const navigate =  useNavigate()
  const {getToken} = useAuth()

  // Load GSAP via CDN and run animations for the modal
  useEffect(() => {
    if (!isOpen) return;

    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => {
      const gsap = window.gsap;
      if (gsap) {
        const ctx = gsap.context(() => {
          // Overlay fade in
          gsap.fromTo(overlayRef.current, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.4, ease: 'power2.out' }
          );

          // Modal slide and scale up
          gsap.fromTo(modalRef.current, 
            { y: 50, scale: 0.95, opacity: 0 }, 
            { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 }
          );

          // Stagger inputs
          gsap.from(inputsRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power2.out',
            delay: 0.4
          });
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [isOpen]);

  console.log(formData);
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({...prev,[name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file
    }));
    
    setImages(prev => [...prev, ...newImages]);

    setTimeout(() => {
      if (window.gsap) {
        window.gsap.from(".image-thumb", {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          stagger: 0.1,
          ease: 'back.out(1.7)'
        });
      }
    }, 0);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setIsSubmitting(true);

  try {

    const token = await getToken();

    const reqBody = new FormData();

    reqBody.append("name", formData.name);
    reqBody.append("description", formData.description);
    reqBody.append("category", formData.category);
    reqBody.append("waterType", formData.waterType);
    reqBody.append("difficulty", formData.difficulty);
    reqBody.append("price", formData.price);
    reqBody.append("stock", formData.stock);
    reqBody.append("isFeatured", formData.isFeatured);

    images.forEach((img) => {
      reqBody.append("images", img.file);
    });

    const reqHeader = {
      Authorization: `Bearer ${token}`
    };

    const result = await createProductAPI(reqBody, reqHeader);

    if (result.status === 201) {
      setStatus("success");
      navigate("/admin/product")
      setIsModalOpen(false)
    }

  } catch (error) {
    console.log(error);
    setStatus("error");
  }

  setIsSubmitting(false);
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
         onClick={()=>setIsModalOpen(false)}
      ></div>
      
      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-5xl bg-slate-50 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header Section */}
        <header className="sticky top-0 bg-white border-b border-slate-100 p-6 sm:px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 p-2.5 rounded-xl text-white shadow-lg shadow-red-200">
              <PackagePlus size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Add New Product</h1>
              <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">Fill in details to update Aqua Store inventory.</p>
            </div>
          </div>
          
          <button 
             onClick={()=>setIsModalOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </header>

        <div className="overflow-y-auto p-6 sm:p-8">
          {/* Status Message */}
          {status === 'success' && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3 animate-pulse">
              <CheckCircle2 size={20} />
              <p className="font-medium">Product added successfully!</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <form id="product-form" onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Product Name */}
                  <div className="md:col-span-2" ref={el => inputsRef.current[0] = el}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="e.g. Golden Guppy Fish"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2" ref={el => inputsRef.current[1] = el}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <textarea 
                      name="description"
                      rows="3"
                      required
                      placeholder="Describe the product..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder:text-slate-400 resize-none"
                    ></textarea>
                  </div>

                  {/* Category Selection */}
                  <div ref={el => inputsRef.current[2] = el}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <div className="relative">
                      <select 
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-white cursor-pointer"
                      >
                        <option>Fish</option>
                        <option>Plant</option>
                        <option>Accessories</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div>

                  {/* Conditional Water Type */}
                  {formData.category !== 'Accessories' && (
                    <div ref={el => inputsRef.current[3] = el}>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Water Type</label>
                      <div className="relative">
                        <select 
                          name="waterType"
                          value={formData.waterType}
                          onChange={handleInputChange}
                          className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-white cursor-pointer"
                        >
                          <option>Freshwater</option>
                          <option>Saltwater</option>
                          <option>Brackish</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                      </div>
                    </div>
                  )}

                  {/* Difficulty Level */}
                  <div ref={el => inputsRef.current[4] = el}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
                    <div className="relative">
                      <select 
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-white cursor-pointer"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Expert</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div ref={el => inputsRef.current[5] = el}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                      <input 
                        type="number" 
                        name="price"
                        required
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div ref={el => inputsRef.current[6] = el}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Stock Quantity</label>
                    <input 
                      type="number" 
                      name="stock"
                      required
                      placeholder="e.g. 20"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="md:col-span-2 flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100" ref={el => inputsRef.current[7] = el}>
                    <div>
                      <h4 className="font-semibold text-slate-800">Featured Product</h4>
                      <p className="text-xs text-slate-500">Show on Homepage</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Sidebar - Image Upload */}
            <aside className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon size={18} className="text-red-600" />
                  Images
                </h3>
                
                <div className="space-y-4">
                  <label className="group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon size={20} className="text-slate-400 group-hover:text-red-500 mb-2" />
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Upload Files</p>
                    </div>
                    <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>

                  <div className="grid grid-cols-2 gap-2" ref={imagePreviewRef}>
                    {images.map((img) => (
                      <div key={img.id} className="image-thumb relative group aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                        <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(img.id)}
                          className="absolute top-1 right-1 p-1 bg-white text-red-600 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-2xl p-5 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-xs font-bold mb-1 uppercase tracking-widest text-red-500">
                    Pro Tip
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ensure images are high resolution and well-lit to improve store aesthetics.
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-red-600/10 rounded-full blur-xl"></div>
              </div>
            </aside>
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex justify-end gap-3 z-20">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors uppercase tracking-tight"
          >
            Cancel
          </button>
          <button 
            form="product-form"
            type="submit"
            disabled={isSubmitting}
            className={`px-10 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm shadow-xl shadow-red-200 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 uppercase tracking-tight ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Save Product'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddProduct;