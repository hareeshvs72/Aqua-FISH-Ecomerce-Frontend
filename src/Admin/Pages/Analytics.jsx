import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Download, Activity, ShoppingBag, DollarSign, Users, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const containerRef = useRef(null);
  const kpiRef = useRef(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);

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

    // Entrance animation for KPI cards
    const cards = kpiRef.current.querySelectorAll('.kpi-card');
    gsap.fromTo(
      cards,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
    );

    // Scroll animation for chart containers
    const containers = containerRef.current.querySelectorAll('.animate-on-scroll');
    containers.forEach((container) => {
      gsap.fromTo(
        container,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, [gsapLoaded]);

  // Chart Data Configurations
  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12500, 19000, 15000, 22000, 28000, 24000, 32000],
        borderColor: '#2563eb',
        borderWidth: 3,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
          gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');
          return gradient;
        },
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
      },
    ],
  };

  const ordersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Orders',
        data: [65, 85, 70, 110, 130, 155],
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  };

  const topSellingData = {
    labels: ['Betta', 'Angelfish', 'Guppy', 'Goldfish'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ['#2563eb', '#8b5cf6', '#f59e0b', '#10b981'],
        borderWidth: 0,
        hoverOffset: 20,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Analytics</h1>
            <p className="text-slate-500 mt-1">Real-time performance metrics for your aquatic empire.</p>
          </div>
          <div className="flex items-center gap-3">
            {!gsapLoaded && <Loader2 className="animate-spin text-blue-600" size={20} />}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
              <Download size={16} />
              Download Report
            </button>
            <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Live View
            </button>
          </div>
        </header>

        {/* KPI Cards */}
        <div ref={kpiRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KPICard title="Total Revenue" value="$42,850.00" trend="+12.5%" icon={<DollarSign className="text-blue-600" />} bgColor="bg-blue-50" />
          <KPICard title="Total Orders" value="1,284" trend="+8.2%" icon={<ShoppingBag className="text-purple-600" />} bgColor="bg-purple-50" />
          <KPICard title="Avg. Order Value" value="$33.37" trend="-2.1%" icon={<Activity className="text-orange-600" />} bgColor="bg-orange-50" negative />
          <KPICard title="New Customers" value="412" trend="+18%" icon={<Users className="text-emerald-600" />} bgColor="bg-emerald-50" />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="animate-on-scroll bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Revenue Stream</h2>
              <select className="text-sm border-none bg-slate-50 rounded-lg p-1 px-2 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[300px]">
              <Line data={salesData} options={commonOptions} />
            </div>
          </div>

          <div className="animate-on-scroll bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:translate-y-[-4px] transition-transform duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Monthly Order Volume</h2>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-xs text-slate-400">Completed</span>
              </div>
            </div>
            <div className="h-[300px]">
              <Bar data={ordersData} options={commonOptions} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="animate-on-scroll bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-1">
            <h2 className="text-lg font-bold mb-6">Top Selling Fish</h2>
            <div className="h-[300px]">
              <Doughnut 
                data={topSellingData} 
                options={{
                  ...commonOptions,
                  cutout: '75%',
                  plugins: { legend: { display: true, position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
                }} 
              />
            </div>
          </div>

          <div className="animate-on-scroll bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Inventory Performance</h2>
              <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-sm uppercase tracking-wider">
                    <th className="pb-4 font-medium">Species</th>
                    <th className="pb-4 font-medium">Category</th>
                    <th className="pb-4 font-medium">Growth</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <InventoryRow name="Blue Tang" cat="Saltwater" val={85} color="bg-blue-500" status="High Demand" />
                  <InventoryRow name="Neon Tetra" cat="Freshwater" val={62} color="bg-purple-500" status="Stable" />
                  <InventoryRow name="Discus Fish" cat="Freshwater" val={45} color="bg-orange-500" status="Refill Soon" warning />
                  <InventoryRow name="Clownfish" cat="Saltwater" val={92} color="bg-emerald-500" status="High Demand" />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner structure
const KPICard = ({ title, value, trend, icon, bgColor, negative }) => (
  <div className="kpi-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 ${bgColor} rounded-lg`}>{icon}</div>
      <div className={`flex items-center text-xs font-bold ${negative ? 'text-rose-500' : 'text-emerald-500'}`}>
        {negative ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
        {trend}
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

const InventoryRow = ({ name, cat, val, color, status, warning }) => (
  <tr className="border-t border-slate-50">
    <td className="py-4 font-semibold text-slate-700">{name}</td>
    <td className="py-4 text-slate-500">{cat}</td>
    <td className="py-4">
      <div className="w-full bg-slate-100 h-1.5 rounded-full max-w-[100px]">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${val}%` }}></div>
      </div>
    </td>
    <td className="py-4">
      <span className={`px-2 py-1 rounded-md text-xs font-bold ${warning ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
        {status}
      </span>
    </td>
  </tr>
);

export default Analytics;