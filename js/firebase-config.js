import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database"; // Import Realtime Database functions
import { getStorage } from "firebase/storage"; // Import Storage functions

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export { database, storage, ref, onValue };
    messageBox.classList.add(type);
    messageBox.style.display = 'block';
//
//     // Load pages on page load
//     loadPages();
//
//     // Load tags for filtering
//     onValue(tagsRef, (snapshot) => {
//         if (snapshot.exists()) {
            const tags = [];                    