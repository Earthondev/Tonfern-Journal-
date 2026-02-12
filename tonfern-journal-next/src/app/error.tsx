'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Page Error:', error);
    }, [error]);

    return (
        <main className="min-h-dvh flex flex-col items-center justify-center bg-stone-100 p-4 font-handwriting">
            <div className="bg-[#fff1f2] border-2 border-dashed border-red-200 p-8 md:p-12 rounded-lg shadow-xl max-w-lg text-center relative">
                {/* Tape Effect */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-200/50 w-32 h-8 rotate-[2deg] shadow-sm backdrop-blur-sm"></div>

                <h1 className="text-4xl font-bold text-red-800 mb-4">เกิดข้อผิดพลาด! 😵</h1>

                <p className="text-red-700/80 mb-8 text-lg">
                    ขออภัยด้วยครับ มีบางอย่างผิดปกติเกิดขึ้นในหน้ากระดาษนี้
                </p>

                {/* Technical details (optional, hidden in production usually but good for transparent dev) */}
                {process.env.NODE_ENV === 'development' && (
                    <pre className="text-xs text-left bg-red-50 p-4 rounded mb-6 overflow-auto max-h-32 text-red-900 font-mono">
                        {error.message}
                    </pre>
                )}

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={
                            // Attempt to recover by trying to re-render the segment
                            () => reset()
                        }
                        className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
                    >
                        ลองใหม่อีกครั้ง 🔄
                    </button>
                    <a href="/" className="px-6 py-2 border-2 border-red-200 text-red-700 rounded-full hover:bg-red-50 transition-colors">
                        กลับหน้าหลัก
                    </a>
                </div>
            </div>
        </main>
    );
}
