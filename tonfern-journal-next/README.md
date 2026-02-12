# 📖 Tonfern Journal

สมุดบันทึกดิจิทัลที่พลิกหน้าได้เหมือนจริง — ตกแต่งแบบ IG Story ด้วย Canvas Editor

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38bdf8?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange?logo=firebase)

## ✨ Features

### 📕 Public Reader
- **Page Flip** — พลิกหน้าซ้าย-ขวาด้วย keyboard (← →), swipe, หรือกดปุ่ม
- **3D Animation** — ใช้ CSS `perspective` + `rotateY` เหมือนสมุดจริง
- **Vintage Botanical Design** — ธีมกระดาษเก่า, ทอง, หนังสัตว์

### 🎨 IG Story-Style Editor (Admin)
- **Canvas Editor** — Fabric.js ขนาด 1080×1350 (IG ratio 4:5)
- **Drawing Tool** — วาดเส้นอิสระ เลือกสี/ขนาดปากกา
- **Text Tool** — เพิ่มข้อความ เลือกฟอนต์ (ลายมือ/น่ารัก/ทางการ) + สี + ขนาด
- **Image Upload** → Cloudinary → ลาก/หมุน/ปรับขนาด
- **Video Upload** → Cloudinary → placeholder + `<video>` overlay
- **GIF Search** — ค้นจาก Giphy API + แปะลง canvas
- **Z-Index Controls** — ย้ายวัตถุหน้า-หลัง
- **Mobile Bottom Toolbar** — toolbar ย้ายไปด้านล่างบนมือถือ (48px touch targets)

### 📦 Media Pipeline
- **Auto-Optimize** — `f_auto,q_auto` สำหรับทุก Cloudinary URL
- **Video Thumbnail** — สร้าง poster image อัตโนมัติ
- **Video Overlay** — เล่นวิดีโอทับ canvas ตรงตำแหน่ง

### 📱 Mobile Polish
- **Responsive Canvas** — ย่อ canvas ให้พอดีหน้าจอ, save ที่ 1080×1350 เสมอ
- **Bottom Sheet Toolbar** — เครื่องมือ fixed ด้านล่าง + expandable panel
- **Touch Gestures** — swipe สำหรับพลิกหน้า

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| Auth & DB | Firebase (Auth + Realtime Database) |
| Media | Cloudinary (Image, Video, PDF) |
| Canvas | Fabric.js v6 |
| GIF | Giphy API |
| PDF | PDF.js |
| Fonts | Google Fonts (Playfair Display, Cormorant Garamond, Crimson Pro, Kanit, Kalam) |
| Deploy | Vercel |

## 📁 Project Structure

```
tonfern-journal-next/
├── src/
│   ├── app/
│   │   ├── globals.css       # Design system (Vintage Botanical theme)
│   │   ├── layout.tsx        # Root layout + typography
│   │   ├── page.tsx          # Public reader (page flip)
│   │   ├── login/            # Google OAuth login
│   │   └── admin/
│   │       ├── pages/        # Page manager
│   │       └── story/        # IG Story editor
│   ├── components/
│   │   ├── StoryEditor.tsx   # Full-featured canvas editor
│   │   ├── StoryRenderer.tsx # Read-only renderer + video overlay
│   │   ├── FontPicker.tsx    # Font/size/color picker
│   │   └── GiphyPicker.tsx   # GIF search modal
│   ├── hooks/
│   │   ├── usePageFlip.ts    # Page flip logic + swipe + keyboard
│   │   └── useJournalData.ts # Firebase data + timeout fallback
│   ├── lib/
│   │   ├── cloudinary.ts     # Upload + optimize + thumbnail
│   │   ├── firebase.ts       # Firebase config
│   │   └── giphy.ts          # Giphy API wrapper
│   └── types/
│       └── journal.ts        # TypeScript interfaces
├── public/                   # Static assets
├── tailwind.config.ts        # Design tokens (colors, fonts, animations)
└── package.json
```

## ⚙️ Setup

### 1. Install

```bash
cd tonfern-journal-next
npm install
```

### 2. Environment Variables

สร้าง `.env.local`:

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

# Admin UIDs
NEXT_PUBLIC_FERN_UID=...
NEXT_PUBLIC_OWNER_UID=...

# Giphy (optional)
NEXT_PUBLIC_GIPHY_API_KEY=...
```

### 3. Run

```bash
npm run dev
```

เปิดที่ http://localhost:3000

## 🎨 Design System

ธีม **Vintage Botanical Journal**:

| Token | Value | Usage |
|-------|-------|-------|
| `--paper` | `#f5f0e8` | พื้นหลังหน้ากระดาษ |
| `--ink` | `#2c3e2d` | สีตัวอักษรหลัก |
| `--gold` | `#c9a55c` | accent, ขอบหนังสือ |
| `--leather` | `#3e5c3a` | ปกหนังสือ |
| `--rose-faded` | `#c4a08a` | เลขหน้า, ส่วนรอง |

Typography: Playfair Display (display), Crimson Pro (serif), Kanit (body), Kalam (handwriting)

## 📄 License

MIT

---

⭐ ถ้าชอบโปรเจคนี้ กรุณาให้ Star!
