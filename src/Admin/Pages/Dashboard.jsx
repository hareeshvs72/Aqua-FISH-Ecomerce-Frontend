import React, { useEffect, useRef, useState } from 'react';
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
  ArrowUpRight
} from 'lucide-react';

const Dashboard = () => {
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const statsRef = useRef(null);
  const contentRef = useRef(null);

  // Load GSAP via CDN to avoid resolution errors
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

    // Fade-in stagger animation for stat cards
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

    // Slide-up animation for the table and chart sections
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
  }, [gsapLoaded]);

  const stats = [
    { label: 'Total Fish Products', value: '1,284', icon: Fish, trend: '+12%' },
    { label: 'Total Accessories', value: '452', icon: Package, trend: '+5%' },
    { label: 'Total Orders', value: '89', icon: ShoppingCart, trend: '+18%' },
    { label: 'Total Revenue', value: '$12,450', icon: DollarSign, trend: '+24%' },
  ];

  const recentOrders = [
    { id: '#ORD-7721', customer: 'Alex Rivers', product: 'Neon Tetra x20', status: 'Delivered', amount: '$45.00' },
    { id: '#ORD-7722', customer: 'Sarah Chen', product: 'Premium Coral Food', status: 'Pending', amount: '$32.50' },
    { id: '#ORD-7723', customer: 'Mike Ross', product: 'LED Reef Light', status: 'Shipped', amount: '$210.00' },
    { id: '#ORD-7724', customer: 'Elena Gilbert', product: 'Betta Splendens', status: 'Delivered', amount: '$15.00' },
  ];

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
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search data..." 
              className="bg-transparent border-none outline-none text-sm ml-2 w-48"
            />
          </div>
          <div className="relative cursor-pointer">
            <Bell className="w-5 h-5 text-gray-400 hover:text-black transition-colors" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          </div>
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer border border-gray-200">
            <User className="w-4 h-4" />
          </div>
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
          
          {/* Sales Overview Chart (Visual Representation) */}
          <div className="lg:col-span-2 p-8 rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Revenue Growth</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-bold border border-black rounded-full">Weekly</button>
                <button className="px-3 py-1 text-xs font-bold text-gray-400 hover:text-black transition-colors">Monthly</button>
              </div>
            </div>
            
            {/* Mock Chart Visual */}
            <div className="h-64 flex items-end justify-between gap-3 px-2">
              {[35, 60, 40, 85, 55, 75, 45, 95, 50, 70, 80, 35].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div className="w-full relative">
                     <div 
                      className="w-full bg-gray-100 group-hover:bg-red-600 transition-all duration-300 rounded-t-sm" 
                      style={{ height: `${h}%` }}
                    ></div>
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      ${h * 10}
                    </div>
                  </div>
                  <span className="text-[10px] mt-2 text-gray-400 font-bold group-hover:text-black">
                    {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                  </span>
                </div>
              ))}
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
                  <p className="text-xs text-gray-400">5 tropical fish types low</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">Filter Supplies</p>
                  <p className="text-xs text-gray-400">Order arriving 4:00 PM</p>
                </div>
              </div>
              <hr className="border-white/10" />
              <div className="pt-2">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-3xl font-black text-red-500 leading-none">98.4%</p>
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Customer Happiness</p>
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
              <button className="text-sm font-bold text-red-600 hover:underline">View All Sales</button>
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
                  {recentOrders.map((order, idx) => (
                    <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-5 font-bold text-sm">{order.id}</td>
                      <td className="py-5 text-sm font-medium">{order.customer}</td>
                      <td className="py-5 text-sm text-gray-500 italic">{order.product}</td>
                      <td className="py-5">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                          order.status === 'Delivered' ? 'bg-green-50 text-green-700' : 
                          order.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-5 font-bold text-red-600">{order.amount}</td>
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