"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { JournalPage, TOCItem } from "@/types/journal";
import Navigation from "@/components/Navigation";

// Mock data for demo (fallback) - using static dates to avoid hydration mismatch
const mockToc: TOCItem[] = [
  { id: "1", title: "หน้าปก", order: 1 },
  { id: "2", title: "สารบัญ", order: 2 },
  { id: "3", title: "หน้าแรก", order: 3 },
  { id: "4", title: "เรื่องราว", order: 4 },
  { id: "5", title: "บันทึก", order: 5 },
];

const mockPages: Record<string, JournalPage> = {
  "1": {
    id: "1",
    title: "Tonfern Journal",
    layout: "cover",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  "2": {
    id: "2",
    title: "สารบัญ",
    layout: "toc",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  "3": {
    id: "3",
    title: "หน้าแรก",
    layout: "documentA4",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      alt: "หน้าแรก"
    },
    caption: "เริ่มต้นการเดินทางใหม่",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  "4": {
    id: "4",
    title: "เรื่องราว",
    layout: "story",
    media: {
      type: "pdf",
      src: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
      page: 1
    },
    caption: "เรื่องราวที่น่าสนใจ",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
  "5": {
    id: "5",
    title: "บันทึก",
    layout: "scrapbook",
    blocks: [
      { type: "note", content: "บันทึกความทรงจำ", x: 100, y: 100, rotation: 15 },
      { type: "polaroid", content: "รูปภาพ", x: 300, y: 150, rotation: -10 },
      { type: "tape", content: "เทป", x: 200, y: 300, rotation: 45 }
    ],
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
};

export default function Home() {
  const [toc, setToc] = useState<TOCItem[]>(mockToc);
  const [page, setPage] = useState<JournalPage|null>(mockPages["1"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Try to load from Firebase first
      const tocRef = ref(db, "toc/items");
      const tocSnapshot = await get(tocRef);
      
      if (tocSnapshot.exists()) {
        const tocData = tocSnapshot.val();
        setToc(tocData);
        
        // Load first page
        if (tocData.length > 0) {
          await loadPage(tocData[0].id);
        }
      } else {
        // Use mock data if Firebase is empty
        setToc(mockToc);
        setPage(mockPages["1"]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      // Fallback to mock data
      setToc(mockToc);
      setPage(mockPages["1"]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPage = async (pageId: string) => {
    try {
      const pageRef = ref(db, `pages/${pageId}`);
      const pageSnapshot = await get(pageRef);
      
      if (pageSnapshot.exists()) {
        setPage(pageSnapshot.val());
      } else {
        // Fallback to mock data
        setPage(mockPages[pageId] || null);
      }
    } catch (error) {
      console.error("Error loading page:", error);
      // Fallback to mock data
      setPage(mockPages[pageId] || null);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-dvh grid place-items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">กำลังโหลด...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh p-6 grid gap-6">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <header className="glass-card rounded-3xl p-6 text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold font-serif text-emerald-800 text-shadow mb-2">
          Tonfern Journal
        </h1>
        <p className="text-lg text-emerald-700 font-handwriting">
          บันทึกความทรงจำและเรื่องราว
        </p>
      </header>

      {/* TOC */}
      <nav className="glass-card rounded-2xl p-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        <ul className="flex gap-3 flex-wrap justify-center">
          {toc.map((it) => (
            <li key={it.id}>
              <button 
                className="px-4 py-2 rounded-xl border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-300 text-emerald-800 font-medium hover:shadow-lg transform hover:-translate-y-1"
                onClick={() => loadPage(it.id)}
              >
                {it.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Page content */}
      {page && (
        <section className="glass-card w-full max-w-4xl rounded-3xl p-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <h2 className="text-2xl font-bold text-center font-serif text-emerald-800 text-shadow mb-6">
            {typeof page.title === "string" ? page.title : (page.title as any)?.th || (page.title as any)?.en}
          </h2>
          
          {/* Media content */}
          {(page.media?.type === "image") && (
            <div className="mb-6">
              <img 
                src={page.media.src} 
                className="w-full rounded-2xl shadow-2xl" 
                alt="page"
              />
            </div>
          )}
          
          {(page.media?.type === "pdf") && (
            <div className="mb-6">
              <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-2">📄 PDF Document</p>
                  <a 
                    href={page.media.src} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    เปิดดู PDF
                  </a>
                </div>
              </div>
            </div>
          )}
          
          {/* Caption */}
          {page.caption && (
            <div className="text-center">
              <p className="italic text-lg text-emerald-700 font-handwriting text-shadow">
                {typeof page.caption === "string" ? page.caption : (page.caption as any)?.th || (page.caption as any).en}
              </p>
            </div>
          )}

          {/* Note */}
          {page.note && (
            <div className="text-center mt-4">
              <p className="text-sm text-emerald-600 font-handwriting">
                📝 {page.note}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Footer */}
      <footer className="glass-card rounded-2xl p-4 text-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
        <p className="text-emerald-700 font-handwriting">
          ✨ สร้างด้วย Next.js และ Tailwind CSS ✨
        </p>
      </footer>
    </main>
  );
}
