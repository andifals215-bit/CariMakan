import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import FoodDetail from './pages/FoodDetail';
import CartDrawer from './components/CartDrawer';
import CartToast from './components/CartToast';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <div className="flex flex-col min-h-screen relative">
          <Header />
          <CartDrawer />
          <CartToast />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/detail/:id" element={<FoodDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;


