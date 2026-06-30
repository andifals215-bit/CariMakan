import React, { useContext, useState, useEffect, useRef } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { formatIDR } from '../utils/price';
import CheckoutModal from './CheckoutModal';
import ReceiptModal from './ReceiptModal';
import AuthModal from './AuthModal';

function CartDrawer() {
    const { 
        cart, 
        isCartOpen, 
        setIsCartOpen, 
        removeFromCart, 
        updateQuantity, 
        cartTotal,
        cartCount,
        clearCart 
    } = useContext(CartContext);

    const { user } = useContext(AuthContext);

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [latestOrder, setLatestOrder] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const drawerRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsCartOpen(false);
        };
        if (isCartOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isCartOpen, setIsCartOpen]);

    const handleCheckoutClick = () => {
        if (!user) {
            // User must login first
            setIsAuthModalOpen(true);
            return;
        }
        // Proceed to checkout flow
        setIsCheckoutOpen(true);
    };

    const handleOrderSuccess = (order) => {
        setIsCheckoutOpen(false);
        setLatestOrder(order);
        setIsReceiptOpen(true);
    };

    const handleCloseReceipt = () => {
        setIsReceiptOpen(false);
        setLatestOrder(null);
        setIsCartOpen(false); // close cart drawer as well
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
                    isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Drawer */}
            <div 
                ref={drawerRef}
                className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-out flex flex-col ${
                    isCartOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-orange-50/80 to-amber-50/60">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Keranjang Anda
                        </h2>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">
                            {cartCount > 0 ? `${cartCount} item • ${cart.length} produk` : 'Belum ada item'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-5">
                            <div className="w-28 h-28 rounded-full bg-gray-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-gray-500">Keranjang masih kosong</p>
                                <p className="text-sm text-gray-400 mt-1">Yuk, cari makanan favoritmu!</p>
                            </div>
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                            >
                                Mulai Belanja →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Clear All Button */}
                            <div className="flex justify-end mb-2">
                                <button 
                                    onClick={clearCart}
                                    className="text-xs text-gray-400 hover:text-red-500 font-semibold flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Hapus Semua
                                </button>
                            </div>

                            {cart.map((item, index) => (
                                <div 
                                    key={item.idMeal} 
                                    className="flex gap-4 p-3 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-all duration-300 group"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <img 
                                        src={item.strMealThumb} 
                                        alt={item.strMeal} 
                                        className="w-20 h-20 object-cover rounded-xl shadow-sm flex-shrink-0"
                                    />
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-sm line-clamp-1 leading-tight">{item.strMeal}</h3>
                                            {item.strCategory && (
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.strCategory}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            {/* Quantity Control */}
                                            <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm">
                                                <button 
                                                    onClick={() => updateQuantity(item.idMeal, -1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors rounded-l-xl hover:bg-red-50 font-bold"
                                                >
                                                    {item.quantity === 1 ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    ) : '−'}
                                                </button>
                                                <span className="w-8 text-center font-black text-sm text-gray-800 select-none">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.idMeal, 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary transition-colors rounded-r-xl hover:bg-orange-50 font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <span className="font-black text-sm text-primary">{formatIDR(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / Checkout */}
                {cart.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gradient-to-t from-gray-50 to-white">
                        {/* Summary */}
                        <div className="space-y-2 mb-5">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Subtotal ({cartCount} item)</span>
                                <span className="text-gray-600 font-bold">{formatIDR(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 font-medium">Ongkos Kirim</span>
                                <span className="text-emerald-500 font-bold">Gratis ✓</span>
                            </div>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 font-bold text-base">Total Bayar</span>
                                <span className="text-2xl font-black text-primary">{formatIDR(cartTotal)}</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button 
                            onClick={handleCheckoutClick}
                            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2.5 text-base mb-3"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Checkout & Bayar Sekarang
                        </button>
                        
                        <button 
                            onClick={() => setIsCartOpen(false)}
                            className="w-full py-3 text-sm text-gray-500 hover:text-primary font-bold transition-colors rounded-xl hover:bg-orange-50"
                        >
                            ← Lanjut Belanja
                        </button>
                    </div>
                )}
            </div>

            {/* Local Auth Modal (in case guest clicks checkout) */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            {/* Checkout Wizard Modal */}
            <CheckoutModal 
                isOpen={isCheckoutOpen} 
                onClose={() => setIsCheckoutOpen(false)} 
                onOrderSuccess={handleOrderSuccess}
            />

            {/* Digital Cashier Receipt Modal */}
            <ReceiptModal 
                isOpen={isReceiptOpen} 
                order={latestOrder} 
                onClose={handleCloseReceipt}
            />
        </>
    );
}

export default CartDrawer;
