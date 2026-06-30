import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function AuthModal({ isOpen, onClose }) {
    const { login, register } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [isAdminLogin, setIsAdminLogin] = useState(false); // Toggle admin login specifically
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (isLogin) {
            // Login flow
            const res = login(email, password);
            if (res.success) {
                setSuccess(`Selamat datang kembali, ${res.user.name}!`);
                setTimeout(() => {
                    onClose();
                    // Reset fields
                    setEmail('');
                    setPassword('');
                    setIsAdminLogin(false);
                    setSuccess('');
                }, 1200);
            } else {
                setError(res.message);
            }
        } else {
            // Register flow
            if (!name.trim()) {
                setError('Nama lengkap tidak boleh kosong!');
                return;
            }
            const res = register(name, email, password);
            if (res.success) {
                setSuccess(`Pendaftaran berhasil! Halo, ${res.user.name}!`);
                setTimeout(() => {
                    onClose();
                    setName('');
                    setEmail('');
                    setPassword('');
                    setSuccess('');
                }, 1200);
            } else {
                setError(res.message);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden transform transition-all duration-300 animate-slide-up">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-orange-500 to-amber-500 text-white px-8 py-6 text-center">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/10 hover:bg-black/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                    <h3 className="text-2xl font-black tracking-tight">
                        {isLogin ? (isAdminLogin ? 'Login Administrator' : 'Masuk ke CariMakan') : 'Daftar Akun Baru'}
                    </h3>
                    <p className="text-xs text-orange-50 font-medium mt-1">
                        {isLogin 
                            ? (isAdminLogin ? 'Akses kontrol kelola pesanan & menu' : 'Temukan & pesan masakan favoritmu sekarang!') 
                            : 'Bergabunglah untuk memesan makanan lezat'}
                    </p>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-8">
                    {/* Error & Success Messages */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
                            <span className="text-sm">⚠️</span> {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-2xl text-xs font-semibold flex items-center gap-2">
                            <span className="text-sm">✓</span> {success}
                        </div>
                    )}

                    {/* Mode Toggle Tabs (Only shown if in Login mode) */}
                    {isLogin && (
                        <div className="flex bg-gray-50 border border-gray-100 p-1.5 rounded-2xl mb-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdminLogin(false);
                                    setError('');
                                }}
                                className={`flex-1 text-xs font-black py-2 rounded-xl transition-all ${
                                    !isAdminLogin 
                                        ? 'bg-white text-primary shadow-sm' 
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                Member/Pelanggan
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAdminLogin(true);
                                    setError('');
                                }}
                                className={`flex-1 text-xs font-black py-2 rounded-xl transition-all ${
                                    isAdminLogin 
                                        ? 'bg-gray-900 text-white shadow-sm' 
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                🔑 Login Admin
                            </button>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Name Field (Register only) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    placeholder="Masukkan nama lengkap"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                                    required
                                />
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Alamat Email</label>
                            <input 
                                type="email" 
                                placeholder={isAdminLogin ? "admin@carimakan.com" : "email@domain.com"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Kata Sandi</label>
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Quick Demo Help Text */}
                    {isLogin && (
                        <div className="mt-3 text-center">
                            <span className="text-[10px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full font-bold">
                                Info Demo: 
                                {isAdminLogin 
                                    ? " admin@carimakan.com | admin123" 
                                    : " user@carimakan.com | user123"}
                            </span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        className={`w-full py-3.5 px-6 rounded-2xl font-black text-white shadow-lg transition-all duration-300 active:scale-[0.98] mt-6 text-sm ${
                            isAdminLogin 
                                ? 'bg-gray-900 hover:bg-gray-800 shadow-gray-900/20' 
                                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25'
                        }`}
                    >
                        {isLogin ? (isAdminLogin ? 'Masuk sebagai Admin' : 'Masuk Sekarang') : 'Daftar Sekarang'}
                    </button>

                    {/* Toggle Login/Register Link */}
                    <div className="mt-6 text-center text-xs">
                        <span className="text-gray-400 font-semibold">
                            {isLogin ? 'Belum punya akun? ' : 'Sudah memiliki akun? '}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setIsAdminLogin(false);
                            }}
                            className="text-primary hover:underline font-black"
                        >
                            {isLogin ? 'Daftar Akun Baru' : 'Masuk Disini'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthModal;
