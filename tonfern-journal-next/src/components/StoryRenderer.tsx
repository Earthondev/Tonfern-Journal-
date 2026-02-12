'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as fabric from 'fabric';

const CANVAS_W = 1080;
const CANVAS_H = 1350;

// ─── Types ──────────────────────────────────
interface VideoOverlay {
    id: string;
    url: string;
    left: number;
    top: number;
    width: number;
    height: number;
}

interface StoryRendererProps {
    content: string; // JSON string from Fabric.js canvas
}

const StoryRenderer = ({ content }: StoryRendererProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [canvasReady, setCanvasReady] = useState(false);

    // Extract video overlays from canvas JSON
    const videoOverlays = useMemo<VideoOverlay[]>(() => {
        if (!content) return [];
        try {
            const json = typeof content === 'string' ? JSON.parse(content) : content;
            const objects = json.objects || [];
            return objects
                .filter((obj: Record<string, unknown>) =>
                    obj.type === 'rect' &&
                    typeof obj.videoUrl === 'string'
                )
                .map((obj: Record<string, unknown>) => ({
                    id: (obj.videoUrl as string),
                    url: obj.videoUrl as string,
                    left: (obj.left as number) || 0,
                    top: (obj.top as number) || 0,
                    width: ((obj.width as number) || 200) * ((obj.scaleX as number) || 1),
                    height: ((obj.height as number) || 150) * ((obj.scaleY as number) || 1),
                }));
        } catch {
            return [];
        }
    }, [content]);

    // Responsive scaling
    const updateScale = useCallback(() => {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.clientWidth;
        const newScale = Math.min(1, containerWidth / CANVAS_W);
        setScale(newScale);
    }, []);

    useEffect(() => {
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [updateScale]);

    // Render canvas
    useEffect(() => {
        if (!canvasRef.current || !content) return;

        let staticCanvas: fabric.StaticCanvas | null = null;
        setCanvasReady(false);

        try {
            const json = typeof content === 'string' ? JSON.parse(content) : content;

            staticCanvas = new fabric.StaticCanvas(canvasRef.current, {
                width: CANVAS_W,
                height: CANVAS_H,
                backgroundColor: '#fdfbf7',
                renderOnAddRemove: false,
            });

            staticCanvas.loadFromJSON(json, () => {
                staticCanvas?.renderAll();
                setCanvasReady(true);
            });
        } catch (err) {
            console.error('Error rendering story:', err);
        }

        return () => {
            staticCanvas?.dispose();
        };
    }, [content]);

    return (
        <div ref={containerRef} className="w-full flex justify-center">
            <div
                className="relative overflow-hidden"
                style={{
                    width: CANVAS_W * scale,
                    height: CANVAS_H * scale,
                    background: 'var(--paper, #fdfbf7)',
                }}
            >
                {/* Canvas Layer */}
                <div
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        width: CANVAS_W,
                        height: CANVAS_H,
                    }}
                >
                    <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} />
                </div>

                {/* Video Overlay Layer */}
                {canvasReady && videoOverlays.map((v) => (
                    <div
                        key={v.id}
                        className="absolute overflow-hidden rounded-sm"
                        style={{
                            left: v.left * scale,
                            top: v.top * scale,
                            width: v.width * scale,
                            height: v.height * scale,
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
    );
};

export default StoryRenderer;
