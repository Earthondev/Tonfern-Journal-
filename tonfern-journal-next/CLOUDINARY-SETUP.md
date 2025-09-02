# ☁️ Cloudinary Setup Guide - Tonfern Journal

## 📋 Overview

Cloudinary เป็น cloud-based image และ video management service ที่ให้บริการฟรีสำหรับ Tonfern Journal

## 🚀 การสมัคร Cloudinary

### 1. สมัครบัญชี

1. ไปที่ [cloudinary.com](https://cloudinary.com)
2. คลิก "Sign Up For Free"
3. กรอกข้อมูล:
   - **Email**: อีเมลของคุณ
   - **Password**: รหัสผ่านที่ปลอดภัย
   - **Account Name**: ชื่อบัญชี (จะใช้เป็น cloud name)
4. คลิก "Create Account"

### 2. ข้อมูลสำคัญ

หลังสมัครสำเร็จ คุณจะได้:

- **Cloud Name**: ชื่อบัญชีที่สมัคร
- **API Key**: สำหรับ server-side uploads
- **API Secret**: สำหรับ server-side uploads
- **Upload Preset**: ต้องสร้างเอง

## ⚙️ การตั้งค่า Upload Preset

### 1. สร้าง Upload Preset

1. ไปที่ **Dashboard** → **Settings** → **Upload**
2. เลื่อนลงไปหา **Upload presets**
3. คลิก **Add upload preset**
4. ตั้งค่าดังนี้:

```
Preset name: tonfern-journal-unsigned
Signing Mode: Unsigned
Folder: tonfern-journal
Allowed formats: jpg, jpeg, png, gif, pdf
Max file size: 25MB
```

### 2. ตั้งค่าเพิ่มเติม

```
Transformation: 
- Quality: auto
- Format: auto

Moderation: 
- None

Upload manipulation:
- Eager transformations: ไม่ต้องใส่
- Eager format: ไม่ต้องใส่
```

### 3. บันทึก Preset

1. คลิก **Save**
2. คัดลอก **Preset name** ที่ได้

## 🔧 การตั้งค่าใน Tonfern Journal

### 1. อัปเดต .env.local

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tonfern-journal-unsigned
```

### 2. ตรวจสอบ config.ts

```typescript
// src/lib/config.ts
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your-upload-preset",
};
```

## 📁 โครงสร้างโฟลเดอร์

### 1. โฟลเดอร์หลัก

```
tonfern-journal/
├── pages/          # รูปภาพหน้าเอกสาร
├── pdfs/           # ไฟล์ PDF
├── stories/        # รูปภาพ Story
└── temp/           # ไฟล์ชั่วคราว
```

### 2. การตั้งค่าโฟลเดอร์

ใน Upload Preset:

```
Folder: tonfern-journal
```

## 🧪 ทดสอบการอัปโหลด

### 1. ทดสอบผ่านหน้าเว็บ

1. เปิด `/admin/pages`
2. เลือกไฟล์รูปภาพหรือ PDF
3. กรอกข้อมูลและกด "เพิ่มหน้า"
4. ตรวจสอบว่าอัปโหลดสำเร็จ

### 2. ทดสอบผ่าน API

```bash
# ทดสอบอัปโหลดรูปภาพ
curl -X POST "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload" \
  -F "file=@test.jpg" \
  -F "upload_preset=tonfern-journal-unsigned"
