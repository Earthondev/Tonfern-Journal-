'use client';

import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

interface StoryRendererProps {
    content: string; // JSON string
}

const StoryRenderer = ({ content }: StoryRendererProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !content) return;

        let staticCanvas: fabric.StaticCanvas | null = null;

        try {
            const json = JSON.parse(content);

            // Initialize Static Canvas (Read-only)
            staticCanvas = new fabric.StaticCanvas(canvasRef.current, {
                backgroundColor: '#fdfbf7', // Paper color
                renderOnAddRemove: false, // Performance optimization
            });

            // Load data
            staticCanvas.loadFromJSON(json, () => {
                staticCanvas?.renderAll();

                // Responsive Scaling Logic
                if (containerRef.current) {
                    const containerWidth = containerRef.current.clientWidth;
                    const originalWidth = 800; // Original canvas width
                    const scale = containerWidth / originalWidth;

                    // If screen is smaller than canvas, scale down
                    if (scale < 1) {
                        staticCanvas?.setZoom(scale);
                        staticCanvas?.setDimensions({
                            width: originalWidth * scale,
                            height: 1000 * scale // 1000 is original height
                        });
                    }
                }
            });

        } catch (err) {
            console.error('Error rendering story:', err);
        }

        // Cleanup (Tier 1: Memory Control)
        return () => {
            staticCanvas?.dispose();
        };
    }, [content]);

    return (
        <div ref={containerRef} className="w-full flex justify-center overflow-hidden rounded-lg shadow-xl border-4 border-white">
            {/* 
         Story Container:
         - Centered
         - White border (like a photo album slot)
         - Shadow for depth
      */}
            <canvas ref={canvasRef} width={800} height={1000} />
        </div>
    );
};

export default StoryRenderer;
