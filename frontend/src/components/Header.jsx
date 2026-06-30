import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import AuthModal from './AuthModal';

function Header() {
    const { cartCount, toggleCart } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [bounce, setBounce] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Trigger bounce animation when cartCount changes
    useEffect(() => {
        if (cartCount > 0) {
            setBounce(true);
            const timer = setTimeout(() => setBounce(false), 500);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    };

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

                    {/* Authentication Logic Profile Avatar Dropdown */}
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 p-1 bg-gray-50 border border-gray-200 rounded-full hover:border-primary/40 focus:outline-none transition-all cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-amber-400 text-white flex items-center justify-center font-black text-sm uppercase shadow-sm">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="hidden md:inline text-xs font-black text-gray-700 pr-2 select-none">{user.name}</span>
                            </button>

                            {/* Dropdown Options */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-2.5 w-48 bg-white border border-orange-100 rounded-2xl shadow-xl py-2 z-50 animate-slide-up">
                                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Masuk Sebagai</p>
                                        <p className="text-xs font-extrabold text-gray-800 line-clamp-1">{user.name}</p>
                                    </div>
                                    
                                    {/* Admin Specific Action Link */}
                                    {user.role === 'admin' && (
                                        <Link 
                                            to="/admin" 
                                            onClick={() => setShowDropdown(false)}
                                            className="flex items-center gap-2 px-4 py-2 text-xs font-black text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors"
                                        >
                                            🔑 Dashboard Admin
                                        </Link>
                                    )}

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-black text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        🚪 Keluar Akun
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white text-xs font-black px-4.5 py-2.5 rounded-xl shadow-md shadow-primary/15 transition-all duration-300 active:scale-95 cursor-pointer"
                        >
                            Masuk / Daftar
                        </button>
                    )}
                </div>
            </div>

            {/* Global Auth Modal portal */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </header>
    );
}

export default Header;
