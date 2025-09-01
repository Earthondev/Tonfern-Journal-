# 📖 Tonfern Journal - สมุดบันทึกดิจิทัล

[![Tonfern Journal](https://img.shields.io/badge/Tonfern-Journal-green?style=for-the-badge&logo=book)](https://tonfern-journal.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-green.svg?style=for-the-badge)](https://github.com/yourusername)

> 🌿 **Tonfern Journal** - สมุดบันทึกดิจิทัลที่ออกแบบมาให้เหมือนหนังสือจริง พร้อมฟีเจอร์ที่น่าสนใจมากมาย

## ✨ ฟีเจอร์หลัก

### 📚 การแสดงผลแบบหนังสือ
- **หน้าปกสวยงาม** - หน้าปกที่มีการออกแบบน่ารัก พร้อมแอนิเมชัน
- **การพลิกหน้า** - เอฟเฟกต์พลิกหน้าพร้อมเสียงเปิดหน้า
- **การแสดงผลแบบหน้าคู่** - เหมือนหนังสือจริง
- **Page Grain & Spine** - เอฟเฟกต์กระดาษและสันหนังสือ

### 🎯 ฟีเจอร์หลัก
- **Table of Contents (TOC)** - สารบัญที่อยู่ด้านข้าง เลือกเปิดไปยังหน้าที่ต้องการได้
- **Bookmark System** - เก็บหน้าที่ชอบ (ใช้ session storage)
- **Note System** - เขียนบันทึกสั้นๆ ได้ทีละ 1 บรรทัดต่อหน้า
- **Video Support** - รองรับการฝังวิดีโอในเนื้อหา
- **Premium UI** - ธีมสีเขียวสวยงาม พร้อม responsive design

### 🔧 ระบบหลังบ้าน
- **Firebase Integration** - พร้อมสำหรับการเชื่อมต่อกับ Firebase Realtime Database และ Storage
- **Admin Panel** - ระบบจัดการเนื้อหาสำหรับผู้ดูแล
- **Security Rules** - ระบบความปลอดภัยที่เข้มงวด
- **Session Management** - จัดการข้อมูลชั่วคราวในเบราว์เซอร์

## 🚀 Live Demo

**🌐 เว็บไซต์หลัก**: [https://tonfern-journal-acruydx8h-earthondevs-projects.vercel.app](https://tonfern-journal-acruydx8h-earthondevs-projects.vercel.app)

**🔐 Admin Panel**: [https://tonfern-journal-acruydx8h-earthondevs-projects.vercel.app/admin](https://tonfern-journal-acruydx8h-earthondevs-projects.vercel.app/admin)

## 🛠️ การติดตั้ง

### 1. Clone โปรเจก
```bash
git clone https://github.com/yourusername/tonfern-journal.git
cd tonfern-journal
```

### 2. เปิดไฟล์ในเบราว์เซอร์
เนื่องจากเป็นเว็บแอปพลิเคชันแบบ static คุณสามารถเปิดไฟล์ `index.html` ในเบราว์เซอร์ได้เลย

### 3. การใช้งาน Firebase (ไม่บังคับ)
หากต้องการใช้ Firebase:

1. สร้างโปรเจก Firebase ใหม่
2. เปิดใช้งาน Firebase Realtime Database และ Storage
3. แก้ไขไฟล์ `js/firebase-config.js` โดยใส่ข้อมูลการตั้งค่าของคุณ
4. อัปเดต `admin/admin.js` เพื่อเปลี่ยน `FERN_UID_HERE` เป็น UID จริง
5. ตั้งค่า Security Rules ตามไฟล์ `firebase-security-rules.md`

## 🎮 วิธีการใช้งาน

### การเปิดหนังสือ
1. คลิกปุ่ม "เปิดหนังสือ" บนหน้าปก
2. หนังสือจะเปิดและแสดงหน้าต่างๆ

### การนำทาง
- **ปุ่มลูกศรซ้าย-ขวา** - เปลี่ยนหน้า
- **ปุ่มเมนู** (มุมซ้ายบน) - เปิด/ปิดสารบัญ
- **คีย์บอร์ด** - ใช้ลูกศรซ้าย-ขวาเพื่อเปลี่ยนหน้า

### การใช้งานฟีเจอร์
- **Bookmark** - คลิกไอคอนหัวใจ ❤ บนหน้าเพื่อเก็บหน้าที่ชอบ
- **เพิ่มบันทึก** - คลิกไอคอนโน้ตเพื่อเพิ่มบันทึกสั้นๆ
- **เพิ่มหน้าใหม่** - ใช้ปุ่ม "เพิ่มหน้า" ในสารบัญ

### การจัดการเนื้อหา (Admin)
- **เพิ่มหน้าใหม่** - กรอกหัวข้อ เนื้อหา และลิงก์วิดีโอ (ไม่บังคับ)
- **แก้ไขบันทึก** - คลิกไอคอนโน้ตเพื่อแก้ไขบันทึกที่มีอยู่
- **อัปโหลดไฟล์** - รองรับรูปภาพและวิดีโอ (สูงสุด 15MB)

## 🎨 การออกแบบ

### ธีมและสี
- **โทนสีหลัก**: สีเขียวอ่อน สีเขียวเข้ม (ตามที่เฟิร์นชอบ)
- **ฟอนต์**: Noto Sans Thai สำหรับการรองรับภาษาไทย
- **ไอคอน**: Font Awesome สำหรับไอคอนต่างๆ

### แอนิเมชัน
- **การลอยตัว** - เอฟเฟกต์ลอยตัวบนหน้าปก
- **การเด้ง** - ไอคอนขนนกที่เด้งขึ้นลง
- **การพลิกหน้า** - เอฟเฟกต์พลิกหน้าพร้อมเสียง
- **การเลื่อน** - การเลื่อนของ sidebar และ modal

### Responsive Design
- **Desktop**: แสดงผลแบบเต็มหน้าจอ พร้อม sidebar
- **Tablet**: ปรับขนาดให้เหมาะสมกับหน้าจอขนาดกลาง
- **Mobile**: ปรับ layout เป็นแนวตั้ง ปุ่มและข้อความขนาดใหญ่

## 🔧 การปรับแต่ง

### การเปลี่ยนสี
แก้ไขไฟล์ `css/style.css` ในส่วน CSS variables:

```css
:root {
  --accent: #10b981;       /* สีเขียวหลัก */
  --accent-2: #059669;     /* สีเขียวเข้ม */
  --soft: #d1fae5;         /* สีเขียวอ่อน */
}
```

### การเพิ่มฟีเจอร์
แก้ไขไฟล์ `js/script.js` ในคลาส `TonfernJournal`

### การเชื่อมต่อ Firebase
1. แก้ไข `js/firebase-config.js`
2. อัปเดต `js/script.js` เพื่อใช้ Firebase service

## 📱 การรองรับเบราว์เซอร์

- ✅ **Chrome** (แนะนำ)
- ✅ **Firefox**
- ✅ **Safari**
- ✅ **Edge**
- ⚠️ **Internet Explorer** (ไม่รองรับ)

## 🎵 เสียงประกอบ

- **เสียงพลิกหน้า**: `assets/sounds/page-flip.mp3`
- สามารถเปลี่ยนไฟล์เสียงได้โดยแก้ไขใน `index.html`

## 🚧 การพัฒนาต่อ

### ฟีเจอร์ที่อาจเพิ่มในอนาคต
- [ ] ระบบล็อกอินและผู้ใช้
- [ ] การแชร์หนังสือ
- [ ] การพิมพ์เป็น PDF
- [ ] การเพิ่มรูปภาพ
- [ ] การค้นหาเนื้อหา
- [ ] การจัดหมวดหมู่หน้า
- [ ] ระบบ comment และ feedback

### การปรับปรุงประสิทธิภาพ
- [ ] Lazy loading สำหรับหน้า
- [ ] การ cache ข้อมูล
- [ ] การบีบอัดรูปภาพ
- [ ] Service Worker สำหรับ offline

## 🤝 การมีส่วนร่วม

เรายินดีรับการมีส่วนร่วมจากทุกคน! หากคุณต้องการ:

1. **Fork** โปรเจกนี้
2. สร้าง **Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. **Push** ไปยัง Branch (`git push origin feature/AmazingFeature`)
5. เปิด **Pull Request**

## 📄 License

โปรเจกนี้อยู่ภายใต้ MIT License - ดูรายละเอียดในไฟล์ [LICENSE](LICENSE)

## 🙏 ขอบคุณ

- **เฟิร์น** - สำหรับแรงบันดาลใจและความชอบในสีเขียว
- **Font Awesome** - สำหรับไอคอนที่สวยงาม
- **Noto Sans Thai** - สำหรับฟอนต์ภาษาไทย

## 📞 ติดต่อ

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Website**: [https://yourwebsite.com](https://yourwebsite.com)

---

**Tonfern Journal** - สร้างประสบการณ์การอ่านที่เหมือนหนังสือจริงในโลกดิจิทัล 📚✨

*Made with ❤️ for Fern*
