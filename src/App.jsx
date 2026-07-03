import { lazy, Suspense } from 'react';
import { Routes, Route } from "react-router-dom";

import './App.css';
import Preloader from './components/Preloader';
import Pnf from './components/Pnf';
import MainLayout from './user/component/MainLayout';
import Fish from './user/pages/Fish';
import Accessories from './user/pages/Accessories';
import Cart from './user/pages/Cart';
import ProductView from './user/pages/ProductView';
import UserOrder from './user/pages/UserOrder';

import AdminLayout from './Admin/Layout/AdminLayout';
import Dashboard from './Admin/Pages/Dashboard';
import Product from './Admin/Pages/Product'
import Category from './Admin/Pages/Category';
import Orders from './Admin/Pages/Oders';
import Users from './Admin/Pages/Users';
import Analytics from './Admin/Pages/Analytics';
import AddProduct from './Admin/component/AddProduct';
import AuthSync from './user/component/AuthSync';
import UserRoute from './user/component/UserRoute';

// ✅ Lazy-loaded pages
const Home = lazy(() => import('./user/pages/Home'));
const About = lazy(() => import('./user/pages/About'));
const Contact = lazy(() => import('./user/pages/Contact'));


function App() {
  return (
    <>
      <AuthSync />
      <Suspense fallback={<Preloader />}>
        <Routes>

          {/* User Store Pages (Restricted from Admins) */}
          <Route element={<UserRoute><MainLayout /></UserRoute>}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/fish" element={<Fish />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/orders" element={<UserOrder />} />
          </Route>

          <Route path="/cart" element={<UserRoute><Cart /></UserRoute>} />
          <Route path="/view/:id/aqua" element={<UserRoute><ProductView /></UserRoute>} />

          {/* admin start  */}
       
            <Route path='/admin' element={<AdminLayout />} >
              <Route index element={<Dashboard />} />
              <Route path='product' element={<Product />} />
              <Route path='category' element={<Category />} />
              <Route path='orders' element={<Orders />} />
              <Route path='users' element={<Users />} />
              <Route path='analytics' element={<Analytics />} />
            </Route>
            <Route path='/admin/:id/editProduct' element={<AddProduct />} />
    

          {/* 404 */}
          <Route path="*" element={<Pnf />} />
        </Routes>
      </Suspense>

    </>
  );
}

export default App;
