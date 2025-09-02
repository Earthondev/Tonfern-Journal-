# 📖 Tonfern Journal

สมุดบันทึกดิจิทัลที่ออกแบบมาให้เหมือนหนังสือจริง ด้วย Next.js, TypeScript, Tailwind CSS และ Firebase

## ✨ Features

- 📱 **Responsive Design** - ใช้งานได้ทุกอุปกรณ์
- 🎨 **Scrapbook Theme** - ธีมสมุดบันทึกสวยงาม
- 📄 **A4 Document Support** - รองรับรูปภาพและ PDF
- 🔐 **Secure Admin** - ระบบจัดการสำหรับผู้แก้ไข
- 📝 **Story Editor** - แก้ไขแบบ IG-Story
- ☁️ **Cloud Storage** - ใช้ Cloudinary สำหรับไฟล์
- 🔥 **Real-time Database** - Firebase Realtime Database

## 🚀 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Realtime Database)
- **Storage**: Cloudinary
- **Deployment**: Vercel
- **UI Libraries**: Fabric.js, PDF.js

## 📋 Prerequisites

- Node.js 18+
- npm หรือ yarn
- Firebase Project
- Cloudinary Account

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/tonfern-journal.git
cd tonfern-journal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

สร้างไฟล์ `.env.local`:

```bash
cp env.example .env.local
```

แก้ไข `.env.local` ด้วยค่าจริง:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Editor UIDs
NEXT_PUBLIC_FERN_UID=your-fern-uid
NEXT_PUBLIC_OWNER_UID=your-owner-uid
```

### 4. Firebase Setup

1. สร้าง Firebase Project
2. เปิดใช้งาน Authentication และ Realtime Database
3. ตั้งค่า Firebase Rules (ดู `FIREBASE-RULES.md`)
4. สร้างบัญชีผู้ใช้และคัดลอก UIDs

### 5. Cloudinary Setup

1. สมัครที่ [cloudinary.com](https://cloudinary.com)
2. สร้าง Upload Preset (Unsigned)
3. กำหนด folder และ file limits

## 🚀 Development

### Run Development Server

```bash
npm run dev
```

เปิดเว็บที่: http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## 🧪 Testing

### Quick Test Checklist

1. **Firebase Connection**: `/api/test-firebase`
2. **Authentication**: `/login`
3. **Admin Access**: `/admin/pages`
4. **Public View**: `/` (หน้าหลัก)

## 📁 Project Structure

```
tonfern-journal-next/
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── api/       # API Routes
│   │   ├── admin/     # Admin Pages
│   │   └── login/     # Login Page
│   ├── components/    # React Components
│   ├── hooks/         # Custom Hooks
│   ├── lib/          # Firebase, Cloudinary
│   └── types/        # TypeScript Types
├── public/            # Static Files
├── .env.local        # Environment Variables
└── package.json
```

## 🔐 Security

- UID-based authentication
- Firebase Rules protection
- File upload validation
- Environment variables security

อ่าน `SECURITY.md` เพื่อข้อมูลเพิ่มเติม

## 📚 Documentation

- `SETUP.md` - คู่มือการตั้งค่า
- `FIREBASE-RULES.md` - Firebase Security Rules
- `CLOUDINARY-SETUP.md` - Cloudinary Setup Guide

## 🚀 Deployment

### Vercel (Recommended)

1. Push โค้ดไป GitHub
2. เชื่อมต่อกับ Vercel
3. ตั้งค่า Environment Variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork โปรเจค
2. สร้าง Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไป Branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

- **Project Link**: [https://github.com/yourusername/tonfern-journal](https://github.com/yourusername/tonfern-journal)
- **Email**: fern@tonfern.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Firebase](https://firebase.google.com/) - Backend Services
- [Cloudinary](https://cloudinary.com/) - Cloud Storage
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Fabric.js](http://fabricjs.com/) - Canvas Library
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF Rendering

---

⭐ ถ้าชอบโปรเจคนี้ กรุณาให้ Star! ⭐
