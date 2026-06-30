import React, { createContext, useState, useEffect } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('orders_list');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });

    useEffect(() => {
        localStorage.setItem('orders_list', JSON.stringify(orders));
    }, [orders]);

    const createOrder = (user, items, total, paymentMethod, shippingAddress) => {
        const newOrder = {
            id: `INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
            userEmail: user.email,
            userName: user.name,
            items,
            total,
            paymentMethod,
            shippingAddress,
            status: 'Menunggu Pembayaran', // 'Menunggu Pembayaran', 'Sedang Dimasak', 'Siap Diantar', 'Selesai'
            date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
        };
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        return newOrder;
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prevOrders => prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const deleteOrder = (orderId) => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    };

    return (
        <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, deleteOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
