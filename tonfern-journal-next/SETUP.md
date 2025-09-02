# 🚀 Tonfern Journal Setup Guide

## 📋 Prerequisites

- Node.js 18+ 
- npm หรือ yarn
- Firebase Project
- Cloudinary Account (ฟรี)

## ⚙️ การตั้งค่า

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์หลัก:

```bash
cp env.example .env.local
```

แก้ไข `.env.local` ด้วยค่าจริง:

```env
# Firebase Configuration (ใช้ค่าจาก Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCJu9g3YVy9-sdvBas5ZiI1C8BhI2RP1Ig
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tonfern-journal.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://tonfern-journal-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tonfern-journal
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tonfern-journal.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=788428322570
NEXT_PUBLIC_FIREBASE_APP_ID=1:788428322570:web:54f8b440e3a4fad81e6cf3

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Editor UIDs (2 คนที่แก้ไขได้)
NEXT_PUBLIC_FERN_UID=mSg4iwFIrHatqLqa7q3gBe3oFTg1
NEXT_PUBLIC_OWNER_UID=S3qTv2MlWQfV7aCz8Q7ouoLV0Pn2
```

### 3. ตั้งค่า Firebase Rules

ไปที่ Firebase Console → Realtime Database → Rules:

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null && (auth.uid === 'mSg4iwFIrHatqLqa7q3gBe3oFTg1' || auth.uid === 'S3qTv2MlWQfV7aCz8Q7ouoLV0Pn2')",
    "pages": { 
      ".read": true, 
      "$id": { 
        ".write": "auth != null && (auth.uid === 'mSg4iwFIrHatqLqa7q3gBe3oFTg1' || auth.uid === 'S3qTv2MlWQfV7aCz8Q7ouoLV0Pn2')" 
      } 
    },
    "toc": { 
      ".read": true, 
      ".write": "auth != null && (auth.uid === 'mSg4iwFIrHatqLqa7q3gBe3oFTg1' || auth.uid === 'S3qTv2MlWQfV7aCz8Q7ouoLV0Pn2')" 
    },
    "stories": { 
      ".read": true, 
      "$id": { 
        ".write": "auth != null && (auth.uid === 'mSg4iwFIrHatqLqa7q3gBe3oFTg1' || auth.uid === 'S3qTv2MlWQfV7aCz8Q7ouoLV0Pn2')" 
      } 
    }
  }
}
```

### 4. ตั้งค่า Cloudinary

1. สมัครที่ [cloudinary.com](https://cloudinary.com)
2. ไปที่ Dashboard → Settings → Upload
3. สร้าง Upload Preset:
   - Signing Mode: Unsigned
   - Folder: tonfern-journal
   - Allowed formats: jpg, jpeg, png, gif, pdf
   - Max file size: 25MB

### 5. สร้างบัญชีผู้ใช้

ใน Firebase Console → Authentication → Users:

1. สร้างบัญชีใหม่
2. ใช้ UID ที่กำหนดใน `config.ts`
3. หรือแก้ไข `config.ts` ให้ตรงกับ UID จริง

## 🚀 รันเว็บ

```bash
npm run dev
```

เปิดเว็บที่: http://localhost:3000

## 🧪 Quick Test Checklist

### 1. ทดสอบ Firebase Connection
```bash
# เปิด /api/test-firebase → ได้ JSON ✅
curl http://localhost:3000/api/test-firebase
```

### 2. ทดสอบ Authentication
```bash
# เปิด /login → ล็อกอินด้วยบัญชี Firebase ✅
```

### 3. ทดสอบ Admin Access
```bash
# ไป /admin/pages → อัปโหลดรูปหรือ PDF + ใส่ caption → เผยแพร่ ✅
```

### 4. ทดสอบ Public View
```bash
# กลับ / → คลิก TOC → เห็นการ์ด A4 + caption ✅
```

## 🔐 การใช้งาน

### หน้าหลัก
- แสดง TOC และหน้าเอกสาร
- อ่านได้ทุกคน

### เข้าสู่ระบบ
- ไปที่ `/login`
- ใช้บัญชีที่สร้างใน Firebase

### Admin Pages
- `/admin/story` - สร้าง Story
- `/admin/pages` - จัดการหน้าเอกสาร

## 📁 โครงสร้างโปรเจค

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

## 🛡️ Security Features

- ✅ UID-based authentication
- ✅ useEditorGate hook สำหรับ admin pages
- ✅ Firebase Rules protection
- ✅ File upload validation
- ✅ Environment variables security

## 🐛 Troubleshooting

### Firebase Error
- ตรวจสอบ Firebase Rules
- ตรวจสอบ Environment Variables
- ทดสอบที่ `/api/test-firebase`

### Cloudinary Error
- ตรวจสอบ Upload Preset
- ตรวจสอบ Cloud Name

### Hydration Error
- ตรวจสอบการใช้ `Date.now()` ใน SSR
- ใช้ static values แทน

### Authentication Error
- ตรวจสอบ UIDs ใน `config.ts`
- ตรวจสอบ Firebase Auth settings

## 📞 Support

หากมีปัญหา ติดต่อได้ที่:
- GitHub Issues
- Email: fern@tonfern.com

## 🔒 Security Notes

อ่าน `SECURITY.md` เพื่อข้อมูลเพิ่มเติมเกี่ยวกับความปลอดภัย
