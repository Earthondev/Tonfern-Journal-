"use client";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { useJournalData } from "@/hooks/useJournalData";

export default function Home() {
  const { toc, page, loading, loadPage } = useJournalData();
  const [isBookOpen, setIsBookOpen] = useState(false);

  const handleOpenBook = () => {
    setIsBookOpen(true);
  };

  if (loading) {
    return (
      <main className="min-h-dvh grid place-items-center bg-[#f0f4f8]">
        <div className="text-center">
          {/* Add texture overlay to prevent plain color in production */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600 font-handwriting text-xl">กำลังหยิบสมุด...</p>
        </div>
      </main>
    );
  }

  // Cover View
  if (!isBookOpen) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center bg-stone-100 p-4 perspective-1000">
        <div
          onClick={handleOpenBook}
          className="cursor-pointer group relative w-full max-w-md aspect-[3/4] bg-emerald-800 rounded-r-3xl rounded-l-md shadow-2xl transform transition-transform duration-500 hover:rotate-y-[-5deg] hover:scale-[1.02] flex flex-col items-center justify-center text-center border-l-8 border-emerald-900"
        >
          {/* Leather Texture Effect */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 rounded-r-3xl rounded-l-md pointer-events-none"></div>

          {/* Book Title */}
          <div className="relative z-10 p-8 border-2 border-emerald-600/50 m-6 rounded-xl bg-emerald-900/10 backdrop-blur-sm">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-amber-100 mb-4 drop-shadow-md">
              Tonfern<br />Journal
            </h1>
            <p className="text-emerald-200 font-handwriting text-xl">
              บันทึกเรื่องราวของเฟิร์น
            </p>
          </div>

          <div className="absolute bottom-8 text-emerald-300/60 text-sm animate-bounce">
            แตะเพื่อเปิดอ่าน
          </div>
        </div>

        {/* Subtle Login Link at bottom for Owner */}
        <div className="mt-12 opacity-50 hover:opacity-100 transition-opacity">
          <Navigation />
        </div>
      </main>
    );
  }

  // Journal View (Opened)
  return (
    <main className="min-h-dvh bg-stone-100 p-4 md:p-8 transition-colors duration-700">

      {/* Top Navigation Bar */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
        <button
          onClick={() => setIsBookOpen(false)}
          className="text-emerald-800 hover:bg-emerald-100 px-4 py-2 rounded-full transition-colors font-handwriting text-lg flex items-center gap-2"
        >
          📕 ปิดสมุด
        </button>
        <Navigation />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start">

        {/* Sidebar / TOC */}
        <nav className="w-full md:w-64 glass-card rounded-xl p-6 sticky top-8 max-h-[80vh] overflow-y-auto">
          <h3 className="font-serif text-xl text-emerald-900 mb-4 border-b border-emerald-100 pb-2">สารบัญ</h3>
          <ul className="space-y-2">
            {toc.map((it) => (
              <li key={it.id}>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all font-handwriting text-lg ${page?.id === it.id
                    ? 'bg-emerald-100 text-emerald-800 font-bold translate-x-1 shadow-sm'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-emerald-700'
                    }`}
                  onClick={() => loadPage(it.id)}
                >
                  {it.order}. {it.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Page Content (Paper Look) */}
        <div className="flex-1 w-full">
          {page ? (
            <article className="bg-[#fdfbf7] min-h-[800px] w-full rounded-sm shadow-xl p-8 md:p-12 relative mx-auto max-w-4xl" style={{
              backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px)',
              backgroundSize: '100% 2rem',
              boxShadow: '2px 3px 20px rgba(0,0,0,0.1), inset 0 0 60px rgba(0,0,0,0.05)'
            }}>
              {/* Paper Holes */}
              <div className="absolute left-4 top-0 bottom-0 flex flex-col gap-8 py-8">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-stone-200 shadow-inner"></div>
                ))}
              </div>

              <div className="pl-8 md:pl-12">
                <h2 className="text-4xl font-handwriting font-bold text-emerald-900 mb-6 leading-relaxed">
                  {typeof page.title === "string" ? page.title : (page.title as any)?.th || (page.title as any)?.en}
                </h2>

                <div className="text-stone-500 font-handwriting text-sm mb-8 flex items-center gap-2">
                  📅 {new Date(page.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                {/* Media Content */}
                {page.media?.type === "image" && (
                  <div className="transform -rotate-1 mb-8 p-3 bg-white shadow-lg inline-block">
                    <img
                      src={page.media.src}
                      className="max-w-full rounded-sm max-h-[500px] object-cover"
                      alt="Journal Memory"
                    />
                    {page.caption && <p className="text-center font-handwriting text-stone-600 mt-2">{page.caption}</p>}
                  </div>
                )}

                {page.media?.type === "pdf" && (
                  <div className="mb-8 w-full h-[600px] bg-stone-100 border-2 border-dashed border-stone-300 rounded-lg overflow-hidden">
                    <iframe
                      src={`${page.media.src}#toolbar=0&navpanes=0`}
                      className="w-full h-full"
                      title="PDF Viewer"
                    />
                  </div>
                )}

                {/* Text Content Area (Currently using caption as main text if no blocks) */}
                {page.caption && page.media?.type !== "image" && (
                  <p className="text-xl font-handwriting text-stone-800 leading-10 tracking-wide">
                    {page.caption}
                  </p>
                )}

                {/* Blocks (Notes, Tapes, Polaroids) */}
                {page.blocks && (
                  <div className="relative h-[500px] w-full mt-8 border-t border-dashed border-emerald-100 pt-8">
                    {page.blocks.map((block, idx) => (
                      <div
                        key={idx}
                        className="absolute transform p-4 bg-yellow-100 shadow-md font-handwriting text-lg rotate-2"
                        style={{
                          left: block.x / 2,
                          top: block.y / 2,
                          transform: `rotate(${block.rot || 0}deg)`
                        }}
                      >
                        📌 {block.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ) : (
            <div className="text-center p-12 opacity-50">
              เลือกหน้าจากสารบัญเพื่ออ่าน...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
