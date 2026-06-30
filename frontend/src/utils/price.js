// Generate a consistent fake price based on the meal ID string
export const getPrice = (idMeal) => {
    let hash = 0;
    for (let i = 0; i < idMeal.length; i++) {
        hash = idMeal.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Generate a base price between 15000 and 75000, rounded to nearest 5000
    const basePrice = (Math.abs(hash) % 13) * 5000 + 15000;
    return basePrice;
};

// Format number to IDR currency format
export const formatIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// Generate consistent rating (e.g. 4.3 - 4.9)
export const getRating = (idMeal) => {
    let hash = 0;
    for (let i = 0; i < idMeal.length; i++) {
        hash = idMeal.charCodeAt(i) + ((hash << 5) - hash);
    }
    const rating = 4.3 + (Math.abs(hash) % 7) * 0.1;
    return rating.toFixed(1);
};

// Generate consistent items sold (e.g. 20 - 250)
export const getItemsSold = (idMeal) => {
    let hash = 0;
    for (let i = 0; i < idMeal.length; i++) {
        hash = idMeal.charCodeAt(i) + ((hash << 5) - hash);
    }
    const sales = (Math.abs(hash) % 23) * 10 + 20;
    return sales;
};

// Generate consistent promo tag
export const getPromoTag = (idMeal) => {
    const num = parseInt(idMeal) || 0;
    const mod = num % 6;
    if (mod === 0) return { type: 'bestseller', text: 'Best Seller', class: 'bg-red-500 text-white' };
    if (mod === 1) return { type: 'discount', text: 'Diskon 15%', class: 'bg-orange-500 text-white' };
    if (mod === 2) return { type: 'promo', text: 'Promo', class: 'bg-amber-500 text-white' };
    if (mod === 3) return { type: 'free_delivery', text: 'Bebas Ongkir', class: 'bg-emerald-500 text-white' };
    return null; // No promo tag
};

