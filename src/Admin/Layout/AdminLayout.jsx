import React, { useState } from 'react'
import SideBar from '../component/SideBar'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'

function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className='flex h-screen flex-1 overflow-hidden bg-slate-50'>
        {/* Pass mobile toggle state down to sidebar */}
        <SideBar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        
        <div className='flex flex-col flex-1 h-screen overflow-hidden'>
            {/* Mobile Header Bar */}
            <header className='lg:hidden flex items-center justify-between px-6 py-4 bg-black text-white border-b border-zinc-800 z-30 shadow-md'>
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className='p-1.5 hover:bg-zinc-800 rounded-lg text-white transition-colors cursor-pointer'
                    >
                        <Menu size={20} />
                    </button>
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-md">
                        <span className="font-black text-sm italic">A</span>
                    </div>
                    <span className='font-bold text-md tracking-tight'>Aqua Admin</span>
                </div>
            </header>

            <main className='flex-1 overflow-y-auto'>
                <Outlet/>
            </main>
        </div>
    </div>
  )
}

export default AdminLayout