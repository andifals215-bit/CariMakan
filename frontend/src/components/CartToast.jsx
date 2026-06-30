import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function CartToast() {
    const { lastAdded } = useContext(CartContext);

    if (!lastAdded) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[60] animate-slide-up">
            <div className="bg-white border border-green-100 shadow-2xl rounded-2xl px-5 py-4 flex items-center gap-4 max-w-xs">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                    <img 
                        src={lastAdded.thumb} 
                        alt={lastAdded.name} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Ditambahkan ke keranjang!
                    </p>
                    <p className="text-sm font-bold text-gray-800 line-clamp-1 mt-0.5">{lastAdded.name}</p>
                </div>
            </div>
        </div>
    );
}

export default CartToast;
