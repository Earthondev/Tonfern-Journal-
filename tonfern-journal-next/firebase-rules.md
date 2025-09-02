# 🔥 Firebase Rules สำหรับ Tonfern Journal

## 📋 Storage Rules

อัปเดต Firebase Storage Rules (Spark ได้):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && userId == "FERN_UID_HERE"
                   && request.resource.size < 25 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*|application/pdf');
    }
  }
}
```

## 🗄️ Realtime Database Rules

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null && auth.uid === 'FERN_UID_HERE'"
  }
}
```

## ⚙️ การตั้งค่า

1. ไปที่ Firebase Console
2. เลือก Project ของคุณ
3. ไปที่ Storage > Rules
4. คัดลอก Storage Rules ด้านบน
5. ไปที่ Realtime Database > Rules
6. คัดลอก Database Rules ด้านบน
7. แทนที่ `FERN_UID_HERE` ด้วย UID จริงของ Fern

## 🔐 Security Features

- **Public Read**: ทุกคนอ่านได้
- **Authenticated Write**: เฉพาะ Fern เท่านั้นที่เขียนได้
- **File Size Limit**: 25MB ต่อไฟล์
- **File Type Restriction**: เฉพาะรูปภาพและ PDF
- **User Isolation**: แต่ละ user มีพื้นที่แยกกัน
