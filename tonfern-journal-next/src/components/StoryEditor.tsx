'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import dynamic from 'next/dynamic';
import { uploadToCloudinary, uploadVideoToCloudinary } from '@/lib/cloudinary';
import FontPicker from '@/components/FontPicker';
import type { GifResult } from '@/lib/giphy';

// Lazy load heavy picker components
const GiphyPicker = dynamic(() => import('@/components/GiphyPicker'), { ssr: false });

// --- Constants ---
const CANVAS_W = 1080;
const CANVAS_H = 1350; // IG ratio 4:5

const BRUSH_COLORS = [
    '#000000', '#ffffff', '#064e3b', '#10b981',
    '#1e40af', '#3b82f6', '#7c3aed', '#ec4899',
    '#dc2626', '#f59e0b',
];
const BRUSH_SIZES = [2, 4, 8, 12, 20];

type Tool = 'select' | 'text' | 'draw' | 'image' | 'gif' | 'video';

interface StoryEditorProps {
    initialData?: string;
    onSave?: (data: object) => void;
}

interface VideoMeta {
    id: string;
    url: string;
    left: number;
    top: number;
    width: number;
    height: number;
}

const StoryEditor = ({ initialData, onSave }: StoryEditorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.FabricObject | null>(null);
    const [activeTool, setActiveTool] = useState<Tool>('select');
    const [showGiphyPicker, setShowGiphyPicker] = useState(false);
    const [showFontPicker, setShowFontPicker] = useState(false);

    // Drawing state
    const [brushColor, setBrushColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(4);

    // Text state
    const [fontFamily, setFontFamily] = useState('Sriracha');
    const [fontSize, setFontSize] = useState(32);
    const [fontColor, setFontColor] = useState('#064e3b');

    // Video overlays (Fabric can't natively play video, we overlay HTML <video>)
    const [videoOverlays, setVideoOverlays] = useState<VideoMeta[]>([]);

    // Upload state
    const [uploading, setUploading] = useState(false);

    // --- Canvas Scale (for responsive display) ---
    const [canvasScale, setCanvasScale] = useState(1);

    const updateScale = useCallback(() => {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.clientWidth - 32; // padding
        const scale = Math.min(1, containerWidth / CANVAS_W);
        setCanvasScale(scale);
    }, []);

    useEffect(() => {
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [updateScale]);

    // --- Initialize Fabric Canvas ---
    useEffect(() => {
        if (!canvasRef.current || fabricCanvas) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: CANVAS_W,
            height: CANVAS_H,
            backgroundColor: '#fdfbf7',
            selection: true,
        });

        setFabricCanvas(canvas);

        // Load initial data if provided
        if (initialData) {
            try {
                const parsed = typeof initialData === 'string' ? JSON.parse(initialData) : initialData;
                canvas.loadFromJSON(parsed, () => canvas.renderAll());
            } catch (e) {
                console.error('Failed to load canvas JSON:', e);
            }
        }

        // Selection events
        canvas.on('selection:created', (e: any) => setSelectedObject(e.selected?.[0] || null));
        canvas.on('selection:updated', (e: any) => setSelectedObject(e.selected?.[0] || null));
        canvas.on('selection:cleared', () => setSelectedObject(null));

        return () => {
            canvas.dispose();
            setFabricCanvas(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Toggle Drawing Mode ---
    useEffect(() => {
        if (!fabricCanvas) return;

        if (activeTool === 'draw') {
            fabricCanvas.isDrawingMode = true;
            fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
            fabricCanvas.freeDrawingBrush.color = brushColor;
            fabricCanvas.freeDrawingBrush.width = brushSize;
        } else {
            fabricCanvas.isDrawingMode = false;
        }
    }, [activeTool, fabricCanvas, brushColor, brushSize]);

    // --- Tool Actions ---

    const addText = () => {
        if (!fabricCanvas) return;
        const text = new fabric.IText('พิมพ์ข้อความ...', {
            left: CANVAS_W / 2 - 100,
            top: CANVAS_H / 2 - 20,
            fontFamily,
            fontSize,
            fill: fontColor,
            cornerColor: '#10b981',
            cornerStyle: 'circle',
            transparentCorners: false,
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        setActiveTool('select');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!fabricCanvas || !e.target.files?.[0]) return;
        const file = e.target.files[0];

        setUploading(true);
        try {
            // Upload to Cloudinary first
            const url = await uploadToCloudinary(file);

            // Load image from Cloudinary URL
            const imgObj = new Image();
            imgObj.crossOrigin = 'anonymous';
            imgObj.src = url;
            imgObj.onload = () => {
                const image = new fabric.FabricImage(imgObj);
                const MAX_WIDTH = 400;
                const scale = Math.min(MAX_WIDTH / (image.width || 1), 1);

                image.set({
                    left: CANVAS_W / 2 - (image.width || 200) * scale / 2,
                    top: CANVAS_H / 2 - (image.height || 200) * scale / 2,
                    scaleX: scale,
                    scaleY: scale,
                    cornerColor: '#10b981',
                    cornerStyle: 'circle',
                    transparentCorners: false,
                    stroke: '#fff',
                    strokeWidth: 12,
                    shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.2)', blur: 15, offsetX: 4, offsetY: 4 }),
                });

                fabricCanvas.add(image);
                fabricCanvas.setActiveObject(image);
                setUploading(false);
            };
        } catch (err) {
            console.error('Image upload failed:', err);
            alert('อัพโหลดรูปไม่สำเร็จ ลองใหม่');
            setUploading(false);
        }
        e.target.value = '';
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!fabricCanvas || !e.target.files?.[0]) return;
        const file = e.target.files[0];

        setUploading(true);
        try {
            const url = await uploadVideoToCloudinary(file);

            // Add a placeholder rectangle on canvas
            const placeholderWidth = 360;
            const placeholderHeight = 240;
            const videoId = `video_${Date.now()}`;

            const rect = new fabric.Rect({
                left: CANVAS_W / 2 - placeholderWidth / 2,
                top: CANVAS_H / 2 - placeholderHeight / 2,
                width: placeholderWidth,
                height: placeholderHeight,
                fill: '#1a1a2e',
                rx: 12,
                ry: 12,
                stroke: '#10b981',
                strokeWidth: 3,
            });

            // Custom data for video
            (rect as any).videoUrl = url;
            (rect as any).videoId = videoId;

            const label = new fabric.IText('▶ วิดีโอ', {
                left: CANVAS_W / 2 - 40,
                top: CANVAS_H / 2 - 12,
                fontSize: 24,
                fill: '#ffffff',
                fontFamily: 'Kanit',
                selectable: false,
                evented: false,
            });

            const group = new fabric.Group([rect, label], {
                left: CANVAS_W / 2 - placeholderWidth / 2,
                top: CANVAS_H / 2 - placeholderHeight / 2,
                cornerColor: '#10b981',
                cornerStyle: 'circle',
                transparentCorners: false,
            });

            (group as any).videoUrl = url;
            (group as any).videoId = videoId;

            fabricCanvas.add(group);
            fabricCanvas.setActiveObject(group);

            setVideoOverlays((prev) => [
                ...prev,
                {
                    id: videoId,
                    url,
                    left: CANVAS_W / 2 - placeholderWidth / 2,
                    top: CANVAS_H / 2 - placeholderHeight / 2,
                    width: placeholderWidth,
                    height: placeholderHeight,
                },
            ]);

            setUploading(false);
        } catch (err) {
            console.error('Video upload failed:', err);
            alert('อัพโหลดวิดีโอไม่สำเร็จ ลองใหม่');
            setUploading(false);
        }
        e.target.value = '';
    };

    const handleGifSelect = (gif: GifResult) => {
        if (!fabricCanvas) return;

        const imgObj = new Image();
        imgObj.crossOrigin = 'anonymous';
        imgObj.src = gif.url;
        imgObj.onload = () => {
            const image = new fabric.FabricImage(imgObj);
            const MAX_WIDTH = 300;
            const scale = Math.min(MAX_WIDTH / (image.width || 1), 1);

            image.set({
                left: CANVAS_W / 2 - (image.width || 200) * scale / 2,
                top: CANVAS_H / 2 - (image.height || 200) * scale / 2,
                scaleX: scale,
                scaleY: scale,
                cornerColor: '#10b981',
                cornerStyle: 'circle',
                transparentCorners: false,
            });

            // Store gif URL for renderer
            (image as any).gifUrl = gif.url;

            fabricCanvas.add(image);
            fabricCanvas.setActiveObject(image);
        };

        setShowGiphyPicker(false);
    };

    // --- Object Controls ---
    const deleteSelected = () => {
        if (!fabricCanvas || !selectedObject) return;
        fabricCanvas.remove(selectedObject);
        fabricCanvas.discardActiveObject();
        fabricCanvas.requestRenderAll();
        setSelectedObject(null);
    };

    const bringForward = () => {
        if (!fabricCanvas || !selectedObject) return;
        fabricCanvas.bringObjectForward(selectedObject);
        fabricCanvas.requestRenderAll();
    };

    const sendBackward = () => {
        if (!fabricCanvas || !selectedObject) return;
        fabricCanvas.sendObjectBackwards(selectedObject);
        fabricCanvas.requestRenderAll();
    };

    const handleSave = () => {
        if (!fabricCanvas) return;
        const json = (fabricCanvas as any).toJSON(['videoUrl', 'videoId', 'gifUrl']);
        if (onSave) onSave(json);
    };

    // --- Update selected text properties ---
    useEffect(() => {
        if (selectedObject && selectedObject.type === 'i-text') {
            (selectedObject as fabric.IText).set({
                fontFamily,
                fontSize,
                fill: fontColor,
            });
            fabricCanvas?.requestRenderAll();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fontFamily, fontSize, fontColor]);

    // --- Toolbar Buttons ---
    const tools: { id: Tool; label: string; emoji: string }[] = [
        { id: 'select', label: 'เลือก', emoji: '👆' },
        { id: 'text', label: 'ข้อความ', emoji: '📝' },
        { id: 'draw', label: 'วาดเส้น', emoji: '✏️' },
        { id: 'image', label: 'รูปภาพ', emoji: '🖼️' },
        { id: 'gif', label: 'GIF', emoji: '🎭' },
        { id: 'video', label: 'วิดีโอ', emoji: '🎬' },
    ];

    const handleToolClick = (tool: Tool) => {
        setActiveTool(tool);
        setShowFontPicker(false);

        switch (tool) {
            case 'text':
                addText();
                setShowFontPicker(true);
                break;
            case 'image':
                fileInputRef.current?.click();
                break;
            case 'gif':
                setShowGiphyPicker(true);
                break;
            case 'video':
                videoInputRef.current?.click();
                break;
        }
    };

    // Mobile toolbar expanded state
    const [mobileToolbarOpen, setMobileToolbarOpen] = useState(false);

    return (
        <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto p-2 md:p-4 relative" style={{ minHeight: '100dvh' }}>

            {/* === Desktop Sidebar (hidden on mobile) === */}
            <div className="hidden lg:flex w-56 flex-col gap-3">
                {/* Main Tools */}
                <div className="rounded-2xl shadow-md p-3" style={{ background: 'var(--paper)', border: '1px solid var(--paper-edge)' }}>
                    <h3 className="text-sm mb-3 pb-2" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--ink)', borderBottom: '1px solid var(--paper-edge)' }}>
                        เครื่องมือ 🎨
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {tools.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => handleToolClick(t.id)}
                                className="flex flex-col items-center gap-1 p-3 rounded-xl text-xs transition-all"
                                style={{
                                    background: activeTool === t.id ? 'rgba(201, 165, 92, 0.15)' : 'var(--paper-warm)',
                                    color: activeTool === t.id ? 'var(--gold-dark)' : 'var(--ink-light)',
                                    border: activeTool === t.id ? '1px solid var(--gold)' : '1px solid transparent',
                                }}
                            >
                                <span className="text-lg">{t.emoji}</span>
                                <span style={{ fontFamily: 'Kalam, cursive' }}>{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Drawing Options */}
                {activeTool === 'draw' && (
                    <div className="rounded-2xl shadow-md p-3 animate-fade-in-up" style={{ background: 'var(--paper)', border: '1px solid var(--paper-edge)' }}>
                        <h4 className="text-xs mb-2" style={{ color: 'var(--ink-faded)' }}>🎨 สีปากกา</h4>
                        <div className="flex gap-1.5 flex-wrap mb-3">
                            {BRUSH_COLORS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => setBrushColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${brushColor === c ? 'scale-110 ring-2' : ''}`}
                                    style={{
                                        backgroundColor: c,
                                        borderColor: brushColor === c ? 'var(--gold)' : 'var(--paper-edge)',
                                        boxShadow: brushColor === c ? '0 0 8px rgba(201,165,92,0.4)' : 'none',
                                    }}
                                />
                            ))}
                        </div>
                        <h4 className="text-xs mb-2" style={{ color: 'var(--ink-faded)' }}>📏 ขนาดเส้น</h4>
                        <div className="flex gap-2">
                            {BRUSH_SIZES.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setBrushSize(s)}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs transition-colors"
                                    style={{
                                        background: brushSize === s ? 'var(--gold)' : 'var(--paper-warm)',
                                        color: brushSize === s ? '#fff' : 'var(--ink-light)',
                                    }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Font Picker */}
                {showFontPicker && (
                    <div className="animate-fade-in-up">
                        <FontPicker
                            currentFont={fontFamily}
                            currentSize={fontSize}
                            currentColor={fontColor}
                            onFontChange={setFontFamily}
                            onSizeChange={setFontSize}
                            onColorChange={setFontColor}
                        />
                    </div>
                )}

                {/* Selected Object Controls */}
                {selectedObject && (
                    <div className="rounded-2xl shadow-md p-3 animate-fade-in-up" style={{ background: 'var(--paper)', border: '1px solid var(--paper-edge)' }}>
                        <h4 className="text-xs mb-2" style={{ color: 'var(--ink-faded)' }}>จัดการวัตถุ</h4>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={bringForward} className="px-3 py-2.5 rounded-lg text-xs transition-colors"
                                style={{ background: 'rgba(201,165,92,0.1)', color: 'var(--gold-dark)' }}>
                                ⬆️ ย้ายหน้า
                            </button>
                            <button onClick={sendBackward} className="px-3 py-2.5 rounded-lg text-xs transition-colors"
                                style={{ background: 'rgba(201,165,92,0.1)', color: 'var(--gold-dark)' }}>
                                ⬇️ ย้ายหลัง
                            </button>
                            <button onClick={deleteSelected} className="col-span-2 px-3 py-2.5 rounded-lg text-xs transition-colors"
                                style={{ background: 'rgba(220,38,38,0.06)', color: '#dc2626' }}>
                                🗑️ ลบทิ้ง
                            </button>
                        </div>
                        {selectedObject.type === 'i-text' && !showFontPicker && (
                            <button
                                onClick={() => setShowFontPicker(true)}
                                className="w-full mt-2 px-3 py-2.5 rounded-lg text-xs transition-colors"
                                style={{ background: 'rgba(201,165,92,0.1)', color: 'var(--gold-dark)' }}
                            >
                                🔤 แก้ไขฟอนต์/สี
                            </button>
                        )}
                    </div>
                )}

                {/* Desktop Save Button */}
                <button
                    onClick={handleSave}
                    disabled={uploading}
                    className="mt-auto px-6 py-3 rounded-xl shadow-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                        background: 'var(--leather)',
                        color: 'var(--gold-light)',
                    }}
                >
                    {uploading ? '⏳ กำลังอัพโหลด...' : '💾 บันทึกหน้า'}
                </button>
            </div>

            {/* === Canvas Area === */}
            <div
                ref={containerRef}
                className="flex-1 overflow-auto p-3 md:p-4 rounded-2xl shadow-inner flex justify-center items-start"
                style={{ background: 'var(--paper-edge)', minHeight: '60dvh' }}
            >
                <div
                    className="shadow-2xl relative rounded-sm"
                    style={{
                        transform: `scale(${canvasScale})`,
                        transformOrigin: 'top center',
                        width: CANVAS_W,
                        height: CANVAS_H,
                        background: '#fdfbf7',
                    }}
                >
                    <canvas ref={canvasRef} />

                    {/* Video overlays in editor */}
                    {videoOverlays.map((v) => (
                        <div
                            key={v.id}
                            className="absolute pointer-events-none rounded-lg overflow-hidden"
                            style={{
                                left: v.left,
                                top: v.top,
                                width: v.width,
                                height: v.height,
                            }}
                        >
                            <video
                                src={v.url}
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* === Mobile Bottom Toolbar (visible only on mobile) === */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
                {/* Expanded Panel */}
                {mobileToolbarOpen && (
                    <div
                        className="mx-2 mb-2 rounded-2xl shadow-xl p-4 animate-slide-up max-h-[50dvh] overflow-y-auto"
                        style={{ background: 'var(--paper)', border: '1px solid var(--paper-edge)' }}
                    >
                        {/* Drawing Options */}
                        {activeTool === 'draw' && (
                            <div className="mb-3">
                                <h4 className="text-xs mb-2" style={{ color: 'var(--ink-faded)' }}>🎨 สี</h4>
                                <div className="flex gap-2 flex-wrap mb-3">
                                    {BRUSH_COLORS.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setBrushColor(c)}
                                            className="w-10 h-10 rounded-full border-2 transition-transform active:scale-90"
                                            style={{
                                                backgroundColor: c,
                                                borderColor: brushColor === c ? 'var(--gold)' : 'var(--paper-edge)',
                                            }}
                                        />
                                    ))}
                                </div>
                                <h4 className="text-xs mb-2" style={{ color: 'var(--ink-faded)' }}>📏 ขนาด</h4>
                                <div className="flex gap-2">
                                    {BRUSH_SIZES.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setBrushSize(s)}
                                            className="w-11 h-11 rounded-lg flex items-center justify-center text-sm transition-colors"
                                            style={{
                                                background: brushSize === s ? 'var(--gold)' : 'var(--paper-warm)',
                                                color: brushSize === s ? '#fff' : 'var(--ink-light)',
                                            }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Font Picker */}
                        {showFontPicker && (
                            <FontPicker
                                currentFont={fontFamily}
                                currentSize={fontSize}
                                currentColor={fontColor}
                                onFontChange={setFontFamily}
                                onSizeChange={setFontSize}
                                onColorChange={setFontColor}
                            />
                        )}

                        {/* Object Controls */}
                        {selectedObject && (
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <button onClick={bringForward} className="py-3 rounded-lg text-xs"
                                    style={{ background: 'rgba(201,165,92,0.1)', color: 'var(--gold-dark)' }}>
                                    ⬆️ หน้า
                                </button>
                                <button onClick={sendBackward} className="py-3 rounded-lg text-xs"
                                    style={{ background: 'rgba(201,165,92,0.1)', color: 'var(--gold-dark)' }}>
                                    ⬇️ หลัง
                                </button>
                                <button onClick={deleteSelected} className="py-3 rounded-lg text-xs"
                                    style={{ background: 'rgba(220,38,38,0.06)', color: '#dc2626' }}>
                                    🗑️ ลบ
                                </button>
                            </div>
                        )}

                        {/* Mobile Save */}
                        <button
                            onClick={handleSave}
                            disabled={uploading}
                            className="w-full py-3.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
                            style={{ background: 'var(--leather)', color: 'var(--gold-light)' }}
                        >
                            {uploading ? '⏳ กำลังอัพโหลด...' : '💾 บันทึกหน้า'}
                        </button>
                    </div>
                )}

                {/* Bottom Tool Bar — always visible on mobile */}
                <div
                    className="flex items-center gap-1 px-2 py-2 safe-bottom"
                    style={{ background: 'var(--paper)', borderTop: '1px solid var(--paper-edge)', paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
                >
                    {tools.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => { handleToolClick(t.id); setMobileToolbarOpen(true); }}
                            className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] transition-all active:scale-90"
                            style={{
                                background: activeTool === t.id ? 'rgba(201,165,92,0.15)' : 'transparent',
                                color: activeTool === t.id ? 'var(--gold-dark)' : 'var(--ink-faded)',
                                minHeight: '48px',
                            }}
                        >
                            <span className="text-lg">{t.emoji}</span>
                            <span style={{ fontFamily: 'Kanit, sans-serif' }}>{t.label}</span>
                        </button>
                    ))}
                    <button
                        onClick={() => setMobileToolbarOpen(!mobileToolbarOpen)}
                        className="px-3 py-2 rounded-xl text-lg transition-all active:scale-90"
                        style={{ color: 'var(--ink-faded)', minHeight: '48px' }}
                    >
                        {mobileToolbarOpen ? '▼' : '▲'}
                    </button>
                </div>
            </div>

            {/* Hidden File Inputs */}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />

            {/* Giphy Picker Modal */}
            {showGiphyPicker && (
                <GiphyPicker
                    onSelect={handleGifSelect}
                    onClose={() => setShowGiphyPicker(false)}
                />
            )}

            {/* Upload Overlay */}
            {uploading && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    <div className="rounded-2xl p-8 shadow-2xl text-center" style={{ background: 'var(--paper)' }}>
                        <div className="spinner-journal mx-auto mb-4"></div>
                        <p className="text-lg" style={{ color: 'var(--ink-light)', fontFamily: 'Kalam, cursive' }}>
                            กำลังอัพโหลด...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryEditor;
