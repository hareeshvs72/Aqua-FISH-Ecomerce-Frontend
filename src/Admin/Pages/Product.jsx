import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Package, 
  Layers, 
  DollarSign, 
  Database, 
  X,
  AlertCircle
} from 'lucide-react';

const Product = () => {
  // Mock Data for Aqua Store
  const [products, setProducts] = useState([
    { id: 1, name: 'Deep Sea Regulator', category: 'Diving Gear', price: 450.00, stock: 12, image: 'https://images.unsplash.com/photo-1530124564343-6a59910d328d?auto=format&fit=crop&q=80&w=100' },
    { id: 2, name: 'Coral Safe Sunscreen', category: 'Skincare', price: 25.50, stock: 145, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=100' },
    { id: 3, name: 'Professional Fins X3', category: 'Diving Gear', price: 120.00, stock: 45, image: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&q=80&w=100' },
    { id: 4, name: 'Underwater Torch', category: 'Accessories', price: 85.00, stock: 8, image: 'https://images.unsplash.com/photo-1518155317743-a8ff43ea6f5f?auto=format&fit=crop&q=80&w=100' },
    { id: 5, name: 'Neoprene Wetsuit 5mm', category: 'Apparel', price: 210.00, stock: 24, image: 'https://images.unsplash.com/photo-1582739443210-918991667c46?auto=format&fit=crop&q=80&w=100' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const tableRef = useRef(null);
  const deleteModalRef = useRef(null);
  const addModalRef = useRef(null);
  const gsapRef = useRef(null);

  // Load GSAP via CDN to avoid resolution issues
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => {
      gsapRef.current = window.gsap;
      runInitialAnimation();
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const runInitialAnimation = () => {
    if (gsapRef.current && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tr.product-row');
      gsapRef.current.fromTo(rows, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  };

  // GSAP for Add Modal
  useEffect(() => {
    if (isModalOpen && gsapRef.current && addModalRef.current) {
      gsapRef.current.fromTo(addModalRef.current, 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [isModalOpen]);

  // GSAP for Delete Modal
  useEffect(() => {
    if (isDeleteModalOpen && gsapRef.current && deleteModalRef.current) {
      gsapRef.current.fromTo(deleteModalRef.current, 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isDeleteModalOpen]);

  const handleDelete = () => {
    if (!gsapRef.current) {
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        setIsDeleteModalOpen(false);
        return;
    }

    const row = document.getElementById(`product-row-${selectedProduct.id}`);
    gsapRef.current.to(row, {
      opacity: 0,
      x: -20,
      duration: 0.3,
      onComplete: () => {
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
      }
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aqua Store Inventory</h1>
          <p className="text-slate-500 mt-1">Manage your aquatic products and stock levels.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all active:scale-95 shadow-lg shadow-red-200"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-600' },
          { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, icon: Database, color: 'text-red-600' },
          { label: 'Low Stock', value: products.filter(p => p.stock < 10).length, icon: AlertCircle, color: 'text-orange-600' },
          { label: 'Active Categories', value: new Set(products.map(p => p.category)).size, icon: Layers, color: 'text-emerald-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">Export</button>
            <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">Filter</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" ref={tableRef}>
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider text-right">Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider text-center">Stock</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id} 
                  id={`product-row-${product.id}`}
                  className="product-row border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{product.name}</div>
                    <div className="text-xs text-slate-400 font-mono">ID: AQ-{product.id}00</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-slate-800">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className={`text-sm font-medium ${product.stock < 10 ? 'text-red-600' : 'text-slate-600'}`}>
                        {product.stock} units
                      </span>
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${product.stock < 10 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${Math.min(product.stock, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div 
            ref={deleteModalRef}
            className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                <Trash2 size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Confirm Delete</h2>
              <p className="text-slate-500 mb-8">
                Are you sure you want to delete <span className="font-semibold text-slate-900">"{selectedProduct?.name}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div 
            ref={addModalRef}
            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold">New Product</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Product Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="e.g. Scuba Mask" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all appearance-none">
                    <option>Diving Gear</option>
                    <option>Accessories</option>
                    <option>Apparel</option>
                    <option>Skincare</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <DollarSign size={14} /> Price (USD)
                  </label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <Database size={14} /> Initial Stock
                  </label>
                  <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="10" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Product Image URL</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition-all" placeholder="https://images..." />
              </div>
              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Discard
                </button>
                <button className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95">
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => <Product />;
export default App;