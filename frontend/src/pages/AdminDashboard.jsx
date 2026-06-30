import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { OrderContext } from '../context/OrderContext';
import { formatIDR } from '../utils/price';

function AdminDashboard() {
    const { user } = useContext(AuthContext);
    const { orders, updateOrderStatus, deleteOrder } = useContext(OrderContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('orders'); // orders, menu, stats
    const [mockMenus, setMockMenus] = useState([
        { id: '1', name: 'Rendang Sapi Mandailing', category: 'Beef', price: 65000 },
        { id: '2', name: 'Ayam Bakar Madu Premium', category: 'Chicken', price: 45000 },
        { id: '3', name: 'Premium Salmon Sashimi', category: 'Seafood', price: 75000 },
        { id: '4', name: 'Chocolate Fudge Decadence', category: 'Dessert', price: 35000 }
    ]);

    const [newMenuName, setNewMenuName] = useState('');
    const [newMenuCat, setNewMenuCat] = useState('Beef');
    const [newMenuPrice, setNewMenuPrice] = useState('');

    // Access protection: redirect if not admin
    if (!user || user.role !== 'admin') {
        return (
            <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-red-100 shadow-xl text-center space-y-5">
                <div className="text-6xl">🔒</div>
                <h3 className="text-xl font-black text-gray-800">Akses Ditolak!</h3>
                <p className="text-sm text-gray-500 font-medium">Halaman ini hanya dapat diakses oleh akun Administrator. Silakan login sebagai admin terlebih dahulu.</p>
                <button 
                    onClick={() => navigate('/')} 
                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                    Kembali ke Beranda
                </button>
            </div>
        );
    }

    // Statistics calculations
    const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
    const totalOrdersCount = orders.length;
    const pendingOrdersCount = orders.filter(o => o.status === 'Menunggu Pembayaran').length;
    const completedOrdersCount = orders.filter(o => o.status === 'Selesai').length;

    const handleAddMockMenu = (e) => {
        e.preventDefault();
        if (!newMenuName.trim() || !newMenuPrice) return;
        const newMenu = {
            id: `MOCK-${Date.now()}`,
            name: newMenuName,
            category: newMenuCat,
            price: parseFloat(newMenuPrice)
        };
        setMockMenus([newMenu, ...mockMenus]);
        setNewMenuName('');
        setNewMenuPrice('');
        alert('Menu baru berhasil ditambahkan secara lokal!');
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 relative z-10">
            {/* Header Dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <span>🛡️</span> Dashboard Administrator
                    </h2>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Selamat datang, <span className="text-primary font-bold">{user.name}</span>. Kelola seluruh operasional CariMakan disini.
                    </p>
                </div>

                {/* Dashboard Tabs */}
                <div className="flex bg-white border border-gray-200 p-1 rounded-2xl shadow-sm">
                    {['orders', 'menu', 'stats'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-xl text-xs font-black capitalize transition-all ${
                                activeTab === tab 
                                    ? 'bg-gray-900 text-white shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {tab === 'orders' ? 'Daftar Pesanan' : tab === 'menu' ? 'Kelola Menu' : 'Statistik Penjualan'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-primary flex items-center justify-center text-xl font-bold">💰</div>
                    <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Omset</span>
                        <span className="text-lg font-black text-gray-800">{formatIDR(totalSales)}</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl font-bold">📦</div>
                    <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Pesanan</span>
                        <span className="text-lg font-black text-gray-800">{totalOrdersCount} Transaksi</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-xl font-bold">⏳</div>
                    <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Menunggu Bayar</span>
                        <span className="text-lg font-black text-gray-800">{pendingOrdersCount} Pesanan</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl font-bold">✓</div>
                    <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Pesanan Selesai</span>
                        <span className="text-lg font-black text-gray-800">{completedOrdersCount} Pesanan</span>
                    </div>
                </div>
            </div>

            {/* TAB CONTENTS */}
            
            {/* 1. ORDERS LIST */}
            {activeTab === 'orders' && (
                <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-extrabold text-gray-800 text-base">Kelola Antrian & Status Transaksi</h3>
                    </div>

                    {orders.length === 0 ? (
                        <div className="py-20 text-center text-gray-400">
                            <span className="text-5xl block mb-3">📬</span>
                            <p className="font-bold">Belum ada transaksi masuk.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <th className="py-4 px-6">Invoice & Tanggal</th>
                                        <th className="py-4 px-6">Pelanggan & Kontak</th>
                                        <th className="py-4 px-6">Menu & Kuantitas</th>
                                        <th className="py-4 px-6">Total & Bayar</th>
                                        <th className="py-4 px-6">Status Pengantaran</th>
                                        <th className="py-4 px-6 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm font-semibold">
                                    {orders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="py-5 px-6">
                                                <span className="block font-black text-gray-800">{order.id}</span>
                                                <span className="text-xs text-gray-400 font-medium">{order.date}</span>
                                            </td>
                                            <td className="py-5 px-6">
                                                <span className="block text-gray-800 font-extrabold">{order.userName}</span>
                                                <span className="text-xs text-gray-400 font-medium block mt-0.5">{order.shippingAddress.phone}</span>
                                                <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded block w-max mt-1">{order.shippingAddress.address.slice(0, 30)}...</span>
                                            </td>
                                            <td className="py-5 px-6 space-y-1">
                                                {order.items.map(item => (
                                                    <div key={item.idMeal} className="text-xs text-gray-600">
                                                        • {item.strMeal} <span className="font-bold text-gray-400">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="py-5 px-6">
                                                <span className="block text-primary font-black">{formatIDR(order.total)}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">{order.paymentMethod}</span>
                                            </td>
                                            <td className="py-5 px-6">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-black border focus:outline-none cursor-pointer ${
                                                        order.status === 'Menunggu Pembayaran' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                        order.status === 'Sedang Dimasak' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                        order.status === 'Siap Diantar' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                                        'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                    }`}
                                                >
                                                    <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                                                    <option value="Sedang Dimasak">Sedang Dimasak</option>
                                                    <option value="Siap Diantar">Siap Diantar</option>
                                                    <option value="Selesai">Selesai</option>
                                                </select>
                                            </td>
                                            <td className="py-5 px-6 text-center">
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
                                                            deleteOrder(order.id);
                                                        }
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                    title="Hapus Pesanan"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* 2. MANAGE MENU PANEL */}
            {activeTab === 'menu' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Menu Form */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm h-fit">
                        <h3 className="font-extrabold text-gray-800 text-base mb-4">Tambah Menu Lokal</h3>
                        <form onSubmit={handleAddMockMenu} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Nama Menu Makanan</label>
                                <input 
                                    type="text" 
                                    placeholder="Masukkan nama menu" 
                                    value={newMenuName}
                                    onChange={(e) => setNewMenuName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Kategori Masakan</label>
                                <select 
                                    value={newMenuCat}
                                    onChange={(e) => setNewMenuCat(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold bg-white cursor-pointer"
                                >
                                    <option value="Beef">Beef (Daging Sapi)</option>
                                    <option value="Chicken">Chicken (Ayam)</option>
                                    <option value="Dessert">Dessert (Makanan Penutup)</option>
                                    <option value="Seafood">Seafood (Hasil Laut)</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1.5">Harga Rupiah (IDR)</label>
                                <input 
                                    type="number" 
                                    placeholder="Contoh: 45000" 
                                    value={newMenuPrice}
                                    onChange={(e) => setNewMenuPrice(e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-semibold transition-all"
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-black rounded-2xl shadow-lg transition-all active:scale-[0.98] text-sm"
                            >
                                Publish Menu Baru
                            </button>
                        </form>
                    </div>

                    {/* Menu List */}
                    <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden lg:col-span-2">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="font-extrabold text-gray-800 text-base">Daftar Menu Aktif (Simulasi)</h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {mockMenus.map(menu => (
                                <div key={menu.id} className="flex justify-between items-center p-5 hover:bg-gray-50/30 transition-colors">
                                    <div>
                                        <h4 className="font-extrabold text-gray-800 text-sm">{menu.name}</h4>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-1">{menu.category}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-primary text-sm">{formatIDR(menu.price)}</span>
                                        <button 
                                            onClick={() => setMockMenus(mockMenus.filter(m => m.id !== menu.id))}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 3. SALES STATS PANEL */}
            {activeTab === 'stats' && (
                <div className="bg-white p-8 rounded-3xl border border-gray-150 shadow-sm">
                    <h3 className="font-extrabold text-gray-800 text-base mb-6">Grafik Ringkasan Penjualan</h3>
                    
                    {orders.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 font-semibold text-sm">
                            Belum ada transaksi untuk menganalisis statistik.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100/50">
                                    <h4 className="font-bold text-gray-600 text-xs uppercase tracking-wider mb-4">Kategori Pembayaran Terpopuler</h4>
                                    <div className="space-y-3 font-semibold text-xs text-gray-700">
                                        {['QRIS', 'Transfer Bank', 'COD'].map(method => {
                                            const count = orders.filter(o => o.paymentMethod.includes(method) || o.paymentMethod === method).length;
                                            const pct = totalOrdersCount > 0 ? (count / totalOrdersCount) * 100 : 0;
                                            return (
                                                <div key={method} className="space-y-1">
                                                    <div className="flex justify-between font-bold text-gray-600">
                                                        <span>{method}</span>
                                                        <span>{count} Order ({pct.toFixed(0)}%)</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div className="bg-primary h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100/50">
                                    <h4 className="font-bold text-gray-600 text-xs uppercase tracking-wider mb-4">Metrik Kunci Platform</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs font-bold text-gray-600">
                                            <span>Rata-Rata Nilai Order (AOV)</span>
                                            <span className="text-gray-800">{formatIDR(totalSales / totalOrdersCount)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-gray-600">
                                            <span>Metode Terlaris</span>
                                            <span className="text-gray-800">QRIS (Scan Barcode)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
