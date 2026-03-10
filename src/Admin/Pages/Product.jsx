import React, { useState, useEffect, useRef } from 'react';
import { deleteProductAPI, getAllProductsAdminAPI } from "../../Service/allApi";
import { useAuth } from "@clerk/clerk-react";
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
import AddProduct from '../component/AddProduct';

const Product = () => {
  // Mock Data for Aqua Store
  const [products, setProducts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  const { getToken } = useAuth();
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

 const handleDelete = async () => {

  try {

    const token = await getToken();

    const reqHeader = {
      Authorization: `Bearer ${token}`
    };

    const result = await deleteProductAPI(selectedProduct._id, reqHeader);

    if (result.status === 200) {

      // If GSAP not loaded → delete normally
      if (!gsapRef.current) {

        setProducts(products.filter(p => p._id !== selectedProduct._id));
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
        return;

      }

      // Animate row deletion
      const row = document.getElementById(`product-row-${selectedProduct._id}`);

      gsapRef.current.to(row, {
        opacity: 0,
        x: -20,
        duration: 0.3,
        onComplete: () => {

          setProducts(products.filter(p => p._id !== selectedProduct._id));
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);

        }
      });

    }

  } catch (error) {

    console.log(error);

  }

};

  // const filteredProducts = products.filter(p => 
  //   p.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // get all products 
    const getProducts = async () => {
    try {

      const token = await getToken();

      const reqHeader = {
        Authorization: `Bearer ${token}`
      };

      const result = await getAllProductsAdminAPI(reqHeader);

      if (result.status === 200) {
        setProducts(result.data.data);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

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
              {products.map((product) => (
                <tr 
                  key={product.id} 
                  id={`product-row-${product.id}`}
                  className="product-row border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <img 
                      src={product?.images?.[1]} 
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
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          {/* <div 
            ref={addModalRef}
            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl"
          >
          
          </div> */}
           <AddProduct setIsModalOpen={setIsModalOpen} />
        </div>
      )}
    </div>
  );
};

const App = () => <Product />;
export default App;