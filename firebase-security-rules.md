# 🔒 Firebase Security Rules สำหรับ Tonfern Journal

## 📋 Database Rules (Realtime Database)

ใส่ UID ของเฟิร์นแทนค่า `FERN_UID_HERE` ใน Firebase Console

```json
{
  "rules": {
    ".read": true, 
    ".write": "auth != null && auth.uid === 'FERN_UID_HERE'",

    "pages": {
      ".read": true,
      "$pageId": {
        ".write": "auth != null && auth.uid === 'FERN_UID_HERE'"
      }
    },

    "toc": {
      ".read": true,
      ".write": "auth != null && auth.uid === 'FERN_UID_HERE'"
    },

    "settings": {
      ".read": true,
      ".write": "auth != null && auth.uid === 'FERN_UID_HERE'"
    }
  }
}
```

## 🗂️ Storage Rules

ใส่ UID ของเฟิร์นแทนค่า `FERN_UID_HERE` ใน Firebase Console

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // อ่านไฟล์สาธารณะได้ทุกคน
    match /uploads/{userId}/{allPaths=**} {
      allow read: if true;

      // อัปโหลด/แก้ไข/ลบ ได้เฉพาะเฟิร์น และต้องอัปโหลดใต้โฟลเดอร์ของตัวเอง
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && userId == 'FERN_UID_HERE'
                   // ป้องกันไฟล์ใหญ่/ชนิดแปลก ๆ (ปรับได้)
                   && request.resource.size < 15 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*|video/.*');
    }
  }
}
```

## 🚀 วิธีการตั้งค่า

### 1. สร้างผู้ใช้ "เฟิร์น" ใน Firebase Auth
1. ไปที่ Firebase Console > Authentication > Users
2. คลิก "Add User"
3. กรอกอีเมลและรหัสผ่าน
4. ก๊อป UID ที่ได้

### 2. ตั้งค่า Database Rules
1. ไปที่ Firebase Console > Realtime Database > Rules
2. แทนที่ `FERN_UID_HERE` ด้วย UID ของเฟิร์น
3. คลิก "Publish"

### 3. ตั้งค่า Storage Rules
1. ไปที่ Firebase Console > Storage > Rules
2. แทนที่ `FERN_UID_HERE` ด้วย UID ของเฟิร์น
3. คลิก "Publish"

### 4. อัปเดตไฟล์ config
1. แก้ไข `js/firebase-config.js` ด้วยข้อมูลจริง
2. แก้ไข `admin/admin.js` โดยเปลี่ยน `FERN_UID_HERE` เป็น UID จริง

## 📊 โครงสร้างข้อมูลที่แนะนำ

```
pages/
  0001: { 
    title: "Cover",  
    type: "image", 
    src: "https://.../uploads/FERN_UID/cover.jpg",
    order: 1,
    createdAt: 1703123456789,
    updatedAt: 1703123456789
  }
  0002: { 
    title: "วันแรก", 
    type: "text",  
    content: "...",
    note: "บันทึกวันแรก",
    order: 2,
    createdAt: 1703123456789,
    updatedAt: 1703123456789
  }
  0003: { 
    title: "Vlog",   
    type: "video", 
    src: "https://.../uploads/FERN_UID/vlog.mp4",
    order: 3,
    createdAt: 1703123456789,
    updatedAt: 1703123456789
  }

toc/
  items: [
    { id: "0001", title: "Cover", order: 1 },
    { id: "0002", title: "วันแรก", order: 2 },
    { id: "0003", title: "Vlog", order: 3 }
  ]

settings/
  display: { 
    twoPageSpread: true, 
    pageFlipSound: true,
    enableNotes: true 
  }
```

## 🔐 การทำงานของ Security Rules

### Database Rules
- **อ่าน**: ทุกคนสามารถอ่านข้อมูลได้ (public read)
- **เขียน**: เฉพาะเฟิร์นเท่านั้นที่สามารถเขียนได้
- **โครงสร้าง**: อนุญาตให้เขียนเฉพาะใน path ที่กำหนด

### Storage Rules
- **อ่าน**: ทุกคนสามารถดูไฟล์ได้
- **เขียน**: เฉพาะเฟิร์นเท่านั้นที่สามารถอัปโหลดได้
- **Path**: ไฟล์ต้องอัปโหลดใต้ `/uploads/{FERN_UID}/...`
- **ขนาด**: จำกัดขนาดไฟล์ไม่เกิน 15MB
- **ประเภท**: รองรับเฉพาะรูปภาพและวิดีโอ

## ⚠️ ข้อควรระวัง

1. **UID ต้องตรงกัน**: UID ใน Rules ต้องตรงกับ UID ของผู้ใช้จริง
2. **Path ต้องถูกต้อง**: ไฟล์ต้องอัปโหลดใต้โฟลเดอร์ของตัวเอง
3. **ขนาดไฟล์**: จำกัดขนาดไฟล์เพื่อป้องกันการใช้งานที่ผิดวัตถุประสงค์
4. **ประเภทไฟล์**: จำกัดประเภทไฟล์เพื่อความปลอดภัย

## 🧪 การทดสอบ

### ทดสอบการอ่าน (Public)
- เปิดเว็บไซต์โดยไม่ล็อกอิน
- ควรอ่านข้อมูลได้ปกติ

### ทดสอบการเขียน (Admin Only)
- ล็อกอินเป็นเฟิร์น
- ควรเพิ่ม/แก้ไข/ลบข้อมูลได้
- ล็อกอินเป็นผู้ใช้อื่น
- ควรไม่สามารถเขียนข้อมูลได้

### ทดสอบ Storage
- อัปโหลดไฟล์ใต้ `/uploads/{FERN_UID}/...`
- ควรอัปโหลดได้
- อัปโหลดไฟล์ใต้ path อื่น
- ควรอัปโหลดไม่ได้
