// Editor UIDs ที่อนุญาตให้แก้ไขได้
export const EDITOR_UIDS = new Set([
  process.env.NEXT_PUBLIC_FERN_UID!,
  process.env.NEXT_PUBLIC_OWNER_UID!,
].filter(Boolean));

// Firebase config
export const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
