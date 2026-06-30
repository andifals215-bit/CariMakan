import React from 'react';
import { formatIDR } from '../utils/price';

function ReceiptModal({ isOpen, order, onClose }) {
    if (!isOpen || !order) return null;

    const handlePrint = () => {
        // Simple printable invoice selector
        const printContent = document.getElementById('printable-receipt').innerHTML;
        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = `
            <div style="padding: 40px; font-family: 'Courier New', Courier, monospace; max-width: 500px; margin: 0 auto;">
                ${printContent}
            </div>
        `;
        window.print();
        // Restore page
        document.body.innerHTML = originalContent;
        window.location.reload(); // reload to rebind react state listeners correctly
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Receipt Modal Box */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 animate-slide-up flex flex-col max-h-[90vh]">
                
                {/* Scrollable Receipt Body */}
                <div className="flex-1 overflow-y-auto p-8" id="printable-receipt">
                    {/* Brand header */}
                    <div className="text-center pb-6 border-b-2 border-dashed border-gray-200">
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Cari<span className="text-primary">Makan</span></h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">E-Receipt / Bukti Pembayaran Resmi</p>
                    </div>

                    {/* Invoice Meta */}
                    <div className="py-5 space-y-2 border-b border-gray-100 text-xs font-semibold text-gray-600">
                        <div className="flex justify-between">
                            <span>No. Invoice:</span>
                            <span className="text-gray-800 font-extrabold">{order.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Waktu Transaksi:</span>
                            <span className="text-gray-800 font-extrabold">{order.date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Penerima:</span>
                            <span className="text-gray-800 font-extrabold">{order.userName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Metode Bayar:</span>
                            <span className="text-gray-800 font-extrabold">{order.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="text-emerald-500 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">LUNAS</span>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="py-4 border-b border-gray-100 text-xs">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Alamat Pengiriman</span>
                        <p className="text-gray-600 font-semibold leading-relaxed">
                            {order.shippingAddress.address} <br/>
                            <span className="text-gray-400 font-medium">Hubungi: {order.shippingAddress.phone}</span>
                        </p>
                    </div>

                    {/* Items Table */}
                    <div className="py-5 border-b-2 border-dashed border-gray-200">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Rincian Menu</span>
                        
                        <div className="space-y-4">
                            {order.items.map(item => (
                                <div key={item.idMeal} className="flex justify-between items-start text-xs font-semibold">
                                    <div className="min-w-0 flex-1 pr-4">
                                        <p className="text-gray-800 line-clamp-1">{item.strMeal}</p>
                                        <span className="text-[10px] text-gray-400 font-medium">{item.quantity} x {formatIDR(item.price)}</span>
                                    </div>
                                    <span className="text-gray-800 font-extrabold flex-shrink-0">{formatIDR(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total summary */}
                    <div className="pt-5 space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-gray-500">
                            <span>Subtotal Belanja</span>
                            <span>{formatIDR(order.total)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-gray-500">
                            <span>Biaya Pengiriman</span>
                            <span className="text-emerald-500">Gratis</span>
                        </div>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <div className="flex justify-between items-center text-sm font-black text-gray-800">
                            <span>Total Pembayaran</span>
                            <span className="text-lg text-primary">{formatIDR(order.total)}</span>
                        </div>
                    </div>

                    {/* Footer receipt */}
                    <div className="text-center pt-8 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Terima kasih telah berbelanja di CariMakan!
                    </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-2xl border border-gray-200 transition-colors text-sm"
                    >
                        Tutup
                    </button>
                    <button 
                        onClick={handlePrint}
                        className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-1.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Cetak Struk
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReceiptModal;
