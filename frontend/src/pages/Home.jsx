import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import FoodCard from '../components/FoodCard';
import PromoCarousel from '../components/PromoCarousel';
import Testimonials from '../components/Testimonials';
import { getPrice, getRating, getItemsSold } from '../utils/price';
import { getMeals } from '../utils/api';

function Home() {
    const [meals, setMeals] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('default');

    const categories = ['All', 'Beef', 'Chicken', 'Dessert', 'Seafood', 'Vegetarian'];

    const sortOptions = [
        { value: 'default', label: 'Urutkan' },
        { value: 'price_low', label: 'Harga Terendah' },
        { value: 'price_high', label: 'Harga Tertinggi' },
        { value: 'rating', label: 'Rating Tertinggi' },
        { value: 'popular', label: 'Paling Populer' }
    ];

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setLoading(true);
                const data = await getMeals();
                setMeals(data.meals || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Gagal Memuat Data Server. Pastikan Backend berjalan.");
                setLoading(false);
            }
        };
        fetchMeals();
    }, []);

    // Filter meals
    let filteredMeals = meals.filter(meal => {
        const matchesQuery = meal.strMeal.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = activeCategory === 'All' || meal.strCategory === activeCategory;
        return matchesQuery && matchesCategory;
    });

    // Sort meals
    if (sortBy !== 'default') {
        filteredMeals = [...filteredMeals].sort((a, b) => {
            switch (sortBy) {
                case 'price_low':
                    return getPrice(a.idMeal) - getPrice(b.idMeal);
                case 'price_high':
                    return getPrice(b.idMeal) - getPrice(a.idMeal);
                case 'rating':
                    return parseFloat(getRating(b.idMeal)) - parseFloat(getRating(a.idMeal));
                case 'popular':
                    return getItemsSold(b.idMeal) - getItemsSold(a.idMeal);
                default:
                    return 0;
            }
        });
    }

    return (
        <div className="pb-12 relative min-h-screen">
            {/* Background Radial Grid Pattern & Ambient Blobs */}
            <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none -z-20"></div>
            
            {/* Dynamic Ambient Blurs */}
            <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-orange-200/40 to-amber-100/30 filter blur-[90px] animate-float-slow -z-10 pointer-events-none"></div>
            <div className="absolute top-[40%] right-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-amber-200/35 to-orange-100/30 filter blur-[100px] animate-float-reverse -z-10 pointer-events-none"></div>
            <div className="absolute bottom-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-orange-100/30 filter blur-[80px] animate-float-slow -z-10 pointer-events-none"></div>

            {/* Hero Section */}
            <div className="relative rounded-[2rem] overflow-hidden bg-gray-900 text-white mb-12 shadow-2xl border border-gray-800/10">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
                        alt="Hero Food" 
                        className="w-full h-full object-cover opacity-35"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                </div>
                
                <div className="relative z-10 px-6 py-20 sm:px-12 sm:py-28 max-w-4xl mx-auto text-center">
                    <span className="inline-block bg-primary/20 text-primary border border-primary/30 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest backdrop-blur-sm shadow-sm animate-pulse">
                        🍽️ Kuliner Global Terbaik
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight drop-shadow-md tracking-tight">
                        Temukan Sensasi <span className="text-primary">Rasa Baru</span> Setiap Hari
                    </h2>
                    <p className="text-base sm:text-lg text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-sm font-medium">
                        Jelajahi ribuan resep dan menu makanan lezat dari seluruh dunia. Pesan sekarang dan nikmati tanpa batas!
                    </p>
                    
                    <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg max-w-2xl mx-auto">
                        <SearchBar query={query} setQuery={setQuery} />
                    </div>
                </div>
            </div>

            {/* Promo Carousel Section */}
            {!loading && !error && meals.length > 0 && (
                <PromoCarousel meals={meals} />
            )}

            {/* Category Filter + Sort */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 relative z-10">
                {/* Categories */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-95 ${
                                activeCategory === cat 
                                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-[0_8px_20px_-4px_rgba(249,115,22,0.4)] scale-105 border border-primary' 
                                : 'bg-white/70 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-primary border border-gray-200/80 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.02)] hover:shadow-md hover:scale-[1.02]'
                            }`}
                        >
                            {cat === 'All' ? 'Semua Menu' : cat}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <div className="relative flex-shrink-0">
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-bold pl-4 pr-10 py-2.5 rounded-2xl border border-gray-200/80 shadow-sm hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-primary"></div>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-10 rounded-2xl text-center max-w-lg mx-auto shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="font-bold text-xl mb-2">Terjadi Kesalahan</p>
                    <p className="text-red-500/80 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-xl font-semibold transition-colors"
                    >
                        Coba Muat Ulang
                    </button>
                </div>
            )}
            
            {!loading && !error && filteredMeals.length === 0 && (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Oops, tidak ditemukan!</h3>
                    <p className="text-gray-500 max-w-md mx-auto">Kami tidak menemukan hidangan yang cocok dengan pencarian <span className="font-bold text-primary">"{query}"</span> di kategori <span className="font-bold text-gray-700">{activeCategory}</span>.</p>
                    <button 
                        onClick={() => { setQuery(''); setActiveCategory('All'); setSortBy('default'); }}
                        className="mt-6 text-primary hover:text-primary-dark font-semibold hover:underline"
                    >
                        Reset Pencarian
                    </button>
                </div>
            )}
            
            {!loading && !error && filteredMeals.length > 0 && (
                <>
                    {/* Results Count */}
                    <div className="mb-6 relative z-10">
                        <p className="text-sm font-semibold text-gray-500">
                            Menampilkan <span className="text-gray-800 font-black">{filteredMeals.length}</span> menu
                            {activeCategory !== 'All' && <> dalam kategori <span className="text-primary font-black">{activeCategory}</span></>}
                            {sortBy !== 'default' && <span className="text-gray-400"> • Diurutkan: {sortOptions.find(s => s.value === sortBy)?.label}</span>}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
                        {filteredMeals.map(meal => (
                            <FoodCard key={meal.idMeal} meal={meal} />
                        ))}
                    </div>
                </>
            )}

            {/* Testimonials Section */}
            {!loading && !error && (
                <Testimonials />
            )}
        </div>
    );
}

export default Home;
