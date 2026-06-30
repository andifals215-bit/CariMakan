import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { getPrice, formatIDR, getRating, getItemsSold, getPromoTag } from '../utils/price';

function FoodCard({ meal }) {
    const { addToCart } = useContext(CartContext);
    const price = getPrice(meal.idMeal);
    const rating = getRating(meal.idMeal);
    const sold = getItemsSold(meal.idMeal);
    const promo = getPromoTag(meal.idMeal);

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(249,115,22,0.12)] transition-all duration-500 overflow-hidden group border border-gray-200/50 hover:border-primary/20 flex flex-col h-full hover:-translate-y-2">
            <Link to={`/detail/${meal.idMeal}`} className="relative overflow-hidden aspect-[4/3] block">
                <img 
                    src={meal.strMealThumb} 
                    alt={meal.strMeal} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                
                {/* Promo Badge */}
                {promo && (
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black shadow-md uppercase tracking-wider ${promo.class} border border-white/20`}>
                        {promo.text}
                    </div>
                )}

                {/* Category Tag */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-gray-700 shadow-sm uppercase tracking-wider border border-white/40">
                    {meal.strCategory || 'Kategori'}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white text-gray-800 text-xs font-extrabold px-4 py-2 rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Detail Resep &rarr;
                    </span>
                </div>
            </Link>
            
            <div className="p-5 flex flex-col flex-grow">
                <Link to={`/detail/${meal.idMeal}`} className="hover:text-primary transition-colors duration-300">
                    <h3 className="font-extrabold text-base sm:text-lg text-gray-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300 mb-2">{meal.strMeal}</h3>
                </Link>
                
                {/* Rating & Sold */}
                <div className="flex items-center gap-3 mb-4 text-xs font-semibold">
                    <span className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100/60">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {rating}
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                        Terjual {sold}+
                    </span>
                </div>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100/60">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Harga</span>
                        <span className="font-black text-lg text-primary leading-none">{formatIDR(price)}</span>
                    </div>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(meal, price);
                        }}
                        className="bg-orange-50 hover:bg-primary text-primary hover:text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90 border border-orange-100/50 shadow-sm hover:shadow-md"
                        title="Tambah ke Keranjang"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FoodCard;
