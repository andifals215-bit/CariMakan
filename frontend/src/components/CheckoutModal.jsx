import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import { formatIDR } from '../utils/price';

function CheckoutModal({ isOpen, onClose, onOrderSuccess }) {
    const { cart, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { createOrder } = useContext(OrderContext);

    const [step, setStep] = useState(1); // 1: Shipping Address, 2: Payment Method, 3: Processing/Simulation
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('qris'); // qris, bank_tf, cod
    const [ewalletType, setEwalletType] = useState('gopay'); // gopay, ovo, dana
    const [simulating, setSimulating] = useState(false);
    const [simProgress, setSimProgress] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setAddress('');
            setPhone('');
            setPaymentMethod('qris');
            setSimulating(false);
            setSimProgress(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNextStep = (e) => {
        e.preventDefault();
        if (step === 1) {
            if (!address.trim() || !phone.trim()) {
                alert('Tolong lengkapi alamat dan nomor telepon pengiriman!');
                return;
            }
            setStep(2);
        }
    };

    const handleStartPayment = () => {
        setStep(3);
        setSimulating(true);
        setSimProgress(0);
    };

    // Simulate Payment Progress Bar
    useEffect(() => {
        let interval;
        if (simulating && step === 3) {
            interval = setInterval(() => {
                setSimProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setSimulating(false);
                        // Save order to history
                        const newOrder = createOrder(user, cart, cartTotal, paymentMethod === 'qris' ? `QRIS (${ewalletType.toUpperCase()})` : paymentMethod === 'bank_tf' ? 'Transfer Bank' : 'COD / Tunai', { address, phone });
                        clearCart();
                        onOrderSuccess(newOrder); // pass to receipt
                        return 100;
                    }
                    return prev + 10;
                });
            }, 300);
        }
        return () => clearInterval(interval);
    }, [simulating, step]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Box */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden transform transition-all duration-300 animate-slide-up">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-orange-500 to-amber-500 text-white px-8 py-6">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <span>🛒</span> Proses Pembayaran
                    </h3>
                    <p className="text-xs text-orange-50 font-medium mt-1">
                        {step === 1 ? 'Langkah 1: Lengkapi Detail Pengiriman' : step === 2 ? 'Langkah 2: Pilih Metode Pembayaran' : 'Langkah 3: Menunggu Pembayaran'}
                    </p>
                </div>

                {/* Steps Indicator */}
                <div className="flex border-b border-gray-100 bg-gray-50/50 p-3">
                    {[1, 2, 3].map(num => (
                        <div key={num} className="flex-1 flex items-center justify-center gap-1.5">
                            <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                                step >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                                {num}
                            </span>
                            <span className={`text-[10px] font-bold ${
                                step >= num ? 'text-gray-800' : 'text-gray-400'
                            }`}>
                                {num === 1 ? 'Pengiriman' : num === 2 ? 'Metode' : 'Verifikasi'}
                            </span>
                            {num < 3 && <div className="h-0.5 w-6 bg-gray-200"></div>}
                        </div>
                    ))}
                </div>

                {/* Body Contents */}
                <div className="p-6">
                    {/* STEP 1: Address & Contact */}
                    {step === 1 && (
                        <form onSubmit={handleNextStep} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Nama Penerima</label>
                                <input 
                                    type="text" 
                                    value={user?.name || ''} 
                                    disabled 
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-500 text-sm font-semibold cursor-not-allowed focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Nomor WhatsApp Aktif</label>
                                <input 
                                    type="tel" 
                                    placeholder="Contoh: 081234567890" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Alamat Lengkap Pengantaran</label>
                                <textarea 
                                    placeholder="Tuliskan nama jalan, nomor rumah, RT/RW, dan detail patokan..." 
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all h-24 resize-none"
                                    required
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4 text-sm"
                            >
                                Lanjut Pilih Pembayaran →
                            </button>
                        </form>
                    )}

                    {/* STEP 2: Payment Method */}
                    {step === 2 && (
                        <div className="space-y-5">
                            {/* Payment Options */}
                            <div className="space-y-3">
                                {/* Option 1: QRIS Barcode Scan / E-wallet */}
                                <label className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                                    paymentMethod === 'qris' 
                                        ? 'border-primary bg-orange-50/20 shadow-sm' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="payment_method" 
                                        value="qris" 
                                        checked={paymentMethod === 'qris'}
                                        onChange={() => setPaymentMethod('qris')}
                                        className="mt-1 accent-primary"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-gray-800 flex items-center gap-2">
                                            📱 Scan Barcode QRIS / E-Wallet
                                            <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">Instan</span>
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1 font-medium">Bayar instan lewat scan QR kode e-wallet (GoPay, OVO, DANA, dll).</p>
                                        
                                        {/* E-wallet Choice */}
                                        {paymentMethod === 'qris' && (
                                            <div className="flex gap-2 mt-3 p-1.5 bg-gray-50 border border-gray-100 rounded-xl">
                                                {['gopay', 'ovo', 'dana'].map(wallet => (
                                                    <button
                                                        key={wallet}
                                                        onClick={() => setEwalletType(wallet)}
                                                        className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                                                            ewalletType === wallet 
                                                                ? 'bg-primary text-white shadow-sm' 
                                                                : 'text-gray-400 hover:text-gray-600'
                                                        }`}
                                                    >
                                                        {wallet}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </label>

                                {/* Option 2: Bank Transfer */}
                                <label className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                                    paymentMethod === 'bank_tf' 
                                        ? 'border-primary bg-orange-50/20 shadow-sm' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="payment_method" 
                                        value="bank_tf" 
                                        checked={paymentMethod === 'bank_tf'}
                                        onChange={() => setPaymentMethod('bank_tf')}
                                        className="mt-1 accent-primary"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-gray-800">🏦 Transfer Bank Mandiri / BCA</h4>
                                        <p className="text-xs text-gray-500 mt-1 font-medium">Kirim ke rekening official platform dengan konfirmasi manual.</p>
                                    </div>
                                </label>

                                {/* Option 3: COD */}
                                <label className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                                    paymentMethod === 'cod' 
                                        ? 'border-primary bg-orange-50/20 shadow-sm' 
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="payment_method" 
                                        value="cod" 
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="mt-1 accent-primary"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-gray-800">💵 Bayar di Tempat (Tunai / COD)</h4>
                                        <p className="text-xs text-gray-500 mt-1 font-medium">Bayar uang tunai langsung ke kurir pengantar saat makanan sampai.</p>
                                    </div>
                                </label>
                            </div>

                            {/* Cart Summary */}
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50 flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold">Total Pembayaran:</span>
                                <span className="text-lg font-black text-primary">{formatIDR(cartTotal)}</span>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors text-sm"
                                >
                                    Kembali
                                </button>
                                <button 
                                    onClick={handleStartPayment}
                                    className="flex-2 py-3.5 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] text-sm"
                                >
                                    Konfirmasi & Bayar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Verification / Simulation */}
                    {step === 3 && (
                        <div className="text-center py-6 space-y-6">
                            {paymentMethod === 'qris' && (
                                <div className="space-y-4">
                                    <h4 className="text-base font-black text-gray-800">
                                        Scan QRIS Dinamis ({ewalletType.toUpperCase()})
                                    </h4>
                                    
                                    {/* MOCK QRIS BARCODE (Clean SVG QR generator) */}
                                    <div className="mx-auto w-48 h-48 p-4 bg-white rounded-3xl border border-gray-200 shadow-md flex flex-col items-center justify-center relative overflow-hidden group">
                                        {/* QR Code Lines Mock SVG */}
                                        <svg viewBox="0 0 100 100" className="w-full h-full text-gray-800">
                                            <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                                            <rect x="5" y="5" width="15" height="15" fill="white" />
                                            <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                                            <rect x="80" y="5" width="15" height="15" fill="white" />
                                            <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                                            <rect x="5" y="80" width="15" height="15" fill="white" />
                                            <path d="M 35 5 L 45 5 L 45 15 L 35 15 Z M 55 5 L 65 5 L 65 25 L 55 25 Z M 15 35 L 25 35 L 25 45 L 15 45 Z M 35 35 L 55 35 L 55 45 L 65 45 L 65 55 L 45 55 L 45 65 L 35 65 Z M 75 35 L 85 35 L 85 55 L 75 55 Z M 55 75 L 65 75 L 65 85 L 55 85 Z M 75 75 L 85 75 L 85 85 L 75 85 Z" fill="currentColor"/>
                                            <circle cx="50" cy="50" r="10" fill="currentColor"/>
                                        </svg>
                                        
                                        {/* Center Logo text badge */}
                                        <div className="absolute bg-white text-primary text-[6px] font-black px-1 py-0.5 rounded border border-gray-200">
                                            QRIS
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Silakan Scan Kode QR Diatas untuk Menyelesaikan Pembayaran</p>
                                </div>
                            )}

                            {paymentMethod === 'bank_tf' && (
                                <div className="space-y-4">
                                    <h4 className="text-base font-black text-gray-800">Instruksi Transfer Mandiri / BCA</h4>
                                    <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl space-y-3 max-w-sm mx-auto text-left">
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Bank BCA</span>
                                            <span className="text-base font-black text-gray-800">123-456-7890</span>
                                            <span className="text-xs text-gray-400 font-medium block">a.n CariMakan Indonesia</span>
                                        </div>
                                        <div className="border-t border-gray-200/50 pt-3">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Bank Mandiri</span>
                                            <span className="text-base font-black text-gray-800">100-200-3000-40</span>
                                            <span className="text-xs text-gray-400 font-medium block">a.n CariMakan Indonesia</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'cod' && (
                                <div className="space-y-2">
                                    <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto text-3xl">
                                        🚚
                                    </div>
                                    <h4 className="text-base font-black text-gray-800">Metode COD Terpilih</h4>
                                    <p className="text-xs text-gray-500 max-w-xs mx-auto">Harap siapkan uang tunai pas sebesar <span className="font-extrabold text-primary">{formatIDR(cartTotal)}</span> saat pesanan tiba.</p>
                                </div>
                            )}

                            {/* Simulation State Progress bar */}
                            <div className="space-y-2 max-w-xs mx-auto pt-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider">
                                        {simulating ? 'Menunggu Pembayaran...' : 'Verifikasi Selesai!'}
                                    </span>
                                    <span className="text-primary font-black">{simProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div 
                                        className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${simProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CheckoutModal;
