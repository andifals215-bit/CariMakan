import React from 'react';

function SearchBar({ query, setQuery, className = "" }) {
    return (
        <div className={`relative ${className}`}>
            <input
                type="text"
                placeholder="Cari makanan favoritmu (misal: Chicken, Beef)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-transparent bg-white shadow-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-gray-800 text-lg placeholder-gray-400"
            />
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-7 w-7 text-primary absolute left-5 top-1/2 transform -translate-y-1/2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
    );
}

export default SearchBar;
