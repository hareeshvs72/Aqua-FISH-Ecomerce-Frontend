import React, { useState, useEffect, useRef } from 'react';
import {
  Package,
  Search,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  RefreshCcw,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { getAllOrdersAdminAPI, updateOrderStatusAPI } from '../../Service/allApi';
import { gsap } from "gsap";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', isError: false });
  const tableRef = useRef(null);
  const { getToken } = useAuth();

  // Load GSAP via CDN


  // Fetch all orders from backend
  const fetchAllOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      if (!token) { setError('Authentication required.'); setLoading(false); return; }
      const reqHeader = { Authorization: `Bearer ${token}` };
      const res = await getAllOrdersAdminAPI(reqHeader);
      if (res.status === 200 && res.data.success) {
        console.log("Full Response:", res);
        console.log("Response Data:", res.data);
        console.log("Orders:", res.data.data);

        setOrders(res.data.data);
      } else {
        setError(res.data.message || 'Failed to fetch orders.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={14} className="mr-1" />;
      case 'Processing': return <RefreshCcw size={14} className="mr-1" />;
      case 'Shipped': return <Package size={14} className="mr-1" />;
      case 'Delivered': return <CheckCircle2 size={14} className="mr-1" />;
      default: return null;
    }
  };

  const updateStatus = async (orderId, newStatus, index) => {
    const badgeId = `#badge-${index}`;

    gsap.to(badgeId, {
      scale: 1.15,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    // Optimistic UI update
    setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));

    try {
      const token = await getToken();
      if (!token) return;
      const reqHeader = { Authorization: `Bearer ${token}` };
      const res = await updateOrderStatusAPI(orderId, { orderStatus: newStatus }, reqHeader);
      if (res.status === 200 && res.data.success) {
        showFeedback(`Order updated to "${newStatus}" ✓`, false);
      } else {
        showFeedback(res.data.message || 'Update failed.', true);
        fetchAllOrders(); // revert on failure
      }
    } catch (err) {
      showFeedback(err.response?.data?.message || 'Failed to update order.', true);
      fetchAllOrders(); // revert on failure
    }
  };

  const showFeedback = (msg, isError = false) => {
    setToast({ show: true, message: msg, isError });
    setTimeout(() => setToast({ show: false, message: '', isError: false }), 3000);
  };

  // Filter by search query
  const filteredOrders = (orders || []).filter(o => {
    if (!o) return false;
    const q = (searchQuery || '').toLowerCase();
    const productNames = (o.items || []).map(i => i.product?.name || '').join(' ').toLowerCase();

    const idMatches = o._id ? o._id.toLowerCase().includes(q) : false;
    const clerkMatches = o.clerkId ? o.clerkId.toLowerCase().includes(q) : false;
    const statusMatches = o.orderStatus ? o.orderStatus.toLowerCase().includes(q) : false;
    const productMatches = productNames.includes(q);

    return idMatches || clerkMatches || productMatches || statusMatches;
  });

  useEffect(() => {
    if (loading) return;
    if (!tableRef.current) return;
    if (filteredOrders.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(".order-row", {
        opacity: 0,
        y: 25,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "all",
      });
    }, tableRef);

    return () => ctx.revert();
  }, [loading, filteredOrders]);


  

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900 ">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
              />
            </div>
            <button
              onClick={fetchAllOrders}
              className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium transition active:scale-95 shadow-sm"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', val: orders.length, color: 'text-blue-600' },
            { label: 'Pending', val: orders.filter(o => o.orderStatus === 'Pending').length, color: 'text-amber-600' },
            { label: 'Processing', val: orders.filter(o => o.orderStatus === 'Processing').length, color: 'text-blue-500' },
            { label: 'Delivered', val: orders.filter(o => o.orderStatus === 'Delivered').length, color: 'text-emerald-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
            <Loader2 size={36} className="text-blue-500 animate-spin mr-3" />
            <span className="text-slate-500 font-medium">Loading orders...</span>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center gap-3 p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700">
            <AlertTriangle size={22} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Table Section */}
        {!loading && !error && (
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
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center text-slate-400 font-medium">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders?.map((order, index) => {
                      const productSummary =
                        order?.items
                          ?.filter(Boolean)
                          .map((item) => {
                            return `${item?.product?.name || "Product"} (x${item?.quantity || 0})`;
                          })
                          .join(", ") || "—";
                      const shortId = `#AQ-${order._id?.slice(-5).toUpperCase()}`;
                      const shortCustomer =
                        order?.clerkId
                          ? order.clerkId.length > 14
                            ? order.clerkId.slice(0, 14) + "..."
                            : order.clerkId
                          : "Unknown";
                      return (

                        <tr key={order?._id} className="order-row border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors group ">
                          <td className="px-6 py-5 font-bold text-blue-600 font-mono text-sm"><div>{shortId}</div></td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                {order?.clerkId?.[5]?.toUpperCase() || "U"}                              </div>
                              <span className="font-medium text-slate-700 text-xs truncate max-w-[120px]" title={order?.clerkId}>
                                {shortCustomer}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center text-slate-500 text-sm max-w-[220px]">
                              <td>TEXT</td>
                            </div>
                          </td>
                          <td className="px-6 py-5 font-bold text-slate-900">
                            ₹{order.totalAmount?.toLocaleString() || '0'}
                          </td>
                          <td className="px-6 py-5">
                            <span
                              id={`badge-${index}`}
                              className={`status-badge inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border transition-all duration-300 ${getStatusStyles(order.orderStatus)}`}
                            >
                              {getStatusIcon(order.orderStatus)}
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={order.orderStatus}
                                onChange={(e) => updateStatus(order._id, e.target.value, index)}
                                className="text-xs bg-slate-50 border border-slate-200 rounded p-1 text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
                                <MoreHorizontal size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}

                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer info */}
        {!loading && !error && (
          <div className="mt-6 flex items-center justify-between text-sm text-slate-500 px-2">
            <p>Showing {filteredOrders.length} of {orders.length} orders</p>
          </div>
        )}
      </div>

      {/* Animated Toast Notification */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-white text-sm font-medium shadow-2xl flex items-center gap-3 transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} ${toast.isError ? 'bg-red-600' : 'bg-slate-900'}`}
      >
        <div className={`w-2 h-2 rounded-full animate-pulse ${toast.isError ? 'bg-red-300' : 'bg-emerald-400'}`} />
        {toast.message}
      </div>
    </div>
  );


};

export default Orders;