import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { getPrice, formatIDR, getRating, getItemsSold, getPromoTag } from '../utils/price';
import { getMealDetail } from '../utils/api';

function FoodDetail() {
    const id = useParams().id;
    const navigate = useNavigate();
    const { addToCart, cart } = useContext(CartContext);
    
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedFeedback, setAddedFeedback] = useState(false);
    
    // Check if item already in cart
    const cartItem = cart.find(item => item.idMeal === id);
    const price = meal ? getPrice(meal.idMeal) : 0;
    const rating = meal ? getRating(meal.idMeal) : '0';
    const sold = meal ? getItemsSold(meal.idMeal) : 0;
    const promo = meal ? getPromoTag(meal.idMeal) : null;

    useEffect(() => {
        const fetchMealDetail = async () => {
            try {
                setLoading(true);
                const data = await getMealDetail(id);
                if (data.meals && data.meals.length > 0) {
                    setMeal(data.meals[0]);
                } else {
                    setError("Makanan tidak ditemukan");
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching detail:", err);
                setError("Gagal Memuat Data Detail. Pastikan Backend berjalan.");
                setLoading(false);
            }
        };
        fetchMealDetail();
    }, [id]);

    const handleAddToCart = () => {
        if (meal) {
            addToCart(meal, price, quantity);
            setAddedFeedback(true);
            setTimeout(() => setAddedFeedback(false), 1500);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary"></div>
            </div>
        );
    }

    if (error || !meal) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || "Makanan tidak ditemukan"}</h2>
                <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
                    &larr; Kembali ke Beranda
                </button>
            </div>
        );
    }

    // Extract ingredients
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`] && meal[`strIngredient${i}`].trim() !== '') {
            ingredients.push({
                ingredient: meal[`strIngredient${i}`],
                measure: meal[`strMeasure${i}`]
            });
        }
    }

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-500 hover:text-primary font-medium transition-colors group">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Kembali
            </button>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="lg:flex">
                    {/* Image Section */}
                    <div className="lg:w-1/2 relative">
                        <img 
                            src={meal.strMealThumb} 
                            alt={meal.strMeal} 
                            className="w-full h-full object-cover min-h-[400px] lg:min-h-full"
                        />
                        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                            <span className="bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                                {meal.strCategory}
                            </span>
                            <span className="bg-primary/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
                                {meal.strArea}
                            </span>
                            {promo && (
                                <span className={`backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider ${promo.class}`}>
                                    {promo.text}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-center">
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 leading-tight">{meal.strMeal}</h1>
                        
                        {/* Rating & Sales */}
                        <div className="flex items-center gap-4 mb-5 flex-wrap">
                            <span className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100/60 text-sm font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {rating}
                            </span>
                            <span className="text-gray-400 text-sm font-semibold flex items-center gap-1.5">
                                <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                                Terjual {sold}+
                            </span>
                            {cartItem && (
                                <span className="text-primary text-sm font-bold flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100/60">
                                    🛒 {cartItem.quantity} di keranjang
                                </span>
                            )}
                        </div>

                        <p className="text-gray-500 mb-8 text-base leading-relaxed">
                            Nikmati kelezatan <span className="font-semibold text-gray-700">{meal.strMeal}</span> yang otentik, hidangan khas {meal.strArea} yang menggugah selera.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gradient-to-r from-orange-50/80 to-amber-50/40 rounded-2xl mb-6 border border-orange-100/50">
                            <div className="mb-4 sm:mb-0">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Harga Spesial</p>
                                <p className="text-3xl font-black text-primary">{formatIDR(price)}</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors text-xl font-bold rounded-l-xl hover:bg-orange-50"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-black text-gray-800 text-lg">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors text-xl font-bold rounded-r-xl hover:bg-orange-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Subtotal */}
                        {quantity > 1 && (
                            <div className="flex items-center justify-between mb-4 px-2">
                                <span className="text-sm text-gray-400 font-medium">Subtotal ({quantity} item)</span>
                                <span className="text-lg font-black text-gray-800">{formatIDR(price * quantity)}</span>
                            </div>
                        )}

                        <button 
                            onClick={handleAddToCart}
                            disabled={addedFeedback}
                            className={`w-full py-4 px-6 rounded-2xl font-black text-white shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 text-lg ${
                                addedFeedback 
                                    ? 'bg-emerald-500 shadow-emerald-500/25' 
                                    : 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-primary/30'
                            }`}
                        >
                            {addedFeedback ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Berhasil Ditambahkan!
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {cartItem ? `Tambahkan Lagi (+${quantity})` : 'Masukkan ke Keranjang'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
                
                {/* Info Tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-gray-100">
                    <div className="p-8 lg:p-12 lg:col-span-1 bg-gray-50 border-r border-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                            <span className="text-2xl">🥗</span> Komposisi Bahan
                        </h3>
                        <ul className="space-y-3">
                            {ingredients.map((item, index) => (
                                <li key={index} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-orange-100 transition-colors">
                                    <span className="font-semibold text-gray-800">{item.ingredient}</span>
                                    <span className="text-gray-500 text-sm bg-gray-50 px-2 py-1 rounded-md">{item.measure}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="p-8 lg:p-12 lg:col-span-2">
                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                            <span className="text-2xl">👨‍🍳</span> Cara Memasak
                        </h3>
                        <div className="prose prose-lg max-w-none text-gray-600">
                            {meal.strInstructions.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                                <p key={index} className="mb-4 leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                        
                        {meal.strYoutube && (
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <a 
                                    href={meal.strYoutube} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold transition-colors bg-red-50 px-5 py-3 rounded-xl hover:bg-red-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    Tonton Video Tutorial di YouTube
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FoodDetail;
