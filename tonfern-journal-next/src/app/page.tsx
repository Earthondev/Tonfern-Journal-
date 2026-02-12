"use client";

import { useState, useMemo } from "react";
import dynamic from 'next/dynamic';
import Navigation from "@/components/Navigation";
import { useJournalData } from "@/hooks/useJournalData";
import { usePageFlip } from "@/hooks/usePageFlip";

const StoryRenderer = dynamic(() => import('@/components/StoryRenderer'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-lg animate-pulse" style={{ background: 'var(--paper-warm)' }} />
  ),
});

export default function Home() {
  const { toc, page, loading, loadPage } = useJournalData();
  const [isBookOpen, setIsBookOpen] = useState(false);

  const pageFlip = usePageFlip({
    totalPages: toc.length,
    onPageChange: (idx) => {
      if (toc[idx]) loadPage(toc[idx].id);
    },
  });

  const sortedToc = useMemo(() => [...toc].sort((a, b) => (a.order || 0) - (b.order || 0)), [toc]);

  const handleOpenBook = () => {
    setIsBookOpen(true);
    if (sortedToc.length > 0) loadPage(sortedToc[0].id);
  };

  // ─── Loading ─────────────────────────────
  if (loading) {
    return (
      <main className="min-h-dvh grid place-items-center" style={{ background: 'var(--paper)' }}>
        <div className="text-center animate-fade-in">
          <div className="spinner-journal mx-auto mb-6"></div>
          <p className="text-lg tracking-wide" style={{ color: 'var(--ink-faded)', fontFamily: 'Kalam, cursive' }}>
            กำลังหยิบสมุด...
          </p>
        </div>
      </main>
    );
  }

  // ─── Cover View ──────────────────────────
  if (!isBookOpen) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center p-6" style={{ background: 'var(--paper)' }}>

        {/* Decorative Corner Flourishes */}
        <div className="fixed top-6 left-6 w-16 h-16 opacity-10" style={{ color: 'var(--gold)' }}>
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M0,0 Q50,0 50,50 Q50,0 100,0 L100,0 Q50,0 50,50 L0,0Z" opacity="0.6" />
            <path d="M0,10 C20,10 10,30 30,30 C10,30 20,50 0,50" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* The Book */}
        <div
          onClick={handleOpenBook}
          className="book-cover book-spine cursor-pointer group relative w-full max-w-sm aspect-[3/4] rounded-r-2xl rounded-l-sm flex flex-col items-center justify-center text-center transition-all duration-700 hover:scale-[1.02] animate-fade-in-up"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Gold corner decorations */}
          <div className="absolute top-4 left-6 right-4 h-px opacity-20" style={{ background: 'var(--gold)' }} />
          <div className="absolute bottom-4 left-6 right-4 h-px opacity-20" style={{ background: 'var(--gold)' }} />
          <div className="absolute top-4 bottom-4 left-6 w-px opacity-20" style={{ background: 'var(--gold)' }} />
          <div className="absolute top-4 bottom-4 right-4 w-px opacity-20" style={{ background: 'var(--gold)' }} />

          {/* Gold corners */}
          {[['top-3 left-5', ''], ['top-3 right-3', 'rotate-90'], ['bottom-3 left-5', '-rotate-90'], ['bottom-3 right-3', 'rotate-180']].map(([pos, rot], i) => (
            <div key={i} className={`absolute ${pos} w-6 h-6 ${rot}`} style={{ color: 'var(--gold-light)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M0,12 L0,2 Q0,0 2,0 L12,0" />
              </svg>
            </div>
          ))}

          {/* Title Panel */}
          <div className="relative z-10 px-10 py-8 m-8" style={{
            border: '1.5px solid rgba(201, 165, 92, 0.3)',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.08)',
          }}>
            {/* Embossed Title */}
            <h1 className="book-title font-['Playfair_Display',serif] text-5xl md:text-6xl font-bold mb-3 leading-tight">
              Tonfern<br />Journal
            </h1>

            {/* Divider Line */}
            <div className="w-16 h-px mx-auto my-4 animate-shimmer" style={{ background: 'var(--gold)' }} />

            <p className="text-lg tracking-widest uppercase" style={{
              color: 'rgba(223, 200, 138, 0.7)',
              fontFamily: 'Crimson Pro, serif',
              fontSize: '14px',
              letterSpacing: '0.2em',
            }}>
              บันทึกเรื่องราวของเฟิร์น
            </p>
          </div>

          {/* Bottom CTA */}
          <div className="absolute bottom-10 animate-breathe" style={{
            color: 'rgba(223, 200, 138, 0.45)',
            fontFamily: 'Crimson Pro, serif',
            fontSize: '13px',
            letterSpacing: '0.15em',
          }}>
            แตะเพื่อเปิดอ่าน
          </div>

          {/* Hover shimmer overlay */}
          <div className="absolute inset-0 rounded-r-2xl rounded-l-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: 'linear-gradient(135deg, transparent 40%, rgba(201, 165, 92, 0.06) 50%, transparent 60%)',
            }}
          />
        </div>

        {/* Navigation Link */}
        <div className="mt-16 opacity-30 hover:opacity-80 transition-opacity duration-500">
          <Navigation />
        </div>
      </main>
    );
  }

  // ─── Page Flip Reader ────────────────────
  return (
    <main
      className="min-h-dvh flex flex-col"
      style={{ background: 'var(--paper)' }}
      onTouchStart={pageFlip.handleTouchStart}
      onTouchEnd={pageFlip.handleTouchEnd}
    >
      {/* Top Bar */}
      <div className="reader-bar flex-none px-5 py-3 flex justify-between items-center">
        <button
          onClick={() => setIsBookOpen(false)}
          className="px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 hover:scale-105"
          style={{
            color: 'var(--ink-light)',
            fontFamily: 'Kalam, cursive',
            fontSize: '16px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201, 165, 92, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          📕 ปิดสมุด
        </button>

        {/* Page Counter */}
        <div className="flex items-center gap-3" style={{
          color: 'var(--ink-faded)',
          fontFamily: 'Crimson Pro, serif',
          fontSize: '14px',
          letterSpacing: '0.05em',
        }}>
          <span style={{ color: 'var(--gold-dark)' }}>{pageFlip.currentPage + 1}</span>
          <span className="opacity-40">/</span>
          <span>{sortedToc.length}</span>
        </div>

        <Navigation />
      </div>

      {/* Page Content Area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden px-3 py-4 md:px-12 md:py-8 animate-cover-open">

        {/* Left Arrow */}
        <button
          onClick={pageFlip.prevPage}
          disabled={!pageFlip.canGoPrev || pageFlip.isFlipping}
          className="nav-arrow hidden md:flex absolute left-6 z-10"
        >
          ‹
        </button>

        {/* The Page */}
        <div
          className={`w-full max-w-lg mx-auto ${pageFlip.isFlipping
              ? pageFlip.flipDirection === 'right'
                ? 'animate-flip-right'
                : 'animate-flip-left'
              : ''
            }`}
        >
          {page ? (
            <div className="journal-page rounded overflow-hidden">
              {/* Top decorative edge */}
              <div className="h-px w-full" style={{
                background: 'linear-gradient(90deg, transparent, var(--gold-light), transparent)',
                opacity: 0.2,
              }} />

              {/* Story Layout */}
              {page.layout === 'story' && page.content && (
                <StoryRenderer content={page.content} />
              )}

              {/* Image Layout */}
              {page.media?.type === "image" && page.layout !== 'story' && (
                <div className="p-6 md:p-10">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{
                    fontFamily: 'Kalam, cursive',
                    color: 'var(--ink)',
                  }}>
                    {typeof page.title === "string" ? page.title : (page.title as any)?.th}
                  </h2>
                  <div className="polaroid inline-block">
                    <img
                      src={page.media.src}
                      className="max-w-full rounded-sm max-h-[500px] object-cover"
                      alt="Journal Memory"
                    />
                  </div>
                  {page.caption && (
                    <p className="mt-5 text-lg" style={{
                      fontFamily: 'Kalam, cursive',
                      color: 'var(--ink-faded)',
                    }}>{page.caption}</p>
                  )}
                </div>
              )}

              {/* PDF Layout */}
              {page.media?.type === "pdf" && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4" style={{
                    fontFamily: 'Kalam, cursive',
                    color: 'var(--ink)',
                  }}>
                    {typeof page.title === "string" ? page.title : (page.title as any)?.th}
                  </h2>
                  <div className="w-full h-[500px] rounded-lg overflow-hidden" style={{
                    border: '2px dashed var(--paper-edge)',
                    background: 'var(--paper-warm)',
                  }}>
                    <iframe
                      src={`${page.media.src}#toolbar=0&navpanes=0`}
                      className="w-full h-full"
                      title="PDF Viewer"
                    />
                  </div>
                </div>
              )}

              {/* Fallback: Text page */}
              {!page.content && !page.media && (
                <div className="p-8 md:p-12 min-h-[400px]">
                  <h2 className="text-3xl font-bold mb-6" style={{
                    fontFamily: 'Playfair Display, serif',
                    color: 'var(--ink)',
                  }}>
                    {typeof page.title === "string" ? page.title : (page.title as any)?.th}
                  </h2>
                  {page.caption && (
                    <p className="text-xl leading-relaxed" style={{
                      fontFamily: 'Kalam, cursive',
                      color: 'var(--ink-light)',
                      lineHeight: '2.2',
                    }}>
                      {page.caption}
                    </p>
                  )}
                </div>
              )}

              {/* Bottom decorative edge + page number */}
              <div className="relative h-10">
                <div className="absolute top-0 left-0 right-0 h-px" style={{
                  background: 'linear-gradient(90deg, transparent, var(--gold-light), transparent)',
                  opacity: 0.15,
                }} />
                <div className="absolute bottom-2 right-5 text-xs" style={{
                  color: 'var(--rose-faded)',
                  fontFamily: 'Crimson Pro, serif',
                  fontStyle: 'italic',
                }}>
                  — {pageFlip.currentPage + 1} —
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-16 rounded-lg animate-fade-in" style={{
              background: 'rgba(245, 240, 232, 0.5)',
            }}>
              <p style={{ color: 'var(--ink-faded)', fontFamily: 'Kalam, cursive' }}>
                ยังไม่มีเนื้อหา...
              </p>
            </div>
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={pageFlip.nextPage}
          disabled={!pageFlip.canGoNext || pageFlip.isFlipping}
          className="nav-arrow hidden md:flex absolute right-6 z-10"
        >
          ›
        </button>
      </div>

      {/* Bottom Dots (Mobile) */}
      <div className="flex-none py-4 flex justify-center gap-2 md:hidden">
        {sortedToc.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              pageFlip.goToPage(idx);
              loadPage(sortedToc[idx].id);
            }}
            className={`page-dot ${pageFlip.currentPage === idx ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Mobile Swipe Hint */}
      <div className="flex-none pb-5 text-center md:hidden" style={{
        color: 'var(--ink-faded)',
        fontFamily: 'Crimson Pro, serif',
        fontSize: '12px',
        letterSpacing: '0.1em',
        opacity: 0.5,
      }}>
        ← ปัดซ้าย-ขวาเพื่อพลิกหน้า →
      </div>
    </main>
  );
}
