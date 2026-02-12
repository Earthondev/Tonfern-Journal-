import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, off, get } from "firebase/database";
import { JournalPage, TOCItem } from "@/types/journal";

// Mock data as fallback
const mockToc: TOCItem[] = [
    { id: "1", title: "หน้าปก", order: 1 },
    { id: "2", title: "สารบัญ", order: 2 },
];

const mockPages: Record<string, JournalPage> = {
    "1": {
        id: "1",
        title: "Tonfern Journal",
        layout: "cover",
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    "2": {
        id: "2",
        title: "สารบัญ",
        layout: "toc",
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
};

export function useJournalData() {
    const [toc, setToc] = useState<TOCItem[]>([]);
    const [page, setPage] = useState<JournalPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load TOC on mount
    useEffect(() => {
        const tocRef = ref(db, "pages"); // Use 'pages' to build TOC dynamically or 'toc/items' if specialized

        // Subscribe to changes (Realtime)
        const unsubscribe = onValue(tocRef, (snapshot) => {
            setLoading(true);
            try {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Convert object to array
                    const pagesList: JournalPage[] = Object.values(data);

                    // Map to TOC Items and Sort
                    const sortedToc = pagesList
                        .map(p => ({ id: p.id, title: p.title, order: p.order || 999 }))
                        .sort((a, b) => a.order - b.order);

                    setToc(sortedToc);

                    // If no page selected, select first one
                    if (!page && sortedToc.length > 0) {
                        // Initial load: prefer first page
                        // We can load full content here or lazy load
                        // For simplicity, let's just trigger loadPage logic separately or set it
                        loadPage(sortedToc[0].id);
                    }
                } else {
                    // Fallback to mock if empty
                    setToc(mockToc);
                    setPage(mockPages["1"]);
                }
            } catch (err) {
                console.error("Error processing journal data:", err);
                setError("Failed to load journal.");
                // Fallback
                setToc(mockToc);
                setPage(mockPages["1"]);
            } finally {
                setLoading(false);
            }
        }, (error) => {
            console.error("Firebase read error:", error);
            setError(error.message);
            setLoading(false);
        });

        // Cleanup subscription (Tier 1: Memory Control)
        return () => off(tocRef);
    }, []); // Empty dependency array = run once on mount

    // Function to load specific page content
    const loadPage = async (pageId: string) => {
        try {
            // Check if we already have it in TOC list (optimization)
            // But for full content (blocks, etc), better fetch fresh or use passed data
            const pageRef = ref(db, `pages/${pageId}`);
            const snapshot = await get(pageRef);

            if (snapshot.exists()) {
                setPage(snapshot.val());
            } else {
                // Fallback or specific mock
                setPage(mockPages[pageId] || null);
            }
        } catch (err) {
            console.error("Error loading page:", err);
            // Keep current page or show error State
        }
    };

    return { toc, page, loading, error, loadPage };
}
