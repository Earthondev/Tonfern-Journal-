# 🌿 Tonfern Journal (Next.js Edition)

## 📌 Project Overview
Tonfern Journal is a digital journal application designed to replicate the feel of a physical scrapbook or diary. It allows users to view entries with a rich, interactive scrapbook aesthetics. The project has been migrated from a vanilla HTML/CSS/JS stack to a modern **Next.js** application.

**Key Features:**
- **Scrapbook Aesthetic**: Visual design mimicking a real journal.
- **Digital Storytelling**: Support for images and PDFs in a "Story" format.
- **Admin System**: Secure area for editing and managing journal entries.
- **Cloud Integration**: Uses Firebase for data/auth and Cloudinary for media storage.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend & Auth**: Firebase (Authentication, Realtime Database)
- **Media Storage**: Cloudinary
- **Deployment**: Vercel (Recommended)
- **Key Libraries**: Fabric.js (Canvas), PDF.js (PDF rendering)

## 📂 Project Structure
The active development is located in the `tonfern-journal-next` directory.

```
Tonfern-Journal-/
├── tonfern-journal-next/       # MAIN PROJECT DIRECTORY
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/                # Config (Firebase, Cloudinary)
│   │   └── types/              # TS Interfaces
│   ├── public/                 # Static assets
│   ├── ... config files ...
└── (Legacy Files)              # Older HTML/CSS version (Do not use)
```

## 🚀 Getting Started

### 1. Key Commands
Run these inside `tonfern-journal-next/`:

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start local development server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Run production build locally |

### 2. Environment Setup
Create a `.env.local` file in `tonfern-journal-next/` with the following:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...

# Admin Access
NEXT_PUBLIC_FERN_UID=...
NEXT_PUBLIC_OWNER_UID=...
```

## 🧠 AI Context / Rules
- **Styling**: Always use Tailwind CSS. Match the "Scrapbook/Journal" aesthetic.
- **State Management**: Use React Hooks and Firebase Realtime Database.
- **Type Safety**: strict TypeScript usage is enforced.
- **Directory**: Always prioritize working within `tonfern-journal-next`.

### 🚨 Mandatory Verification Process (กฎเหล็กการส่งมอบงาน)
ทุกครั้งที่มีการแก้ไขหรือเพิ่มฟีเจอร์ **ต้องทดสอบให้ผ่านครบ 3 รอบ** มิฉะนั้นห้ามส่งงาน:

1.  **Technical Check (รอบที่ 1)**:
    - `npm run dev` ต้องไม่มี Terminal Error
    - Console ใน Browser ต้องไม่มี Error แดง (ยกเว้น Extension)
    - TypeScript ต้องไม่มี Type Error

2.  **Visual Check (รอบที่ 2)**:
    - หน้าเว็บต้องแสดงผลถูกต้อง (ไม่เพี้ยน, ไม่ซ้อนทับ)
    - ต้องเช็คทั้งโหมด Desktop และ Simulation Mobile
    - Texture และ Font ต้องโหลดติดครบถ้วน

3.  **Functional Check (รอบที่ 3)**:
    - ลองกดปุ่มหลักทุกปุ่มว่าทำงานได้จริง (เช่น เปิดสมุด, เปลี่ยนหน้า)
    - ลองโหลดข้อมูลจริงจาก Firebase (ไม่ใช่แค่ Mock)
    - ถ้าเป็น Admin: ลอง Upload รูป/PDF จริงๆ ว่าเข้า Cloudinary ไหม

**"ถ้าไม่ผ่าน 3 ข้อนี้ = งานยังไม่เสร็จ"**
