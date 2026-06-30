import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Header() {
    const { cartCount, toggleCart } = useContext(CartContext);
    const [bounce, setBounce] = useState(false);

    // Trigger bounce animation when cartCount changes
    useEffect(() => {
        if (cartCount > 0) {
            setBounce(true);
            const timer = setTimeout(() => setBounce(false), 500);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    return (
        <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300 border-b border-orange-100/50 shadow-[0_2px_20px_-3px_rgba(0,0,0,0.04)]">
            <div className="container mx-auto px-4 py-3.5 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-2.5 rounded-xl shadow-md shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-gray-800 tracking-tight">Cari<span className="text-primary">Makan</span></h1>
                </Link>

                <div className="flex items-center gap-4">
                    {/* Cart Button */}
                    <button 
                        onClick={toggleCart}
                        className={`relative flex items-center p-2.5 text-gray-600 hover:text-primary transition-all duration-300 focus:outline-none bg-gray-50/80 hover:bg-orange-50 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md ${
                            bounce ? 'scale-110' : 'scale-100'
                        }`}
                        aria-label="Buka Keranjang"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cartCount > 0 && (
                            <>
                                <span className="absolute -top-1 -right-1 bg-primary rounded-full h-5 w-5 animate-ping opacity-50"></span>
                                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-primary to-red-500 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            </>
                        )}
                    </button>

                    {/* User Avatar Placeholder */}
                    <div className="hidden sm:flex w-9 h-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-100 items-center justify-center text-gray-500 overflow-hidden shadow-inner border border-gray-200 cursor-pointer hover:shadow-md hover:border-orange-200 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
