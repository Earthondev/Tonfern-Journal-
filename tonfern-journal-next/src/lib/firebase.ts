import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJu9g3YVy9-sdvBas5ZiI1C8BhI2RP1Ig",
  authDomain: "tonfern-journal.firebaseapp.com",
  databaseURL: "https://tonfern-journal-default-rtdb.firebaseio.com",
  projectId: "tonfern-journal",
  storageBucket: "tonfern-journal.appspot.com",
  messagingSenderId: "788428322570",
  appId: "1:788428322570:web:54f8b440e3a4fad81e6cf3",
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// Fern's User ID (you can set this in .env.local)
export const FERN_UID = process.env.NEXT_PUBLIC_FERN_UID || "FERN_UID_HERE";

// Helper functions
export const isAuthenticated = () => {
  return auth.currentUser !== null;
};

export const isFern = () => {
  return auth.currentUser?.uid === FERN_UID;
};

export type { User } from 'firebase/auth';
export type { DatabaseReference, DataSnapshot } from 'firebase/database';
export type { StorageReference, UploadResult } from 'firebase/storage';
