import { useState, useEffect, useRef } from "react";
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

const FIREBASE_TIMEOUT_MS = 8000; // 8 seconds

export function useJournalData() {
    const [toc, setToc] = useState<TOCItem[]>([]);
    const [page, setPage] = useState<JournalPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const dataLoaded = useRef(false);

    // Load TOC on mount
    useEffect(() => {
        const tocRef = ref(db, "pages");

        // Timeout fallback: if Firebase doesn't respond in time, use mock data
        const timeout = setTimeout(() => {
            if (!dataLoaded.current) {
                console.warn("Firebase timeout — falling back to mock data");
                setToc(mockToc);
                setPage(mockPages["1"]);
                setLoading(false);
                dataLoaded.current = true;
            }
        }, FIREBASE_TIMEOUT_MS);

        const unsubscribe = onValue(tocRef, (snapshot) => {
            clearTimeout(timeout);
            dataLoaded.current = true;

            try {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const pagesList: JournalPage[] = Object.values(data);

                    const sortedToc = pagesList
                        .map(p => ({ id: p.id, title: p.title, order: p.order || 999 }))
                        .sort((a, b) => a.order - b.order);

                    setToc(sortedToc);

                    if (sortedToc.length > 0) {
                        // Load first page
                        setPage(pagesList.find(p => p.id === sortedToc[0].id) || null);
                    }
                } else {
                    setToc(mockToc);
                    setPage(mockPages["1"]);
                }
            } catch (err) {
                console.error("Error processing journal data:", err);
                setError("Failed to load journal.");
                setToc(mockToc);
                setPage(mockPages["1"]);
            } finally {
                setLoading(false);
            }
        }, (error) => {
            clearTimeout(timeout);
            console.error("Firebase read error:", error);
            setError(error.message);
            setToc(mockToc);
            setPage(mockPages["1"]);
            setLoading(false);
            dataLoaded.current = true;
        });

        return () => {
            clearTimeout(timeout);
            off(tocRef);
        };
    }, []);

    // Function to load specific page content
    const loadPage = async (pageId: string) => {
        try {
            const pageRef = ref(db, `pages/${pageId}`);
            const snapshot = await get(pageRef);

            if (snapshot.exists()) {
                setPage(snapshot.val());
            } else {
                setPage(mockPages[pageId] || null);
            }
        } catch (err) {
            console.error("Error loading page:", err);
            setPage(mockPages[pageId] || null);
        }
    };

    return { toc, page, loading, error, loadPage };
}
