'use client';

import { useState, useEffect, useCallback } from 'react';

interface UsePageFlipOptions {
    totalPages: number;
    onPageChange?: (pageIndex: number) => void;
}

export function usePageFlip({ totalPages, onPageChange }: UsePageFlipOptions) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState<'left' | 'right' | null>(null);

    const canGoNext = currentPage < totalPages - 1;
    const canGoPrev = currentPage > 0;

    const goToPage = useCallback((index: number) => {
        if (index < 0 || index >= totalPages || isFlipping) return;

        const dir = index > currentPage ? 'right' : 'left';
        setFlipDirection(dir);
        setIsFlipping(true);

        setTimeout(() => {
            setCurrentPage(index);
            onPageChange?.(index);
            setIsFlipping(false);
            setFlipDirection(null);
        }, 400); // Match CSS animation duration
    }, [currentPage, totalPages, isFlipping, onPageChange]);

    const nextPage = useCallback(() => {
        if (canGoNext) goToPage(currentPage + 1);
    }, [canGoNext, currentPage, goToPage]);

    const prevPage = useCallback(() => {
        if (canGoPrev) goToPage(currentPage - 1);
    }, [canGoPrev, currentPage, goToPage]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextPage();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevPage();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextPage, prevPage]);

    // Touch swipe detection
    const [touchStart, setTouchStart] = useState<number | null>(null);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setTouchStart(e.touches[0].clientX);
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (touchStart === null) return;
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStart - touchEnd;

        if (Math.abs(diff) > 50) { // minimum swipe distance
            if (diff > 0) nextPage();  // swipe left = next
            else prevPage();            // swipe right = prev
        }
        setTouchStart(null);
    }, [touchStart, nextPage, prevPage]);

    return {
        currentPage,
        isFlipping,
        flipDirection,
        canGoNext,
        canGoPrev,
        nextPage,
        prevPage,
        goToPage,
        handleTouchStart,
        handleTouchEnd,
        totalPages,
    };
}
