import { useClerk, useUser } from '@clerk/clerk-react';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Dynamic GSAP Loader for smooth aquatic transitions
const loadGSAP = () => {
  return new Promise((resolve) => {
    if (window.gsap) {
      resolve(window.gsap);
      return;
    }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => resolve(window.gsap);
    document.head.appendChild(script);
  });
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
 

  const {user,isSignedIn} = useUser()
const { openSignUp, openSignIn, signOut ,openUserProfile} = useClerk()
 

  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);

   const navigate =  useNavigate()

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Fish', href: '/fish' },
    { name: 'Accessories', href: '/accessories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];
  const userActions = [
    { name: 'My Profile', href: () => openUserProfile() },
    { name: 'Orders', href: () => navigate('/orders')  },
    { name: 'Settings', href:  () => navigate('/settings')  },
  ];

  useEffect(() => {
    loadGSAP().then(() => setIsReady(true));
  }, []);

  // Main Header Animations
  useEffect(() => {
    if (!isReady || !window.gsap) return;

    const gsap = window.gsap;
    const ctx = gsap.context(() => {
      gsap.fromTo(".header-container",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "expo.out" }
      );
      gsap.fromTo(".nav-item",
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", delay: 0.5 }
      );
      gsap.fromTo(".logo-anim",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.3 }
      );
    }, headerRef);

    return () => ctx.revert();
  }, [isReady]);

  // User Dropdown Animation
  useEffect(() => {
    if (!isReady || !window.gsap || !userMenuRef.current) return;
    const gsap = window.gsap;

    if (isUserMenuOpen) {
      gsap.to(userMenuRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
        pointerEvents: "auto"
      });
    } else {
      gsap.to(userMenuRef.current, {
        opacity: 0,
        y: -10,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        pointerEvents: "none"
      });
    }
  }, [isUserMenuOpen, isReady]);

  // Mobile Menu Animation
  useEffect(() => {
    if (!isReady || !window.gsap) return;
    const gsap = window.gsap;

    if (isMenuOpen) {
      gsap.to(menuRef.current, { x: 0, duration: 0.6, ease: "expo.out" });
      gsap.fromTo(".mobile-link",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, delay: 0.2, ease: "back.out(1.7)" }
      );
    } else {
      gsap.to(menuRef.current, { x: "100%", duration: 0.5, ease: "expo.in" });
    }
  }, [isMenuOpen, isReady]);

  // Search Animation
  useEffect(() => {
    if (!isReady || !window.gsap) return;
    const gsap = window.gsap;

    if (isSearchOpen) {
      gsap.to(searchRef.current, {
        y: 0,
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.6,
        ease: "expo.out"
      });
      setTimeout(() => searchInputRef.current?.focus(), 300);
    } else {
      gsap.to(searchRef.current, {
        y: -20,
        opacity: 0,
        pointerEvents: "none",
        duration: 0.4,
        ease: "expo.in"
      });
    }
  }, [isSearchOpen, isReady]);

  const renderLogo = () => (
    <div className="logo-anim flex items-center gap-2 group cursor-pointer" onClick={() => setActiveIdx(0)}>
      <div className="relative">
        <svg width="30" height="30" viewBox="0 0 40 40" fill="none" className="group-hover:rotate-12 transition-transform duration-500">
          <path d="M5 20C5 20 12 10 22 10C32 10 38 20 38 20C38 20 32 30 22 30C12 30 5 20 5 20Z" stroke="black" strokeWidth="2.5" />
          <circle cx="28" cy="18" r="2" fill="#dc2626" />
          <path d="M5 20L0 12V28L5 20Z" fill="black" />
        </svg>
      </div>
      <span className="text-base font-black tracking-tighter uppercase italic text-zinc-900">
        AQUA<span className="text-red-600">STORE</span>
      </span>
    </div>
  );

  return (
    <header
      ref={headerRef}
      className="header-container  bg-white  fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] rounded-full mt-6 mx-4 px-10 max-w-6xl lg:mx-auto border border-zinc-50 font-sans selection:bg-red-600 selection:text-white"
    >
      <nav className="h-16 lg:h-20 flex items-center justify-between relative">

        {/* Logo */}
        {renderLogo()}

        {/* Desktop Nav */}
        <ul className={`hidden md:flex items-center gap-8 lg:gap-12 transition-opacity duration-300 ${isSearchOpen ? "opacity-0" : "opacity-100"}`}>
          {navLinks.map((link, idx) => (
            <li key={link.name} className="nav-item relative group py-2">
              <Link
                to={link.href}
                onClick={() => setActiveIdx(idx)}
                className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.25em]
    ${activeIdx === idx ? "text-red-600" : "text-zinc-400 group-hover:text-black"}`}
              >
                {link.name}
              </Link>

              <div
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-red-600 transition-all duration-300 ease-out
                  ${activeIdx === idx ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"}`}
              />
            </li>
          ))}
        </ul>

        {/* Utils & Auth */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 nav-item text-zinc-900">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`transition-colors duration-300 relative group z-10 p-1 ${isSearchOpen ? 'text-red-600' : 'text-zinc-400 hover:text-black'}`}
          >
            {isSearchOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            )}
          </button>

          {/* Auth Section */}
          <div className="relative">
            {!isSignedIn  ? (
              <button
               onClick={() => openSignIn()}
                className="text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full border-2 border-zinc-100 hover:border-black hover:bg-black hover:text-white transition-all duration-300 active:scale-95"
              >
                Login
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 p-1 rounded-full transition-all duration-300 ${isUserMenuOpen ? 'ring-2 ring-red-600 ring-offset-2' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
                    {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> */}
                     {user?.imageUrl && (
            <img src={user.imageUrl} alt="profile" className="w-full h-full object-cover" />
          ) }
                  </div>
                  <svg className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </button>

                {/* User Dropdown Menu */}
                <div
                  ref={userMenuRef}
                  className="absolute right-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl border border-zinc-100 py-3 opacity-0 scale-95 origin-top-right pointer-events-none"
                >
                  <div className="px-4 py-2 border-b border-zinc-50 mb-2">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-zinc-400">Welcome back</p>
                    <p className="text-xs font-bold truncate">{user?.firstName}</p>
                  </div>
                  {userActions.map((action) => (
                    <a
                      key={action.name}
                      onClick={action.href}
                      className="block px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-600 hover:bg-red-50/50 transition-colors"
                    >
                      {action.name}
                    </a>
                  ))}
                  <button
                     onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 mt-2 border-t border-zinc-50 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          <button onClick={()=>navigate('/cart')} className="bg-black text-white p-2.5 rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-red-600/30 active:scale-90">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
          </button>
        </div>

        {/* Search Overlay */}
        <div
          ref={searchRef}
          className="absolute inset-0 flex items-center justify-center bg-white rounded-full opacity-0 translate-y-[-20px] pointer-events-none"
        >
          <div className="w-full max-w-2xl px-12 flex items-center gap-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="SEARCH SPECIES, ACCESSORIES..."
              className="w-full bg-transparent border-none outline-none text-xs font-black uppercase tracking-[0.2em] placeholder:text-zinc-200 text-black"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 z-[60] p-2"
        >
          <div className={`h-[2px] bg-black transition-all duration-300 ${isMenuOpen ? 'w-6 rotate-45 translate-y-2 bg-red-600' : 'w-6'}`} />
          <div className={`h-[2px] bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-4'}`} />
          <div className={`h-[2px] bg-black transition-all duration-300 ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-2 bg-red-600' : 'w-6'}`} />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 bg-white z-50 translate-x-full md:hidden flex flex-col items-center justify-center gap-8"
      >
        <div className="absolute top-10 left-10 opacity-20 text-[10px] font-black uppercase tracking-[1em] rotate-90 origin-left text-black">
          Navigation Menu
        </div>
        {navLinks.map((link, idx) => (
          <Link
            to={link.href}
            onClick={() => {
              setIsMenuOpen(false);
              setActiveIdx(idx);
            }}
            className={`mobile-link text-4xl font-black uppercase tracking-tighter
    ${activeIdx === idx ? 'text-red-600' : 'text-black hover:text-red-600'}`}
          >
            {link.name}
          </Link>

        ))}
        {!isSignedIn  ? (
          <button
            onClick={() => {
              openSignIn();
              // setIsLoggedIn(true);
              // setIsMenuOpen(false);
            }}
            className="mobile-link mt-4 text-xl font-black uppercase border-2 border-black px-10 py-3 rounded-full hover:bg-black hover:text-white transition-all"
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => {
              // setIsLoggedIn(false);
              // setIsMenuOpen(false);
              signOut()
            }}
            className="mobile-link mt-4 text-xl font-black uppercase text-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};


export default Header;
export const App = () => (
  <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
    <div className="text-center px-10">
      <h1 className="text-6xl font-black uppercase tracking-tighter italic text-zinc-200">Interactive Header</h1>
      <p className="mt-4 text-zinc-400 font-bold uppercase text-[10px] tracking-[0.5em]">Click Login to test the dropdown</p>
    </div>
  </div>
);