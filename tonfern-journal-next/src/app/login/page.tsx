"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setE] = useState(""); 
  const [pass, setP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !pass) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      location.href = "/admin/story";
    } catch (error: any) {
      console.error("Login error:", error);
      setError("ล็อกอินไม่สำเร็จ: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="glass-card grid gap-4 p-8 rounded-3xl border border-emerald-200 max-w-sm w-full animate-fade-in-up">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-serif text-emerald-800 text-shadow mb-2">
            เข้าสู่ระบบ
          </h1>
          <p className="text-emerald-600 font-handwriting">
            สำหรับผู้แก้ไขเท่านั้น
          </p>
        </div>

        <div className="grid gap-3">
          <input 
            placeholder="อีเมล" 
            type="email"
            value={email}
            onChange={(e) => setE(e.target.value)}
            className="border border-emerald-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
            disabled={isLoading}
          />
          <input 
            placeholder="รหัสผ่าน" 
            type="password" 
            value={pass}
            onChange={(e) => setP(e.target.value)}
            className="border border-emerald-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
            disabled={isLoading}
          />
          
          {error && (
            <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}
          
          <button 
            className="bg-emerald-600 text-white rounded-xl p-3 font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </div>

        <div className="text-center text-sm text-emerald-600">
          <p>🔐 เฉพาะผู้แก้ไขที่ได้รับอนุญาต</p>
        </div>
      </div>
    </main>
  );
}