```

### 3. ตรวจสอบผลลัพธ์

```json
{
  "public_id": "tonfern-journal/page_1234567890_test",
  "secure_url": "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/tonfern-journal/page_1234567890_test.jpg",
  "format": "jpg",
  "bytes": 123456,
  "width": 1920,
  "height": 1080
}
```

## 🔒 Security Settings

### 1. Upload Restrictions

```
Max file size: 25MB
Allowed formats: jpg, jpeg, png, gif, pdf
Folder restrictions: tonfern-journal/*
```

### 2. Access Control

```
Signing Mode: Unsigned (สำหรับ client-side uploads)
Authentication: ไม่จำเป็น (ใช้ upload preset แทน)
```

### 3. Rate Limiting

```
Free Plan: 25 credits/month
- 25GB storage
- 25GB bandwidth
- 25GB transformations
```

## 📊 การจัดการไฟล์

### 1. ดูไฟล์ทั้งหมด

1. ไปที่ **Dashboard** → **Media Library**
2. เลือกโฟลเดอร์ `tonfern-journal`
3. ดูไฟล์ที่อัปโหลดทั้งหมด

### 2. ลบไฟล์

1. เลือกไฟล์ที่ต้องการลบ
2. คลิก **Delete**
3. ยืนยันการลบ

### 3. แก้ไขข้อมูล

1. เลือกไฟล์
2. คลิก **Edit**
3. แก้ไขชื่อ, tags, หรือ metadata

## 🎨 Image Transformations

### 1. การปรับขนาด

```typescript
// ปรับขนาดเป็น 800x600
const url = getCloudinaryUrl(publicId, {
  width: 800,
  height: 600,
  crop: 'fill'
});
```

### 2. การปรับคุณภาพ

```typescript
// ปรับคุณภาพเป็น 80%
const url = getCloudinaryUrl(publicId, {
  quality: 80
});
```

### 3. การแปลงรูปแบบ

```typescript
// แปลงเป็น WebP
const url = getCloudinaryUrl(publicId, {
  format: 'webp'
});
```

## 📱 Responsive Images

### 1. ใช้ srcset

```typescript
const getResponsiveUrl = (publicId: string, sizes: number[]) => {
  return sizes.map(size => ({
    size,
    url: getCloudinaryUrl(publicId, { width: size, crop: 'scale' })
  }));
};
```

### 2. ตัวอย่างการใช้งาน

```jsx
const responsiveImages = getResponsiveUrl(publicId, [320, 640, 1280]);

<img
  src={responsiveImages[1].url}
  srcSet={responsiveImages.map(img => `${img.url} ${img.size}w`).join(', ')}
  sizes="(max-width: 640px) 320px, (max-width: 1280px) 640px, 1280px"
  alt="Responsive image"
/>
```

## 🚨 Troubleshooting

### 1. อัปโหลดไม่สำเร็จ

**ปัญหา**: "Upload failed" error

**วิธีแก้**:
1. ตรวจสอบ upload preset name
2. ตรวจสอบ cloud name
3. ตรวจสอบ file size และ type
4. ตรวจสอบ network connection

### 2. ไฟล์ไม่แสดง

**ปัญหา**: ไฟล์อัปโหลดแล้วแต่ไม่แสดง

**วิธีแก้**:
1. ตรวจสอบ URL ใน database
2. ตรวจสอบ CORS settings
3. ตรวจสอบ file permissions

### 3. ไฟล์หาย

**ปัญหา**: ไฟล์หายไปจาก Cloudinary

**วิธีแก้**:
1. ตรวจสอบ Media Library
2. ตรวจสอบ folder structure
3. ตรวจสอบ upload logs

## 📈 การอัปเกรด

### 1. จาก Free Plan

```
Free Plan: $0/month
- 25GB storage
- 25GB bandwidth
- 25GB transformations

Advanced Plan: $89/month
- 225GB storage
- 225GB bandwidth
- 225GB transformations
```

### 2. เมื่อไหร่ควรอัปเกรด

- ใช้ storage เกิน 25GB
- ใช้ bandwidth เกิน 25GB
- ต้องการ features เพิ่มเติม
- ต้องการ support

## 📞 Support

### 1. Cloudinary Support

- **Documentation**: [docs.cloudinary.com](https://docs.cloudinary.com)
- **Community**: [community.cloudinary.com](https://community.cloudinary.com)
- **Email**: support@cloudinary.com

### 2. Tonfern Journal Support

- **GitHub Issues**: [github.com/yourusername/tonfern-journal](https://github.com/yourusername/tonfern-journal)
- **Email**: fern@tonfern.com

## 🔄 การบำรุงรักษา

### 1. ตรวจสอบเป็นประจำ

- ดู storage usage
- ดู bandwidth usage
- ดู error logs
- ตรวจสอบ file organization

### 2. การทำความสะอาด

- ลบไฟล์ที่ไม่ใช้
- ลบไฟล์ชั่วคราว
- จัดระเบียบโฟลเดอร์
- อัปเดต metadata

---

**หมายเหตุ**: Cloudinary เป็นบริการฟรีที่มีประสิทธิภาพสูง เหมาะสำหรับ Tonfern Journal
