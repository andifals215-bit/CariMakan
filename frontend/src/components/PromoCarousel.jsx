import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { getPrice, formatIDR, getPromoTag } from '../utils/price';

function PromoCarousel({ meals }) {
    const scrollContainerRef = useRef(null);

    // Filter only meals that have a promo tag
    const promoMeals = meals.filter(meal => getPromoTag(meal.idMeal) !== null).slice(0, 8);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = 340; // width of card + gap
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (promoMeals.length === 0) return null;

    return (
        <div className="mb-14 relative z-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <span className="text-3xl">🔥</span> Promo Spesial Hari Ini
                    </h3>
                    <p className="text-gray-500 text-sm font-medium mt-1">Paket hemat dan potongan harga menarik khusus untuk Anda.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-xl bg-white hover:bg-orange-50 text-gray-700 hover:text-primary flex items-center justify-center border border-gray-200/80 shadow-sm active:scale-95 transition-all duration-300"
                        aria-label="Scroll left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-xl bg-white hover:bg-orange-50 text-gray-700 hover:text-primary flex items-center justify-center border border-gray-200/80 shadow-sm active:scale-95 transition-all duration-300"
                        aria-label="Scroll right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Carousel Container */}
            <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {promoMeals.map(meal => {
                    const price = getPrice(meal.idMeal);
                    const promo = getPromoTag(meal.idMeal);
                    const originalPrice = price * 1.25; // fake original price before discount

                    return (
                        <div 
                            key={meal.idMeal}
                            className="w-[300px] sm:w-[320px] shrink-0 snap-start bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-orange-100/40 hover:shadow-[0_20px_40px_rgba(249,115,22,0.1)] hover:-translate-y-1.5 transition-all duration-500 group flex flex-col"
                        >
                            <Link to={`/detail/${meal.idMeal}`} className="relative h-44 block overflow-hidden">
                                <img 
                                    src={meal.strMealThumb} 
                                    alt={meal.strMeal}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                
                                {/* Promo Tag */}
                                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black shadow-sm uppercase tracking-wider ${promo.class} border border-white/20`}>
                                    {promo.text}
                                </div>
                            </Link>

                            <div className="p-5 flex flex-col flex-grow">
                                <span className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1.5">{meal.strCategory}</span>
                                <Link to={`/detail/${meal.idMeal}`} className="hover:text-primary transition-colors">
                                    <h4 className="font-extrabold text-base text-gray-800 line-clamp-1 mb-2 group-hover:text-primary transition-colors duration-300">
                                        {meal.strMeal}
                                    </h4>
                                </Link>
                                
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-red-500 font-extrabold text-sm px-2 py-0.5 bg-red-50 rounded-md border border-red-100/50">
                                        -20%
                                    </span>
                                    <span className="text-gray-400 line-through text-xs font-semibold">
                                        {formatIDR(originalPrice)}
                                    </span>
                                </div>

                                <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100/60">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Harga Promo</span>
                                        <span className="font-black text-base text-primary">{formatIDR(price)}</span>
                                    </div>
                                    <Link 
                                        to={`/detail/${meal.idMeal}`} 
                                        className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                                    >
                                        Klaim Promo
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PromoCarousel;
