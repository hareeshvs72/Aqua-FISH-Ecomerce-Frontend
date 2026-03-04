import React from 'react'
import SideBar from '../component/SideBar'
import { Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <div className='flex  h-screen overflow-y-auto flex-1'>
        
        <SideBar/>
<div className='flex flex-col flex-1'>
    
            <main className='flex-1 overflow-y-auto'>
                <Outlet/>
            </main>
</div>

    </div>
  )
}

export default AdminLayout