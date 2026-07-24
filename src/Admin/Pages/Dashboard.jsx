import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Fish,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  MoreVertical,
  ChevronRight,
  User,
  Bell,
  Search,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import {
  getDashboardAPI,
  getWeeklyRevenueAPI,
  getMonthlyRevenueAPI,
} from "../../Service/allApi";
import { useAuth } from "@clerk/clerk-react";
import Loading from '../component/Loading';

const Dashboard = () => {
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const statsRef = useRef(null);
  const contentRef = useRef(null);
  const { getToken } = useAuth();

  const [dashboard, setDashboard] = useState({});
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [chartType, setChartType] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load GSAP via CDN
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js')
    ]).then(() => {
      setGsapLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!gsapLoaded || !window.gsap) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    if (statsRef.current && statsRef.current.children) {
      const cards = statsRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2
        }
      );
    }

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 85%",
          }
        }
      );
    }
  }, [gsapLoaded]);

  // ---- API calls ----
  useEffect(() => {
    getDashboard();
    getWeeklyRevenue();
    getMonthlyRevenue();
  }, []);

  const getDashboard = async () => {
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const result = await getDashboardAPI(headers);

      if (result.status === 200) {
        setDashboard(result.data);
      } else {
        console.log(result);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWeeklyRevenue = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const result = await getWeeklyRevenueAPI(headers);

      if (result.status === 200) {
        setWeeklyRevenue(result.data);
        console.log("weekly" , result.data);
        
      } else {
        console.error("Failed to fetch weekly revenue:", result);
      }
    } catch (error) {
      console.error("Error fetching weekly revenue:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyRevenue = async () => {
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const result = await getMonthlyRevenueAPI(headers);

      if (result.status === 200) {
        setMonthlyRevenue(result.data);
        console.log(result.data);
        
      } else {
        console.error("Failed to fetch monthly revenue:", result);
      }
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
    } finally {
      console.log("MONTHLY API request completed.");
      setLoading(false); // If you have a loading state
    }
  };

  const stats = [
    {
      label: "Total Fish Products",
      value: dashboard?.cards?.totalFishProducts || 0,
      icon: Fish,
      trend: "+12%",
    },
    {
      label: "Total Accessories",
      value: dashboard?.cards?.totalAccessories || 0,
      icon: Package,
      trend: "+5%",
    },
    {
      label: "Total Orders",
      value: dashboard?.cards?.totalOrders || 0,
      icon: ShoppingCart,
      trend: "+18%",
    },
    {
      label: "Total Revenue",
      value: `₹${dashboard?.cards?.totalRevenue || 0}`,
      icon: DollarSign,
      trend: "+24%",
    },
  ];

  const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const weeklyChart = Array(7).fill(0);
  weeklyRevenue?.forEach((item) => {
    if (item._id && item._id >= 1 && item._id <= 7) {
      weeklyChart[item._id - 1] = item.revenue;
    }
  });

  const monthlyChart = Array(12).fill(0);
  monthlyRevenue?.forEach((item) => {
    if (item._id && item._id >= 1 && item._id <= 12) {
      monthlyChart[item._id - 1] = item.revenue;
    }
  });

  const chartData = chartType === "weekly" ? weeklyChart : monthlyChart;
  const labels = chartType === "weekly" ? weekLabels : monthLabels;
  const maxRevenue = Math.max(...chartData, 1);

  // SVG dimensions & padding calculation
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 30;

  const points = chartData.map((val, idx) => {
    const x = padding + (idx / Math.max(chartData.length - 1, 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - (val / maxRevenue) * (svgHeight - padding * 2);
    return { x, y, value: val, label: labels[idx] };
  });

  const linePathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  const areaPathD = points.length > 0
    ? `${linePathD} L ${points[points.length - 1].x},${svgHeight - padding} L ${points[0].x},${svgHeight - padding} Z`
    : "";
  {/* Loading State */}
     
 if(loading) {
  return(
    <div>
     <div className="flex items-center justify-center py-20 h-screen bg-white rounded-2xl border border-slate-200">
            <Loader2 size={36} className="text-red-500 animate-spin mr-3" />
            <span className="text-slate-500 font-medium">Loading Dashboard...</span>
          </div>
   </div>
  )
 }
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-red-100">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <Fish className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight uppercase">AquaStore</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-gray-500">Welcome back. Your aquarium inventory and sales are looking healthy today.</p>
        </header>

        {/* Stats Grid */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-red-500 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-red-50 transition-colors">
                  <stat.icon className="w-6 h-6 text-black group-hover:text-red-600 transition-colors" />
                </div>
                <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded">
                  <span className="text-[10px] font-black">{stat.trend}</span>
                  <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-black group-hover:text-red-600 transition-colors">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Dynamic Content Section */}
        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sales Overview Chart (SVG Vector Line Chart) */}
          <div className="lg:col-span-2 p-8 rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Revenue Growth</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType("weekly")}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                    chartType === "weekly"
                      ? "border border-black bg-black text-white"
                      : "text-gray-400 hover:text-black"
                  }`}
                >
                  Weekly
                </button>

                <button
                  onClick={() => setChartType("monthly")}
                  className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                    chartType === "monthly"
                      ? "border border-black bg-black text-white"
                      : "text-gray-400 hover:text-black"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="relative w-full h-64 flex items-center justify-center">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const yVal = padding + ratio * (svgHeight - padding * 2);
                  return (
                    <line
                      key={i}
                      x1={padding}
                      y1={yVal}
                      x2={svgWidth - padding}
                      y2={yVal}
                      stroke="#f3f4f6"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* Smooth area fill */}
                {areaPathD && (
                  <path d={areaPathD} fill="url(#gradientArea)" />
                )}

                {/* Main connected chart line */}
                {linePathD && (
                  <path
                    d={linePathD}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Node points and interactive tooltips */}
                {points.map((pt, i) => (
                  <g key={i} className="group/node cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      className="fill-white stroke-red-600 stroke-[3] transition-all duration-200 group-hover/node:r-7"
                    />
                    <text
                      x={pt.x}
                      y={svgHeight - 8}
                      textAnchor="middle"
                      className="text-[10px] fill-gray-400 font-bold"
                    >
                      {pt.label}
                    </text>

                    {/* Tooltip bubble on hover */}
                    <g className="opacity-0 group-hover/node:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <rect
                        x={pt.x - 32}
                        y={pt.y - 34}
                        width="64"
                        height="22"
                        rx="6"
                        className="fill-black"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 20}
                        textAnchor="middle"
                        className="text-[10px] fill-white font-bold"
                      >
                        ₹{pt.value}
                      </text>
                    </g>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Quick Insights / Active Items */}
          <div className="p-8 rounded-3xl border border-gray-100 bg-black text-white shadow-sm">
            <h2 className="text-xl font-bold mb-6">Quick Insights</h2>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Live Stock Alert</p>
                  <p className="text-xs text-gray-400">
                    {dashboard?.quickInsights?.lowStockProducts?.length > 0
                      ? `${dashboard.quickInsights.lowStockProducts.length} products are low in stock`
                      : "No low stock products"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Pending Orders</p>
                  <p className="text-xs text-gray-400">
                    {dashboard?.quickInsights?.pendingOrders || 0} orders pending
                  </p>
                </div>
              </div>

              <hr className="border-white/10" />

              <div className="pt-2">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-3xl font-black text-red-500 leading-none">
                    {dashboard?.quickInsights?.pendingOrders || 0}
                  </p>
                </div>

                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                  Pending Orders
                </p>
              </div>

              <button className="w-full py-4 mt-2 bg-white text-black rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                Generate Monthly PDF <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="lg:col-span-3 p-8 rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Recent Store Activity</h2>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-sm font-bold text-red-600 hover:underline"
              >
                View All Sales
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 font-bold text-xs text-gray-400 uppercase tracking-widest">Order ID</th>
                    <th className="pb-4 font-bold text-xs text-gray-400 uppercase tracking-widest">Client</th>
                    <th className="pb-4 font-bold text-xs text-gray-400 uppercase tracking-widest">Inventory Item</th>
                    <th className="pb-4 font-bold text-xs text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="pb-4 font-bold text-xs text-gray-400 uppercase tracking-widest">Gross</th>
                    <th className="pb-4 font-bold text-xs text-gray-400 uppercase tracking-widest text-right">More</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dashboard?.recentOrders?.map((order) => (
                    <tr
                      key={order._id}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-5 font-bold text-sm">
                        #{order._id.slice(-6)}
                      </td>
                      <td className="py-5 text-sm font-medium">
                        {order.user?.name}
                      </td>
                      <td className="py-5 text-sm text-gray-500 italic">
                        {order.items
                          ?.map((item) => item.product?.name || "Product Deleted")
                          .join(", ")}
                      </td>
                      <td className="py-5">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                            order.orderStatus === "Delivered"
                              ? "bg-green-50 text-green-700"
                              : order.orderStatus === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : order.orderStatus === "Cancelled"
                              ? "bg-red-50 text-red-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-5 font-bold text-red-600">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-5 text-right">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
