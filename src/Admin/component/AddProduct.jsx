import React, { useEffect, useRef, useState } from 'react';

const AddProduct = () => {
  const formRef = useRef(null);
  const toastRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    // Inject GSAP script dynamically to ensure it's available
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => {
      if (window.gsap) {
        const gsap = window.gsap;
        const ctx = gsap.context(() => {
          gsap.to(".animate-item", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
          });
        }, formRef);
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const removeFile = () => {
    setFileName('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const gsap = window.gsap;

    // Simulate API Call
    setTimeout(() => {
      if (gsap && toastRef.current) {
        // Success feedback
        gsap.to(toastRef.current, { 
          opacity: 1, 
          y: 0, 
          duration: 0.4 
        });
        
        setTimeout(() => {
          gsap.to(toastRef.current, { 
            opacity: 0, 
            y: 10, 
            duration: 0.4 
          });
          setIsSubmitting(false);
          setFileName('');
          e.target.reset();
        }, 3000);
      } else {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      {/* Form Container */}
      <div 
        ref={formRef}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-6">
          <h1 className="text-2xl font-bold text-slate-800 animate-item opacity-0 translate-y-5">
            Add New Product
          </h1>
          <p className="text-slate-500 text-sm animate-item opacity-0 translate-y-5">
            Enter the details below to add a new item to the Aqua Store inventory.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="space-y-2 animate-item opacity-0 translate-y-5">
              <label className="text-sm font-semibold text-slate-700">Product Name</label>
              <input 
                type="text" 
                placeholder="e.g. Aquamarine Watch" 
                className="w-full p-3 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all" 
                required 
              />
            </div>

            {/* Category */}
            <div className="space-y-2 animate-item opacity-0 translate-y-5">
              <label className="text-sm font-semibold text-slate-700">Category</label>
              <select className="w-full p-3 rounded-lg border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all">
                <option value="">Select Category</option>
                <option value="accessories">Accessories</option>
                <option value="electronics">Electronics</option>
                <option value="apparel">Apparel</option>
                <option value="home">Home Decor</option>
              </select>
            </div>

            {/* Price */}
            <div className="space-y-2 animate-item opacity-0 translate-y-5">
              <label className="text-sm font-semibold text-slate-700">Price ($)</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                className="w-full p-3 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all" 
                required 
              />
            </div>

            {/* Stock */}
            <div className="space-y-2 animate-item opacity-0 translate-y-5">
              <label className="text-sm font-semibold text-slate-700">Stock Quantity</label>
              <input 
                type="number" 
                placeholder="0" 
                className="w-full p-3 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all" 
                required 
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 animate-item opacity-0 translate-y-5">
            <label className="text-sm font-semibold text-slate-700">Product Description</label>
            <textarea 
              rows="4" 
              placeholder="Describe the key features of the product..." 
              className="w-full p-3 rounded-lg border border-slate-200 text-slate-800 resize-none focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="space-y-2 animate-item opacity-0 translate-y-5">
            <label className="text-sm font-semibold text-slate-700">Product Image</label>
            
            {!fileName ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-8 cursor-pointer hover:border-red-500 hover:bg-red-50 transition-all group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400 group-hover:text-red-500 mb-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-slate-500">Click to upload or drag and drop</span>
                <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg>
                  </div>
                  <span className="text-sm text-slate-600 truncate max-w-[200px]">{fileName}</span>
                </div>
                <button 
                  type="button" 
                  onClick={removeFile}
                  className="text-red-500 text-xs font-bold uppercase tracking-wider hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 animate-item opacity-0 translate-y-5">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full ${isSubmitting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-[0.98] flex items-center justify-center`}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Toast */}
      <div 
        ref={toastRef}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl opacity-0 translate-y-10 pointer-events-none transition-all duration-300 z-50"
      >
        Product successfully added!
      </div>
    </div>
  );
};

export default AddProduct;