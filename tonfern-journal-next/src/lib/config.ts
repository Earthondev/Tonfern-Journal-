// Editor UIDs ที่อนุญาตให้แก้ไขได้
export const EDITOR_UIDS = new Set([
  process.env.NEXT_PUBLIC_FERN_UID!,
  process.env.NEXT_PUBLIC_OWNER_UID!,
].filter(Boolean));

// Firebase config
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCJu9g3YVy9-sdvBas5ZiI1C8BhI2RP1Ig",
  authDomain: "tonfern-journal.firebaseapp.com",
  databaseURL: "https://tonfern-journal-default-rtdb.firebaseio.com",
  projectId: "tonfern-journal",
  storageBucket: "tonfern-journal.appspot.com",
  messagingSenderId: "788428322570",
  appId: "1:788428322570:web:54f8b440e3a4fad81e6cf3",
};

// Cloudinary config (ถ้าใช้)
export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your-upload-preset",
};

// App config
export const APP_CONFIG = {
  name: "Tonfern Journal",
  description: "สมุดบันทึกดิจิทัลที่ออกแบบมาให้เหมือนหนังสือจริง",
  version: "1.0.0",
  maxFileSize: 25 * 1024 * 1024, // 25MB
  allowedFileTypes: ["image/*", "application/pdf"],
};
