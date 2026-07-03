import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  MapPin,
  CreditCard,
  ChevronRight,
  X,
  TrendingUp,
  ShoppingCart,
  RotateCcw,
  RefreshCw,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { getMyOrdersAPI } from '../../Service/allApi';

// ---------------------------------------------------------
// Helper: generate a visual timeline from orderStatus
// ---------------------------------------------------------
const buildTimeline = (orderStatus, createdAt) => {
  const ALL_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const statusIndex = ALL_STEPS.indexOf(orderStatus);

  if (orderStatus === 'Cancelled') {
    return [
      { status: 'Order Placed', date: new Date(createdAt).toLocaleString(), completed: true,  active: false },
      { status: 'Cancelled',    date: 'Order was cancelled',                completed: true,  active: true  },
    ];
  }

  return ALL_STEPS.map((step, idx) => ({
    status: step,
    date: idx === 0 ? new Date(createdAt).toLocaleString()
        : idx <= statusIndex ? `Step completed`
        : 'Pending',
    completed: idx <= statusIndex,
    active: idx === statusIndex,
  }));
};

// ---------------------------------------------------------
// Main Component
// ---------------------------------------------------------
export default function UserOrder() {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('All Orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMessage, setToastMessage]   = useState(null);

  const { getToken, isSignedIn, isLoaded } = useAuth();

  // ---- Fetch my orders from backend ----
  const fetchMyOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      if (!token) { setError('Please sign in to view your orders.'); setLoading(false); return; }
      const reqHeader = { Authorization: `Bearer ${token}` };
      const res = await getMyOrdersAPI(reqHeader);
      if (res.status === 200 && res.data.success) {
        setOrders(res.data.data);
      } else {
        setError(res.data?.message || 'Failed to load orders.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchMyOrders();
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get("payment");
      if (paymentStatus === "success") {
        triggerToast("Payment successful! Your order is being processed.");
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (paymentStatus === "cancel") {
        triggerToast("Payment cancelled. Your order remains pending.");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
    else if (isLoaded && !isSignedIn) { setError('Please sign in to view your orders.'); setLoading(false); }
  }, [isLoaded, isSignedIn]);

  // ---- Toast ----
  const triggerToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ---- Status Badge ----
  const getStatusBadge = (status) => {
    const styles = {
      Delivered:         'bg-emerald-50 text-emerald-700 border-emerald-200',
      Processing:        'bg-amber-50 text-amber-700 border-amber-200',
      Pending:           'bg-yellow-50 text-yellow-700 border-yellow-200',
      Shipped:           'bg-sky-50 text-sky-700 border-sky-200',
      'Out for Delivery':'bg-purple-50 text-purple-700 border-purple-200',
      Cancelled:         'bg-rose-50 text-rose-700 border-rose-200',
    };
    const icons = {
      Delivered:         <CheckCircle className="w-3.5 h-3.5 mr-1" />,
      Processing:        <Clock className="w-3.5 h-3.5 mr-1 animate-pulse" />,
      Pending:           <Clock className="w-3.5 h-3.5 mr-1 animate-pulse" />,
      Shipped:           <Package className="w-3.5 h-3.5 mr-1" />,
      'Out for Delivery':<Truck className="w-3.5 h-3.5 mr-1" />,
      Cancelled:         <XCircle className="w-3.5 h-3.5 mr-1" />,
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  // ---- Filter & Search ----
  const filteredOrders = orders.filter(order => {
    const shortId = order._id?.slice(-6).toUpperCase();
    const productNames = order.items?.map(i => i.product?.name || '').join(' ').toLowerCase();
    const matchesSearch =
      shortId?.includes(searchTerm.toUpperCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productNames.includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All Orders' || order.orderStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  // ---- Stats ----
  const stats = {
    total:     orders.length,
    pending:   orders.filter(o => ['Pending', 'Processing', 'Shipped', 'Out for Delivery'].includes(o.orderStatus)).length,
    delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
    spent:     orders.filter(o => o.orderStatus !== 'Cancelled').reduce((acc, o) => acc + (o.totalAmount || 0), 0).toFixed(2),
  };

  // ---- Helpers ----
  const getProductImage = (item) =>
    item?.product?.images?.[0] || item?.product?.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=150&auto=format&fit=crop&q=80';

  const formatAddress = (addr) => {
    if (!addr) return 'N/A';
    const { address, city, state, pincode, country } = addr;
    return [address, city, state, pincode, country].filter(Boolean).join(', ');
  };

  const formatOrderId = (id) => `#AQ-${id?.slice(-6).toUpperCase()}`;

  // ==========================================================
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans antialiased selection:bg-[#E53935]/10 selection:text-[#E53935]">

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#111111] text-white p-4 rounded-xl shadow-xl border border-neutral-800 flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-[#E53935] animate-ping flex-shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 pt-24 md:pt-32 pb-24 space-y-8">

        {/* ---- Page Header ---- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#111111]">My Orders</h1>
            <p className="text-sm text-neutral-500 mt-0.5">Track and manage all your Aqua Store purchases</p>
          </div>
          <button
            onClick={fetchMyOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* ---- STATS CARDS ---- */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-neutral-100 space-y-3 shadow-sm animate-pulse">
                <div className="h-4 w-1/3 bg-neutral-200 rounded" />
                <div className="h-8 w-2/3 bg-neutral-300 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Orders',  val: stats.total,     color: '',              icon: <Package className="w-12 h-12" />,    sub: 'All time history' },
              { label: 'Pending',       val: stats.pending,   color: 'text-[#E53935]',icon: <Clock className="w-12 h-12" />,      sub: 'In transit / prep' },
              { label: 'Delivered',     val: stats.delivered, color: 'text-emerald-600', icon: <CheckCircle className="w-12 h-12" />, sub: 'Successful shipments' },
              { label: 'Amount Spent',  val: `₹${stats.spent}`, color: '',            icon: <TrendingUp className="w-12 h-12" />, sub: 'Secured transactions' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-neutral-200/60 shadow-sm relative overflow-hidden group hover:border-neutral-300 transition-all duration-300">
                <div className="absolute right-3 top-3 opacity-10 group-hover:scale-110 transition-transform text-[#111111]">
                  {stat.icon}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{stat.label}</p>
                <p className={`text-3xl font-black mt-2 tracking-tight ${stat.color}`}>{stat.val}</p>
                <div className="mt-2 text-[11px] text-neutral-500">{stat.sub}</div>
              </div>
            ))}
          </section>
        )}

        {/* ---- SEARCH + FILTER BAR ---- */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200/60 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by Order ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 text-sm rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#111111] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#111111] text-xs font-medium">
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 hidden lg:inline-block">Filter:</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111111] cursor-pointer"
              >
                <option value="All Orders">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ---- LOADING SKELETONS ---- */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-neutral-100 space-y-6 shadow-sm animate-pulse">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                  <div className="space-y-2 w-1/3">
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  </div>
                  <div className="h-6 bg-neutral-200 rounded-full w-20" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-neutral-300 rounded w-2/3" />
                    <div className="h-3 bg-neutral-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- ERROR STATE ---- */}
        {!loading && error && (
          <div className="flex items-center gap-3 p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700">
            <AlertTriangle size={22} className="flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* ---- EMPTY STATE ---- */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-white border border-neutral-200/60 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-12">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-[#111111] mb-2">No Orders Found</h3>
            <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
              {orders.length === 0
                ? "You haven't placed any orders yet. Start shopping to see them here!"
                : "No orders match your current search or filter."}
            </p>
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('All Orders'); }}
              className="inline-flex items-center px-6 py-3 bg-[#E53935] hover:bg-[#c62828] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#E53935]/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {orders.length === 0 ? 'Start Shopping' : 'Clear Filters'}
            </button>
          </div>
        )}

        {/* ---- ORDER CARDS ---- */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const address = formatAddress(order.shippingAddress);
              const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

              return (
                <div
                  key={order._id}
                  className="bg-white border border-neutral-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="bg-neutral-50/50 px-6 py-4 border-b border-neutral-100 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">Order Reference</span>
                        <span className="text-sm font-bold font-mono tracking-tight text-[#111111]">{formatOrderId(order._id)}</span>
                      </div>
                      <div className="h-6 w-px bg-neutral-200" />
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">Date Ordered</span>
                        <span className="text-sm font-semibold text-neutral-600">{orderDate}</span>
                      </div>
                      <div className="h-6 w-px bg-neutral-200 hidden sm:block" />
                      <div className="hidden sm:block">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">Payment</span>
                        <span className="text-sm font-semibold text-neutral-600 capitalize">{order.paymentStatus || 'Pending'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(order.orderStatus)}
                    </div>
                  </div>

                  {/* Items & Shipping */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Item list */}
                    <div className="lg:col-span-7 space-y-4">
                      {order.items?.map((item, index) => {
                        const product = item.product || {};
                        const imgSrc = getProductImage(item);
                        return (
                          <div key={index} className="flex items-start space-x-4 group/item">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/80 flex-shrink-0 transition-transform group-hover/item:scale-105">
                              <img
                                src={imgSrc}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=150&auto=format&fit=crop&q=80';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-[#111111] truncate group-hover/item:text-[#E53935] transition-colors">
                                {product.name || 'Product'}
                              </h4>
                              <p className="text-xs text-neutral-500 mt-1">
                                Qty: <span className="font-semibold text-neutral-700">{item.quantity}</span>
                                {' '}&middot;{' '}
                                Unit Price: <span className="font-semibold text-neutral-700">₹{(item.price || 0).toLocaleString()}</span>
                              </p>
                              <p className="text-xs font-bold text-[#111111] mt-0.5">
                                Item Total: ₹{((item.price || 0) * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Delivery Info + Pricing */}
                    <div className="lg:col-span-5 bg-neutral-50/40 p-4 rounded-xl border border-neutral-100 space-y-3.5 text-xs">
                      <div className="flex items-start space-x-2 text-neutral-600">
                        <MapPin className="w-4 h-4 text-[#E53935] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#111111] block mb-0.5">Shipping Address</span>
                          <span className="line-clamp-2 leading-relaxed">{address}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-neutral-600">
                        <CreditCard className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#111111] block mb-0.5">Payment Status</span>
                          <span className="capitalize">{order.paymentStatus || 'Pending'}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-sm">
                        <span className="font-bold text-neutral-500">Order Total:</span>
                        <span className="text-base font-black text-[#E53935]">₹{(order.totalAmount || 0).toLocaleString()}</span>
                      </div>
                    </div>

                  </div>

                  {/* Footer Actions */}
                  <div className="px-6 py-4 bg-white border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 text-xs font-bold bg-[#111111] hover:bg-neutral-800 text-white rounded-lg transition-all inline-flex items-center hover:translate-x-0.5"
                    >
                      Track Order &amp; Details
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </button>

                    <div className="flex items-center space-x-2">
                      {order.orderStatus === 'Delivered' && (
                        <button
                          onClick={() => triggerToast(`Reorder for order ${formatOrderId(order._id)} noted!`)}
                          className="px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:text-white border border-neutral-200 hover:bg-[#111111] rounded-lg transition-all inline-flex items-center"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Footer count */}
        {!loading && !error && orders.length > 0 && (
          <p className="text-center text-sm text-neutral-400">
            Showing <span className="font-bold text-[#111111]">{filteredOrders.length}</span> of <span className="font-bold text-[#111111]">{orders.length}</span> orders
          </p>
        )}

      </main>

      {/* ---- ORDER DETAIL MODAL ---- */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-[#111111]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-[#111111] text-white flex-shrink-0">
              <div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">Live Tracking</span>
                <h3 className="text-lg font-bold tracking-tight">{formatOrderId(selectedOrder._id)}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">

              {/* Quick Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200/50">
                <div>
                  <span className="text-xs font-bold text-neutral-400 block uppercase">Order Status</span>
                  <div className="mt-1">{getStatusBadge(selectedOrder.orderStatus)}</div>
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-400 block uppercase">Payment</span>
                  <span className="text-sm font-bold text-[#111111] capitalize">{selectedOrder.paymentStatus || 'Pending'}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-400 block uppercase">Items</span>
                  <span className="text-sm font-bold text-[#111111]">
                    {selectedOrder.items?.reduce((acc, i) => acc + i.quantity, 0)} units
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-400 block uppercase">Ordered On</span>
                  <span className="text-sm font-bold text-[#111111]">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-6">Delivery Progress</h4>
                <div className="relative pl-8 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-100">
                  {buildTimeline(selectedOrder.orderStatus, selectedOrder.createdAt).map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${step.active ? 'ring-4 ring-[#E53935]/20 border-[#E53935] bg-[#E53935]'
                          : step.completed ? 'bg-[#111111] border-[#111111] text-white shadow-md'
                          : 'bg-white border-neutral-200 text-neutral-400'}`}
                      >
                        {step.completed ? <CheckCircle className="w-3 h-3 text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />}
                      </div>
                      <div className="pl-2">
                        <h5 className={`text-sm font-bold ${step.active ? 'text-[#E53935]' : 'text-[#111111]'}`}>{step.status}</h5>
                        <p className="text-xs text-neutral-500 mt-0.5">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Item Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Items Ordered</h4>
                <div className="border border-neutral-100 rounded-xl divide-y divide-neutral-100">
                  {selectedOrder.items?.map((item, index) => {
                    const product = item.product || {};
                    return (
                      <div key={index} className="p-3.5 flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          <img
                            src={getProductImage(item)}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg bg-neutral-100 border border-neutral-200"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=150&auto=format&fit=crop&q=80'; }}
                          />
                          <div>
                            <span className="font-bold text-[#111111] block line-clamp-1">{product.name || 'Product'}</span>
                            <span className="text-xs text-neutral-500">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-neutral-700">₹{((item.price || 0) * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                  <div className="p-3.5 bg-neutral-50/50 flex justify-between font-bold text-sm">
                    <span>Order Total</span>
                    <span className="text-[#E53935]">₹{(selectedOrder.totalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/50 space-y-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide block">Shipping Destination</span>
                <div className="flex items-start space-x-2 text-sm text-neutral-700">
                  <MapPin className="w-4 h-4 text-[#E53935] mt-0.5 flex-shrink-0" />
                  <span>{formatAddress(selectedOrder.shippingAddress)}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-neutral-100 flex flex-wrap gap-2 items-center justify-end flex-shrink-0">
              <button
                onClick={() => { setSelectedOrder(null); triggerToast('Closing order details.'); }}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-[#111111] text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
