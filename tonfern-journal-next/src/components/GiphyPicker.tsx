'use client';

import { useState, useEffect, useCallback } from 'react';
import { searchGifs, type GifResult } from '@/lib/giphy';

interface GiphyPickerProps {
    onSelect: (gif: GifResult) => void;
    onClose: () => void;
}

export default function GiphyPicker({ onSelect, onClose }: GiphyPickerProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<GifResult[]>([]);
    const [loading, setLoading] = useState(false);

    const doSearch = useCallback(async (q: string) => {
        setLoading(true);
        const gifs = await searchGifs(q, 24);
        setResults(gifs);
        setLoading(false);
    }, []);

    // Load trending on mount
    useEffect(() => {
        doSearch('');
    }, [doSearch]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            doSearch(query);
        }, 400);
        return () => clearTimeout(timer);
    }, [query, doSearch]);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-stone-100">
                    <h3 className="font-serif text-emerald-800 text-lg">🎭 ค้นหา GIF</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors">✕</button>
                </div>

                {/* Search */}
                <div className="p-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="ค้นหา GIF... (เช่น cat, happy, love)"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm"
                        autoFocus
                    />
                </div>

                {/* Results Grid */}
                <div className="flex-1 overflow-y-auto p-4 pt-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="text-center text-stone-400 py-12 font-handwriting">
                            ไม่เจอ GIF ลองค้นคำอื่นดูนะ 🔍
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-2">
                            {results.map((gif) => (
                                <button
                                    key={gif.id}
                                    onClick={() => onSelect(gif)}
                                    className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-emerald-400 transition-all hover:scale-105 bg-stone-100"
                                >
                                    <img
                                        src={gif.previewUrl}
                                        alt={gif.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Giphy Attribution */}
                <div className="p-3 border-t border-stone-100 text-center">
                    <span className="text-xs text-stone-400">Powered by GIPHY</span>
                </div>
            </div>
        </div>
    );
}
