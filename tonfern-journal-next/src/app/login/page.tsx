'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithPopup,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { isFern } from '@/lib/firebase';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Set Persistence
      await setPersistence(auth, browserLocalPersistence);

      // 2. Sign In with Google
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 3. Check if user is authorized (Fern or Owner)
      if (isFern(user.uid)) {
        // 4. Set Cookie for Middleware (Simple Auth Token)
        // In a real enterprise app, we'd verify the ID token on the server.
        // For now, this cookie acts as a "Gate Pass" for the middleware.
        document.cookie = `journal_token=${await user.getIdToken()}; path=/; max-age=3600; SameSite=Strict; Secure`;

        router.push('/admin/pages');
      } else {
        setError('ขออภัยครับ เฉพาะเจ้าของสมุด (เฟิร์น) เท่านั้นที่เข้าได้ 🔒');
        await auth.signOut();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ ลองใหม่อีกครั้งนะครับ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh flex items-center justify-center bg-stone-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center border border-emerald-100">
        <h1 className="text-3xl font-serif text-emerald-800 mb-6">เข้าสู่ระบบ</h1>

        <div className="mb-8">
          <span className="text-6xl">🗝️</span>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 animate-pulse">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl text-white font-bold transition-all ${loading
            ? 'bg-stone-400 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            }`}
        >
          {loading ? 'กำลังไขกุญแจ...' : 'Login with Google'}
        </button>

        {/* --- DEV ONLY: Bypass Login --- */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={() => {
              // Simulate Fern credentials
              const fakeToken = "dev-token-bypass";
              // We assume 'meemakham@gmail.com' corresponds to the authorized UID in .env.local
              // If not, we might need to adjust .env or this bypass.
              // For now, let's just set the cookie to pass middleware.
              document.cookie = `journal_token=${fakeToken}; path=/; max-age=3600; SameSite=Strict; Secure`;
              router.push('/admin/pages');
            }}
            className="w-full mt-4 py-2 px-4 rounded-xl border-2 border-dashed border-amber-400 text-amber-600 font-bold hover:bg-amber-50 text-sm"
          >
            🚧 Dev Bypass: meemakham@gmail.com
          </button>
        )}

        <p className="mt-6 text-xs text-stone-400">
          สำหรับผู้ดูแลระบบสมุดบันทึก Tonfern Journal เท่านั้น
        </p>

        <div className="mt-8 pt-4 border-t border-stone-100">
          <a href="/" className="text-emerald-500 hover:underline text-sm font-handwriting">
            ← กลับไปดูสมุด (ไม่ต้องล็อกอิน)
          </a>
        </div>
      </div>
    </main>
  );
}
