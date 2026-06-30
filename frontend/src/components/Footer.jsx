import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 mt-0 relative overflow-hidden">
            {/* Top Gradient Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-primary via-amber-400 to-primary"></div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
                    {/* Brand / About */}
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-black text-white tracking-tight mb-4">
                            Cari<span className="text-primary">Makan</span>
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-500 mb-6">
                            Platform pencarian resep dan pesan antar makanan lezat dari seluruh dunia. Temukan inspirasi kuliner terbaik setiap hari.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-3">
                            {['Instagram', 'Twitter', 'Facebook', 'TikTok'].map((social) => (
                                <a 
                                    key={social} 
                                    href="#" 
                                    className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-primary text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300 border border-gray-700/50 hover:border-primary hover:shadow-md hover:shadow-primary/20"
                                    title={social}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider mb-5">Navigasi</h4>
                        <ul className="space-y-3 text-sm">
                            {['Beranda', 'Menu Promo', 'Kategori', 'Tentang Kami'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-gray-500 hover:text-primary transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="h-1 w-1 rounded-full bg-gray-600 group-hover:bg-primary transition-colors"></span>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider mb-5">Informasi</h4>
                        <ul className="space-y-3 text-sm">
                            {['Syarat & Ketentuan', 'Kebijakan Privasi', 'FAQ / Bantuan', 'Kontak Kami'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-gray-500 hover:text-primary transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="h-1 w-1 rounded-full bg-gray-600 group-hover:bg-primary transition-colors"></span>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Payment Methods */}
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider mb-5">Metode Pembayaran</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {['GoPay', 'OVO', 'DANA', 'QRIS', 'BCA', 'Mandiri'].map((method) => (
                                <div 
                                    key={method} 
                                    className="bg-gray-800 text-gray-400 text-[10px] font-bold px-2 py-2.5 rounded-lg text-center border border-gray-700/50 hover:border-gray-600 hover:text-gray-300 transition-colors"
                                >
                                    {method}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-3">Pengiriman</h4>
                            <div className="flex gap-2">
                                {['GoSend', 'GrabExpress', 'COD'].map((delivery) => (
                                    <span 
                                        key={delivery} 
                                        className="bg-gray-800 text-gray-400 text-[10px] font-bold px-3 py-2 rounded-lg border border-gray-700/50"
                                    >
                                        {delivery}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} CariMakan. All rights reserved.</p>
                    <p className="text-xs text-gray-600">Dibuat dengan <span className="text-red-500">❤</span> untuk Praktikum Pemrograman</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
