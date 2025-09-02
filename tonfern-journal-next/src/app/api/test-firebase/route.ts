import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { ref, set, get } from "firebase/database";

export async function GET() {
  try {
    // ทดสอบเขียนข้อมูล
    await set(ref(db, "test/hello"), { 
      msg: "สวัสดีจาก Next.js 🚀",
      timestamp: new Date().toISOString(),
      status: "connected"
    });
    
    // ทดสอบอ่านข้อมูล
    const snap = await get(ref(db, "test/hello"));
    
    return NextResponse.json({ 
      ok: true, 
      data: snap.val(),
      message: "Firebase เชื่อมต่อสำเร็จ! 🎉"
    });
  } catch (error) {
    console.error("Firebase test error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Firebase เชื่อมต่อไม่สำเร็จ ❌"
    }, { status: 500 });
  }
}
