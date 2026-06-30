import React, { createContext, useState, useEffect, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [lastAdded, setLastAdded] = useState(null); // for toast notification

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Clear toast after 2.5s
    useEffect(() => {
        if (lastAdded) {
            const timer = setTimeout(() => setLastAdded(null), 2500);
            return () => clearTimeout(timer);
        }
    }, [lastAdded]);

    const addToCart = useCallback((food, price, qty = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.idMeal === food.idMeal);
            if (existingItem) {
                return prevCart.map(item =>
                    item.idMeal === food.idMeal
                        ? { ...item, quantity: item.quantity + qty }
                        : item
                );
            }
            return [...prevCart, { 
                idMeal: food.idMeal, 
                strMeal: food.strMeal, 
                strMealThumb: food.strMealThumb, 
                strCategory: food.strCategory || '',
                quantity: qty, 
                price 
            }];
        });
        // Show toast notification
        setLastAdded({ name: food.strMeal, thumb: food.strMealThumb, qty });
    }, []);

    const removeFromCart = useCallback((idMeal) => {
        setCart(prevCart => prevCart.filter(item => item.idMeal !== idMeal));
    }, []);

    const updateQuantity = useCallback((idMeal, delta) => {
        setCart(prevCart => {
            return prevCart.reduce((acc, item) => {
                if (item.idMeal === idMeal) {
                    const newQuantity = item.quantity + delta;
                    if (newQuantity <= 0) {
                        // Remove from cart when quantity reaches 0
                        return acc;
                    }
                    return [...acc, { ...item, quantity: newQuantity }];
                }
                return [...acc, item];
            }, []);
        });
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart,
            cartCount, 
            cartTotal,
            isCartOpen,
            toggleCart,
            setIsCartOpen,
            lastAdded
        }}>
            {children}
        </CartContext.Provider>
    );
};
