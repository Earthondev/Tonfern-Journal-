# 🔒 Security Notes - Tonfern Journal

## ⚠️ สิ่งที่ต้องระวัง

### Environment Variables
- **NEXT_PUBLIC_*** จะถูกส่งไป client — อย่าใส่ความลับจริง (เช่น Admin API key) ลงไป
- ใช้เฉพาะข้อมูลที่จำเป็นต้องแสดงใน client

### Firebase Security
- **Rules ของ DB/Storage คือด่านจริง** 
- ปล่อยให้ `.read = true` ได้ แต่ `.write` ต้องเช็ค UID ตามที่ทำแล้ว
- ถ้าเปิด Firebase Storage ภายหลัง ให้แน่ใจว่าอัปโหลดเก็บที่ `uploads/{uid}/...` เท่านั้น

### Authentication
- ใช้ Firebase Auth เป็นหลัก
- ตรวจสอบ UID ในทุก admin route
- ใช้ `useEditorGate` hook เพื่อความปลอดภัย

## 🛡️ Security Best Practices

### 1. Client-Side Security
```typescript
// ✅ ดี - ใช้ environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// ❌ ไม่ดี - ใส่ API key จริง
const apiKey = "sk-1234567890abcdef";
```

### 2. Server-Side Security
```typescript
// ✅ ดี - ตรวจสอบ UID ใน server
if (!EDITOR_UIDS.has(user.uid)) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// ❌ ไม่ดี - ไว้ใจ client
const userData = req.body; // ไม่ปลอดภัย
```

### 3. File Upload Security
```typescript
// ✅ ดี - ตรวจสอบ file type และ size
if (file.size > 25 * 1024 * 1024) throw new Error("File too large");
if (!file.type.match(/^(image\/|application\/pdf)/)) throw new Error("Invalid file type");

// ❌ ไม่ดี - รับไฟล์ทุกอย่าง
const uploadedFile = await uploadFile(file);
```

## 🔐 Firebase Rules ที่แนะนำ

### Realtime Database
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null && (auth.uid === 'UID1' || auth.uid === 'UID2')",
    "pages": { 
      ".read": true, 
      "$id": { 
        ".write": "auth != null && (auth.uid === 'UID1' || auth.uid === 'UID2')" 
      } 
    }
  }
}
```

### Storage (ถ้าใช้)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    allow read: if true;
    match /uploads/{userId}/{allPaths=**} {
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && (userId == "UID1" || userId == "UID2")
                   && request.resource.size < 25 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*|application/pdf');
    }
  }
}
```

## 🧪 Security Testing

### 1. ทดสอบ Authentication
```bash
# เปิด /api/test-firebase
curl http://localhost:3000/api/test-firebase
```

### 2. ทดสอบ Admin Access
```bash
# ต้อง redirect ไป /login ถ้าไม่ได้ login
curl http://localhost:3000/admin/pages
```

### 3. ทดสอบ File Upload
```bash
# ต้อง reject ไฟล์ที่ไม่ใช่ image/PDF
# ต้อง reject ไฟล์ใหญ่เกิน 25MB
```

## 📞 Security Issues

หากพบช่องโหว่ความปลอดภัย:
1. สร้าง issue ใน GitHub
2. Email: fern@tonfern.com
3. อย่าเปิดเผยในที่สาธารณะ

## 🔄 Security Updates

- อัปเดต dependencies เป็นประจำ
- ตรวจสอบ Firebase Rules ทุกเดือน
- ตรวจสอบ Cloudinary settings ทุกเดือน
- เปลี่ยน UIDs เป็นประจำ (ถ้าจำเป็น)
