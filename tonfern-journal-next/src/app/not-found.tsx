import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-dvh flex flex-col items-center justify-center bg-stone-100 p-4 font-handwriting">
            <div className="bg-[#fdfbf7] p-8 md:p-12 rounded-lg shadow-xl max-w-lg text-center relative" style={{
                backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px)',
                backgroundSize: '100% 2rem',
                boxShadow: '2px 3px 20px rgba(0,0,0,0.1), inset 0 0 60px rgba(0,0,0,0.05)'
            }}>
                {/* Tape Effect */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-200/50 w-32 h-8 rotate-[-2deg] shadow-sm backdrop-blur-sm"></div>

                <h1 className="text-6xl font-bold text-emerald-800 mb-4">404</h1>
                <h2 className="text-2xl text-emerald-700 mb-6">หาหน้านี้ไม่เจอ...</h2>

                <p className="text-stone-600 mb-8 text-lg leading-loose">
                    เหมือนว่าหน้านี้จะขาดหายไปจากสมุดบันทึก หรืออาจจะยังไม่ได้เขียนขึ้นมาใหม่
                </p>

                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                    กลับไปหน้าแรก 🏠
                </Link>
            </div>
        </main>
    );
}
