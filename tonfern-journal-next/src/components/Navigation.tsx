'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, isFern } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && isFern(currentUser.uid)) {
        setIsEditor(true);
      } else {
        setIsEditor(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // Clear Middleware Cookie
      document.cookie = 'journal_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Only show navigation for authorized users or on login page
  if (pathname === '/login') return null;

  return (
    <nav className="flex items-center gap-4">
      {isEditor ? (
        <>
          <Link
            href="/admin/story"
            className={`px-4 py-2 rounded-full font-handwriting transition-colors ${pathname === '/admin/story' ? 'bg-emerald-100 text-emerald-800' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            ✨ เขียนเรื่องราว
          </Link>
          <Link
            href="/admin/pages"
            className={`px-4 py-2 rounded-full font-handwriting transition-colors ${pathname === '/admin/pages' ? 'bg-emerald-100 text-emerald-800' : 'text-stone-600 hover:bg-stone-100'}`}
          >
            📄 จัดการหน้า
          </Link>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 font-handwriting transition-colors"
          >
            🚪 ออกจากหนังสือ
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="w-10 h-10 flex items-center justify-center rounded-full text-stone-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-500"
          title="สำหรับเจ้าของสมุด"
        >
          🗝️
        </Link>
      )}
    </nav>
  );
}
