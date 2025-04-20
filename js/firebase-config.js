// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue } from "firebase/database"; // Import Realtime Database functions
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Storage functions
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJu9g3YVy9-sdvBas5ZiI1C8BhI2RP1Ig",
  authDomain: "tonfern-jounal.firebaseapp.com",
  databaseURL: "https://tonfern-jounal-default-rtdb.firebaseio.com",
  projectId: "tonfern-jounal",
  storageBucket: "tonfern-jounal.firebasestorage.app",
  messagingSenderId: "788428322570",
  appId: "1:788428322570:web:54f8b440e3a4fad81e6cf3",
  measurementId: "G-0DD8SKYJ0D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firebase services for use in other files
export const database = getDatabase(app);
export const storage = getStorage(app);
export { ref, push, set, onValue, storageRef, uploadBytes, getDownloadURL };