"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { EDITOR_UIDS } from "@/lib/config";
import Link from "next/link";

export default function Navigation() {
  const [isEditor, setIsEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsEditor(user ? EDITOR_UIDS.has(user.uid) : false);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <nav className="glass-card rounded-2xl p-4 mb-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="glass-card rounded-2xl p-4 mb-6 animate-fade-in-up">
      <div className="flex flex-wrap gap-3 justify-center">
        <Link 
          href="/"
          className="px-4 py-2 rounded-xl border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-300 text-emerald-800 font-medium hover:shadow-lg transform hover:-translate-y-1"
        >
          🏠 หน้าหลัก
        </Link>

        {isEditor && (
          <>
            <Link 
              href="/admin/story"
              className="px-4 py-2 rounded-xl border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-300 text-emerald-800 font-medium hover:shadow-lg transform hover:-translate-y-1"
            >
              ✏️ Story Editor
            </Link>

            <Link 
              href="/admin/pages"
              className="px-4 py-2 rounded-xl border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-300 text-emerald-800 font-medium hover:shadow-lg transform hover:-translate-y-1"
            >
              📄 จัดการหน้า
            </Link>

            <Link 
              href="/login"
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-300 font-medium hover:shadow-lg transform hover:-translate-y-1"
            >
              🚪 ออกจากระบบ
            </Link>
          </>
        )}

        {!isEditor && (
          <Link 
            href="/login"
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 font-medium hover:shadow-lg transform hover:-translate-y-1"
          >
            🔐 เข้าสู่ระบบ
          </Link>
        )}
      </div>
    </nav>
  );
}
