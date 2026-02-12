'use client';

import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric'; // Fabric v6 style import

interface StoryEditorProps {
    initialData?: any;
    onSave?: (data: any) => void;
}

const StoryEditor = ({ initialData, onSave }: StoryEditorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.FabricObject | null>(null);

    // Initialize Fabric Canvas (Tier 1: Effect for Client-Only)
    useEffect(() => {
        if (!canvasRef.current || fabricCanvas) return;

        // Create Canvas instance
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 1000,
            backgroundColor: '#fdfbf7', // Journal paper color
            selection: true,
        });

        // Tier 3: Texture Overlay (Simulated via pattern or CSS, here simple color first)
        // In production, we'd load an image pattern here.

        setFabricCanvas(canvas);

        // Load initial data if provided
        if (initialData) {
            canvas.loadFromJSON(initialData, () => {
                canvas.renderAll();
                console.log('Canvas loaded from JSON');
            });
        }

        // Event Listeners for Selection
        const handleSelection = (e: any) => {
            // Fabric v6 event handling might differ slightly, checking selection
            const active = e.selected ? e.selected[0] : null;
            setSelectedObject(active);
        };

        canvas.on('selection:created', handleSelection);
        canvas.on('selection:updated', handleSelection);
        canvas.on('selection:cleared', () => setSelectedObject(null));

        // Cleanup (Tier 1: Memory Control)
        return () => {
            canvas.dispose();
            setFabricCanvas(null);
        };
    }, []); // Run once on mount

    // --- Toolbar Actions ---

    const addText = () => {
        if (!fabricCanvas) return;
        const text = new fabric.IText('Hello World', {
            left: 100,
            top: 100,
            fontFamily: 'Sriracha', // Use our custom handwriting font
            fontSize: 24,
            fill: '#064e3b', // emerald-900
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
    };

    const addRectangle = () => {
        if (!fabricCanvas) return;
        const rect = new fabric.Rect({
            left: 150,
            top: 150,
            fill: '#fcd34d', // yellow-300
            width: 100,
            height: 100,
            opacity: 0.8,
        });
        fabricCanvas.add(rect);
        fabricCanvas.setActiveObject(rect);
    };

    const deleteSelected = () => {
        if (!fabricCanvas || !selectedObject) return;
        fabricCanvas.remove(selectedObject);
        fabricCanvas.discardActiveObject();
        fabricCanvas.requestRenderAll();
        setSelectedObject(null);
    };

    const handleSave = () => {
        if (!fabricCanvas) return;
        const json = fabricCanvas.toJSON();
        console.log('Saved JSON:', json);
        if (onSave) onSave(json);
        alert('บันทึกข้อมูลเรียบร้อย (ดูใน Console)');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!fabricCanvas || !e.target.files?.[0]) return;

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (f) => {
            const data = f.target?.result as string;
            const imgObj = new Image();
            imgObj.src = data;

            imgObj.onload = () => {
                const image = new fabric.FabricImage(imgObj);

                // Scale down if too big
                const MAX_WIDTH = 300;
                const scale = MAX_WIDTH / (image.width || 1);

                image.set({
                    left: 200,
                    top: 200,
                    scaleX: scale,
                    scaleY: scale,
                    cornerColor: '#10b981', // emerald-500
                    cornerStyle: 'circle',
                    transparentCorners: false,
                    // Simple Polaroid effect (white border)
                    stroke: '#fff',
                    strokeWidth: 20,
                    // Fabric default stroke is centered. But let's keep it simple.
                    shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 10, offsetX: 5, offsetY: 5 })
                });

                fabricCanvas.add(image);
                fabricCanvas.setActiveObject(image);

                // Reset input so same file can be selected again
                e.target.value = '';
            };
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto p-4">

            {/* Sidebar Tools */}
            <div className="w-full md:w-48 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-xl shadow-md border border-stone-200">
                    <h3 className="font-serif text-emerald-800 mb-4 border-b pb-2">เครื่องมือ 🎨</h3>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={addText}
                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-left text-sm font-handwriting transition-colors flex items-center gap-2"
                        >
                            📝 เพิ่มข้อความ
                        </button>
                        <button
                            onClick={addRectangle}
                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-left text-sm font-handwriting transition-colors flex items-center gap-2"
                        >
                            🟧 เพิ่มสติ๊กเกอร์
                        </button>

                        <label className="cursor-pointer px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-left text-sm font-handwriting transition-colors flex items-center gap-2">
                            <span>🖼️ เพิ่มรูปภาพ</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>
                    </div>
                </div>

                {/* Selected Object Properties */}
                {selectedObject && (
                    <div className="bg-white p-4 rounded-xl shadow-md border border-stone-200 animate-fade-in-up">
                        <h3 className="font-serif text-emerald-800 mb-2 text-sm border-b pb-1">แก้ไขวัตถุ</h3>
                        <button
                            onClick={deleteSelected}
                            className="w-full px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            🗑️ ลบทิ้ง
                        </button>
                    </div>
                )}

                <button
                    onClick={handleSave}
                    className="mt-auto px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg font-bold transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    💾 บันทึกหน้า
                </button>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-auto bg-stone-200 p-8 rounded-xl shadow-inner flex justify-center check-pattern">
                <div className="shadow-2xl">
                    <canvas ref={canvasRef} />
                </div>
            </div>

        </div>
    );
};

export default StoryEditor;
