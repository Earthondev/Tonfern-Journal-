# 🚀 Deployment Guide - Tonfern Journal

## 📋 Overview

คู่มือการ deploy Tonfern Journal บน Vercel พร้อมการตั้งค่าทั้งหมด

## 🎯 Prerequisites

### 1. เตรียมพร้อม

- ✅ โปรเจค Next.js พร้อมใช้งาน
- ✅ Firebase Project ตั้งค่าแล้ว
- ✅ Cloudinary Account ตั้งค่าแล้ว
- ✅ GitHub Repository
- ✅ Vercel Account

### 2. ตรวจสอบไฟล์

```
tonfern-journal-next/
├── package.json          # ✅ ต้องมี
├── next.config.js        # ✅ ต้องมี
├── vercel.json           # ✅ ต้องมี
├── .env.local           # ✅ ต้องมี
└── src/                 # ✅ ต้องมี
```

## 🔧 การตั้งค่า Vercel

### 1. สมัคร Vercel

1. ไปที่ [vercel.com](https://vercel.com)
2. คลิก "Sign Up"
3. เลือก "Continue with GitHub"
4. อนุญาต Vercel เข้าถึง GitHub

### 2. สร้าง Project

1. คลิก "New Project"
2. เลือก GitHub repository: `tonfern-journal`
3. คลิก "Import"

### 3. ตั้งค่า Project

```
Project Name: tonfern-journal
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

## 🔐 Environment Variables

### 1. ตั้งค่าใน Vercel

ไปที่ **Project Settings** → **Environment Variables**:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (get from Firebase Console)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Admin Access
NEXT_PUBLIC_FERN_UID=your-admin-uid-1
NEXT_PUBLIC_OWNER_UID=your-admin-uid-2
```

### 2. Environment Types

```
Production: ✅ (สำหรับ production)
Preview: ✅ (สำหรับ preview deployments)
Development: ❌ (ไม่จำเป็น)
```

## 🚀 Deploy

### 1. Deploy อัตโนมัติ

1. คลิก "Deploy"
2. รอ build เสร็จ (ประมาณ 2-5 นาที)
3. ตรวจสอบ deployment URL

### 2. ตรวจสอบ Deployment

```
✅ Build completed
✅ Functions compiled
✅ Static files generated
✅ Environment variables loaded
```

## 🔍 การตรวจสอบ

### 1. ตรวจสอบ Build Logs

```
✓ Compiled successfully
✓ Ready to start
✓ Build completed
```

### 2. ตรวจสอบ Functions

```
✓ API routes compiled
✓ Serverless functions ready
✓ Edge functions optimized
```

### 3. ตรวจสอบ Performance

```
✓ Lighthouse score > 90
✓ Core Web Vitals passed
✓ Bundle size optimized
```

## 🧪 Testing Production

### 1. ทดสอบ Firebase Connection

```bash
# ทดสอบ API endpoint
curl https://your-domain.vercel.app/api/test-firebase
```

**ผลลัพธ์ที่คาดหวัง**:
```json
{
  "ok": true,
  "data": {
    "msg": "สวัสดีจาก Next.js 🚀",
    "timestamp": "2025-01-02T...",
    "status": "connected"
  },
  "message": "Firebase เชื่อมต่อสำเร็จ! 🎉"
}
```

### 2. ทดสอบ Authentication

1. เปิด `/login`
2. ล็อกอินด้วยบัญชี Firebase
3. ตรวจสอบว่า redirect ไป `/admin/story`

### 3. ทดสอบ Admin Features

1. ไปที่ `/admin/pages`
2. อัปโหลดรูปภาพหรือ PDF
3. ตรวจสอบว่าบันทึกลง Firebase

### 4. ทดสอบ Public View

1. กลับไปหน้าหลัก `/`
2. ตรวจสอบว่าแสดงข้อมูลจาก Firebase
3. คลิก TOC และดูหน้าเอกสาร

## 🔧 Custom Domain (ถ้าต้องการ)

### 1. เพิ่ม Domain

1. ไปที่ **Project Settings** → **Domains**
2. คลิก "Add Domain"
3. กรอก domain name
4. ตั้งค่า DNS records

### 2. DNS Records

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.36
```

## 📊 Monitoring

### 1. Vercel Analytics

1. เปิดใช้งาน Analytics
2. ดู page views, performance
3. ตรวจสอบ errors

### 2. Firebase Console

1. ดู Realtime Database usage
2. ตรวจสอบ Authentication logs
3. ดู Storage usage (ถ้าใช้)

### 3. Cloudinary Dashboard

1. ดู upload statistics
2. ตรวจสอบ storage usage
3. ดู bandwidth usage

## 🚨 Troubleshooting

### 1. Build Failed

**ปัญหา**: Build ไม่สำเร็จ

**วิธีแก้**:
1. ตรวจสอบ build logs
2. ตรวจสอบ dependencies
3. ตรวจสอบ TypeScript errors
4. ตรวจสอบ environment variables

### 2. Environment Variables Not Loaded

**ปัญหา**: Environment variables ไม่ทำงาน

**วิธีแก้**:
1. ตรวจสอบ Vercel environment variables
2. ตรวจสอบ variable names
3. ตรวจสอบ environment types
4. Redeploy project

### 3. API Routes Not Working

**ปัญหา**: API endpoints ไม่ตอบสนอง

**วิธีแก้**:
1. ตรวจสอบ function compilation
2. ตรวจสอบ CORS settings
3. ตรวจสอบ function timeout
4. ตรวจสอบ logs

### 4. Firebase Connection Failed

**ปัญหา**: ไม่สามารถเชื่อมต่อ Firebase

**วิธีแก้**:
1. ตรวจสอบ Firebase Rules
2. ตรวจสอบ API keys
3. ตรวจสอบ project ID
4. ทดสอบที่ `/api/test-firebase`

## 🔄 การอัปเดต

### 1. Auto-deploy

1. Push โค้ดไป GitHub
2. Vercel จะ deploy อัตโนมัติ
3. ตรวจสอบ deployment status

### 2. Manual Deploy

1. ไปที่ Vercel Dashboard
2. คลิก "Redeploy"
3. รอ build เสร็จ

### 3. Rollback

1. ไปที่ **Deployments**
2. เลือก version ที่ต้องการ
3. คลิก "Promote to Production"

## 📈 Performance Optimization

### 1. Build Optimization

```json
// next.config.js
{
  "experimental": {
    "optimizeCss": true,
    "optimizePackageImports": ["@heroicons/react"]
  }
}
```

### 2. Image Optimization

```jsx
// ใช้ Next.js Image component
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="Description"
  width={800}
  height={600}
  priority
/>
```

### 3. Bundle Analysis

```bash
# วิเคราะห์ bundle size
npm run build
npx @next/bundle-analyzer
```

## 🔒 Security

### 1. Headers

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 2. Environment Variables

- ✅ ใช้ `NEXT_PUBLIC_*` เฉพาะข้อมูลที่จำเป็น
- ❌ อย่าใส่ API secrets ใน client
- 🔒 ใช้ Firebase Rules เป็นหลัก

## 📞 Support

### 1. Vercel Support

- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Email**: support@vercel.com

### 2. Tonfern Journal Support

- **GitHub Issues**: [github.com/yourusername/tonfern-journal](https://github.com/yourusername/tonfern-journal)
- **Email**: fern@tonfern.com

## 🎉 Success Checklist

### ✅ Deployment Complete

- [ ] Project deployed on Vercel
- [ ] Environment variables loaded
- [ ] Firebase connection working
- [ ] Authentication working
- [ ] Admin features working
- [ ] Public view working
- [ ] Custom domain configured (optional)
- [ ] Monitoring enabled
- [ ] Performance optimized

---

**หมายเหตุ**: Vercel เป็น platform ที่ดีที่สุดสำหรับ Next.js deployment
