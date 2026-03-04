import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    ShoppingBag,
    Layers,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, isActive, onClick, index, setRefs }) => {
    const iconRef = useRef(null);

    useEffect(() => {
        if (setRefs && setRefs.current) {
            setRefs.current[index] = iconRef.current?.parentElement;
        }
    }, [index, setRefs]);

    const handleMouseEnter = () => {
        if (window.gsap) {
            window.gsap.to(iconRef.current, {
                scale: 1.2,
                color: "#ef4444",
                duration: 0.3,
                ease: "power2.out"
            });
        }
    };

    const handleMouseLeave = () => {
        if (window.gsap) {
            window.gsap.to(iconRef.current, {
                scale: 1,
                color: "inherit",
                duration: 0.3,
                ease: "power2.out"
            });
        }
    };

    return (
        <div
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group
        ${isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
                    : 'text-zinc-400 hover:bg-red-500/10 hover:text-white'
                }
      `}
        >
            <div ref={iconRef} className="flex-shrink-0 transition-colors">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>

            <span className={`text-sm font-medium tracking-wide transition-opacity duration-300`}>
                {label}
            </span>

            {isActive && (
                <div className="ml-auto">
                    <ChevronRight size={14} className="animate-pulse" />
                </div>
            )}

            {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
            )}
        </div>
    );
};

const SideBar = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [gsapLoaded, setGsapLoaded] = useState(false);

    const sidebarRef = useRef(null);
    const menuItemsRef = useRef([]);
    const logoRef = useRef(null);
    const overlayRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const navItems = [
        { id: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { id: 'Products', icon: ShoppingBag, path: '/admin/product' },
        { id: 'Categories', icon: Layers, path: '/admin/category' },
        { id: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
        { id: 'Users', icon: Users, path: '/admin/users' },
        { id: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    ];

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
        script.async = true;
        script.onload = () => setGsapLoaded(true);
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (!gsapLoaded || !window.gsap) return;

        const gsap = window.gsap;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

            tl.fromTo(sidebarRef.current,
                { x: -280, opacity: 0 },
                { x: 0, opacity: 1, duration: 1 }
            );

            tl.fromTo(logoRef.current,
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5 },
                "-=0.5"
            );

            tl.fromTo(menuItemsRef.current,
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
                "-=0.3"
            );
        });

        return () => ctx.revert();
    }, [gsapLoaded]);

    useEffect(() => {
        if (!window.gsap) return;
        const gsap = window.gsap;

        if (window.innerWidth < 1024) {
            if (isMobileOpen) {
                gsap.to(sidebarRef.current, { x: 0, duration: 0.5, ease: "power2.out" });
                gsap.to(overlayRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.3 });
            } else {
                gsap.to(sidebarRef.current, { x: -280, duration: 0.5, ease: "power2.in" });
                gsap.to(overlayRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.3 });
            }
        }
    }, [isMobileOpen]);

    return (
        <div className="min-h-screen bg-zinc-50 flex font-sans text-zinc-900 overflow-hidden">
            {/* Mobile Menu Toggle Button (visible only on small screens) */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden fixed top-6 left-6 z-30 p-2 bg-black text-white rounded-lg shadow-xl"
            >
                <Menu size={20} />
            </button>

            {/* Mobile Overlay */}
            <div
                ref={overlayRef}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden opacity-0 pointer-events-none transition-opacity"
            />

            {/* Sidebar Component */}
            <aside
                ref={sidebarRef}
                className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-black flex flex-col p-6
          lg:translate-x-0 lg:static transform transition-none
        `}
            >
                {/* Top Section - Logo */}
                <div ref={logoRef} className="mb-10 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-900/40">
                            <span className="font-black text-xl italic">A</span>
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-xl tracking-tight leading-none">
                                Aqua <span className="text-red-600">Admin</span>
                            </h1>
                            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1 font-semibold">
                                Store Dashboard
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 h-[2px] w-12 bg-red-600 rounded-full" />
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                    {navItems.map((item, index) => (
                        <SidebarItem
                            key={item.id}
                            index={index}
                            icon={item.icon}
                            label={item.id}
                            isActive={location.pathname === item.path}
                            onClick={() => {
                                navigate(item.path);
                                if (window.innerWidth < 1024) setIsMobileOpen(false);
                            }}
                            setRefs={menuItemsRef}
                        />
                    ))}
                </nav>

                {/* Bottom Section - Logout */}
                <div className="pt-6 mt-6 border-t border-zinc-800">
                    <button className="flex items-center gap-4 px-4 py-3 w-full text-zinc-500 hover:text-red-500 transition-all group">
                        <div className="group-hover:translate-x-1 transition-transform">
                            <LogOut size={20} />
                        </div>
                        <span className="text-sm font-semibold tracking-wide">Logout</span>
                    </button>
                </div>
            </aside>



            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
      `}} />
        </div>
    );
};

export default SideBar;