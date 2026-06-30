import React from 'react';

const TESTIMONIALS_DATA = [
    {
        id: 1,
        name: 'Deni Prawira',
        role: 'Mahasiswa MI Polinela',
        rating: 5,
        text: 'CariMakan mempermudah saya mencari resep dan memesan makanan favorit dari luar kampus. Tampilannya keren dan sangat responsif!',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
    },
    {
        id: 2,
        name: 'Sarah Amelia',
        role: 'Pecinta Kuliner',
        rating: 5,
        text: 'Suka sekali dengan detail resep masakan di platform ini. Ditambah lagi, proses checkout langsung via WhatsApp Admin sangat praktis dan cepat.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
        id: 3,
        name: 'Budi Santoso',
        role: 'Chef Rumahan',
        rating: 4,
        text: 'Bahan-bahan resep lengkap dan instruksi masaknya mudah dipahami. Desain antarmukanya sangat menyegarkan dan memanjakan mata!',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    }
];

function Testimonials() {
    return (
        <div className="my-16 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                    💬 Ulasan Pelanggan
                </span>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                    Apa Kata <span className="text-primary bg-clip-text">Rekan Kuliner</span> Kami?
                </h3>
                <p className="text-gray-500 font-medium mt-2">Dengarkan pengalaman langsung dari mereka yang telah mencicipi kemudahan CariMakan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS_DATA.map((t) => (
                    <div 
                        key={t.id}
                        className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl border border-orange-100/30 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                        <div>
                            {/* Stars */}
                            <div className="flex gap-1 mb-5">
                                {[...Array(5)].map((_, i) => (
                                    <svg 
                                        key={i} 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className={`h-5 w-5 ${i < t.rating ? 'text-amber-400' : 'text-gray-200'}`} 
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 italic leading-relaxed text-sm">
                                "{t.text}"
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-6 pt-5 border-t border-gray-100">
                            <img 
                                src={t.avatar} 
                                alt={t.name}
                                className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-gray-100"
                            />
                            <div>
                                <h4 className="font-extrabold text-gray-800 text-sm">{t.name}</h4>
                                <p className="text-xs font-semibold text-gray-400 mt-0.5">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Testimonials;
