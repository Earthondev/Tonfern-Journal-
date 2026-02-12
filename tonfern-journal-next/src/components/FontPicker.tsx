'use client';

import { useState } from 'react';

// Font categories with Thai-friendly fonts
export const FONT_CATEGORIES = {
    handwriting: {
        label: '✏️ ลายมือ',
        fonts: [
            { name: 'Sriracha', label: 'ศรีราชา' },
            { name: 'Kalam', label: 'กาลาม' },
            { name: 'Itim', label: 'อิทึม' },
        ],
    },
    cute: {
        label: '🌸 น่ารัก',
        fonts: [
            { name: 'Prompt', label: 'พร้อมต์' },
            { name: 'Sarabun', label: 'สารบรรณ' },
            { name: 'Mitr', label: 'มิตร' },
        ],
    },
    formal: {
        label: '📄 ทางการ',
        fonts: [
            { name: 'Noto Sans Thai', label: 'โนโต' },
            { name: 'Kanit', label: 'คณิต' },
            { name: 'IBM Plex Sans Thai', label: 'ไอบีเอ็ม' },
        ],
    },
};

interface FontPickerProps {
    currentFont: string;
    currentSize: number;
    currentColor: string;
    onFontChange: (font: string) => void;
    onSizeChange: (size: number) => void;
    onColorChange: (color: string) => void;
}

const COLORS = [
    '#000000', '#ffffff', '#064e3b', '#10b981',
    '#1e40af', '#3b82f6', '#7c3aed', '#ec4899',
    '#dc2626', '#f59e0b', '#78716c', '#fbbf24',
];

const SIZES = [14, 18, 24, 32, 48, 64, 80];

export default function FontPicker({
    currentFont,
    currentSize,
    currentColor,
    onFontChange,
    onSizeChange,
    onColorChange,
}: FontPickerProps) {
    const [activeCategory, setActiveCategory] = useState<string>('handwriting');

    return (
        <div className="bg-white rounded-xl border border-stone-200 shadow-lg p-4 w-72 space-y-4">
            {/* Font Category Tabs */}
            <div className="flex gap-1">
                {Object.entries(FONT_CATEGORIES).map(([key, cat]) => (
                    <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs transition-colors ${activeCategory === key
                                ? 'bg-emerald-100 text-emerald-800 font-bold'
                                : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Font List */}
            <div className="space-y-1">
                {FONT_CATEGORIES[activeCategory as keyof typeof FONT_CATEGORIES].fonts.map((font) => (
                    <button
                        key={font.name}
                        onClick={() => onFontChange(font.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${currentFont === font.name
                                ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                                : 'hover:bg-stone-50 text-stone-600'
                            }`}
                        style={{ fontFamily: font.name }}
                    >
                        {font.label} — ตัวอย่าง Abc
                    </button>
                ))}
            </div>

            {/* Size Slider */}
            <div>
                <label className="text-xs text-stone-500 mb-1 block">ขนาด: {currentSize}px</label>
                <div className="flex gap-1 flex-wrap">
                    {SIZES.map((size) => (
                        <button
                            key={size}
                            onClick={() => onSizeChange(size)}
                            className={`px-2 py-1 rounded text-xs transition-colors ${currentSize === size
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color Palette */}
            <div>
                <label className="text-xs text-stone-500 mb-1 block">สี</label>
                <div className="flex gap-1.5 flex-wrap">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => onColorChange(color)}
                            className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${currentColor === color ? 'border-emerald-500 scale-110' : 'border-stone-200'
                                }`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
