import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, 
  Search, 
  Download, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  RefreshCcw
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([
    { id: "#AQ-1092", customer: "John Doe", products: "Ocean Mist Cologne (x1)", total: "$85.00", status: "Pending" },
    { id: "#AQ-1093", customer: "Sarah Jenkins", products: "Deep Sea Serum (x2), Face Wash", total: "$124.50", status: "Processing" },
    { id: "#AQ-1094", customer: "Michael Chen", products: "Aqua Hydration Kit", total: "$210.00", status: "Delivered" },
    { id: "#AQ-1095", customer: "Emma Wilson", products: "Coral Reef Sunscreen", total: "$42.00", status: "Pending" },
    { id: "#AQ-1096", customer: "David Smith", products: "Marine Clay Mask", total: "$55.00", status: "Processing" },
    { id: "#AQ-1097", customer: "Sophia Garcia", products: "Tidal Wave Shampoo", total: "$28.00", status: "Delivered" },
    { id: "#AQ-1098", customer: "James Lee", products: "Blue Algae Cream", total: "$68.00", status: "Pending" }
  ]);

  const [toast, setToast] = useState({ show: false, message: "" });
  const tableRef = useRef(null);

  // Load GSAP via CDN to avoid build errors in this environment
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.async = true;
    script.onload = () => {
      // Entry Animation
      window.gsap.from(".order-row", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getStatusStyles = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock size={14} className="mr-1" />;
      case 'Processing': return <RefreshCcw size={14} className="mr-1" />;
      case 'Delivered': return <CheckCircle2 size={14} className="mr-1" />;
      default: return null;
    }
  };

  const updateStatus = (index, newStatus) => {
    const badgeId = `#badge-${index}`;
    
    // Status Change Animation using window.gsap
    if (window.gsap) {
      window.gsap.to(badgeId, {
        scale: 1.15,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          const updatedOrders = [...orders];
          updatedOrders[index].status = newStatus;
          setOrders(updatedOrders);
          showFeedback(`Order ${orders[index].id} updated to ${newStatus}`);
        }
      });
    } else {
      const updatedOrders = [...orders];
      updatedOrders[index].status = newStatus;
      setOrders(updatedOrders);
    }
  };

  const showFeedback = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Orders Management</h1>
            <p className="text-slate-500 mt-1">Real-time overview of Aqua Store transactions.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
              />
            </div>
            <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition active:scale-95 shadow-sm">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', val: '1,284', color: 'text-blue-600' },
            { label: 'Pending', val: orders.filter(o => o.status === 'Pending').length, color: 'text-amber-600' },
            { label: 'Processing', val: orders.filter(o => o.status === 'Processing').length, color: 'text-blue-500' },
            { label: 'Delivered Today', val: '42', color: 'text-emerald-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" ref={tableRef}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Products</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.id} className="order-row border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors group opacity-1">
                    <td className="px-6 py-5 font-bold text-blue-600">{order.id}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {order.customer.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-slate-500 text-sm max-w-[200px]">
                        <Package size={14} className="mr-2 shrink-0" />
                        <span className="truncate">{order.products}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-slate-900">{order.total}</td>
                    <td className="px-6 py-5">
                      <span 
                        id={`badge-${index}`}
                        className={`status-badge inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border transition-all duration-300 ${getStatusStyles(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select 
                          value={order.status}
                          onChange={(e) => updateStatus(index, e.target.value)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded p-1 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between text-sm text-slate-500 px-2">
          <p>Showing {orders.length} of 1,284 orders</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>

      {/* Animated Toast Notification */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-medium shadow-2xl flex items-center gap-3 transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        {toast.message}
      </div>
    </div>
  );
};

export default Orders;