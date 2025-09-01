// Firebase Configuration for Tonfern Journal
// Replace with your own Firebase config

const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const database = firebase.database();
const storage = firebase.storage();

// Firebase Database References
const pagesRef = database.ref('pages');
const bookmarksRef = database.ref('bookmarks');
const notesRef = database.ref('notes');

// Firebase Storage References
const imagesRef = storage.ref('images');
const videosRef = storage.ref('videos');

// Export Firebase services for use in other files
window.firebaseServices = {
    database,
    storage,
    pagesRef,
    bookmarksRef,
    notesRef,
    imagesRef,
    videosRef
};

// Firebase Database Functions
class FirebaseService {
    // Save page to Firebase
    static async savePage(pageData) {
        try {
            const newPageRef = await pagesRef.push(pageData);
            return newPageRef.key;
        } catch (error) {
            console.error('Error saving page to Firebase:', error);
            throw error;
        }
    }

    // Load pages from Firebase
    static async loadPages() {
        try {
            const snapshot = await pagesRef.once('value');
            const pages = [];
            
            snapshot.forEach((childSnapshot) => {
                pages.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            return pages.sort((a, b) => a.id - b.id);
        } catch (error) {
            console.error('Error loading pages from Firebase:', error);
            throw error;
        }
    }

    // Update page in Firebase
    static async updatePage(pageId, pageData) {
        try {
            await pagesRef.child(pageId).update(pageData);
            return true;
        } catch (error) {
            console.error('Error updating page in Firebase:', error);
            throw error;
        }
    }

    // Delete page from Firebase
    static async deletePage(pageId) {
        try {
            await pagesRef.child(pageId).remove();
            return true;
        } catch (error) {
            console.error('Error deleting page from Firebase:', error);
            throw error;
        }
    }

    // Save bookmarks to Firebase
    static async saveBookmarks(userId, bookmarks) {
        try {
            await bookmarksRef.child(userId).set(Array.from(bookmarks));
            return true;
        } catch (error) {
            console.error('Error saving bookmarks to Firebase:', error);
            throw error;
        }
    }

    // Load bookmarks from Firebase
    static async loadBookmarks(userId) {
        try {
            const snapshot = await bookmarksRef.child(userId).once('value');
            const bookmarks = snapshot.val() || [];
            return new Set(bookmarks);
        } catch (error) {
            console.error('Error loading bookmarks from Firebase:', error);
            throw error;
        }
    }

    // Save notes to Firebase
    static async saveNotes(userId, notes) {
        try {
            await notesRef.child(userId).set(notes);
            return true;
        } catch (error) {
            console.error('Error saving notes to Firebase:', error);
            throw error;
        }
    }

    // Load notes from Firebase
    static async loadNotes(userId) {
        try {
            const snapshot = await notesRef.child(userId).once('value');
            return snapshot.val() || {};
        } catch (error) {
            console.error('Error loading notes from Firebase:', error);
            throw error;
        }
    }

    // Upload file to Firebase Storage
    static async uploadFile(file, path) {
        try {
            const fileRef = storage.ref(path);
            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            return downloadURL;
        } catch (error) {
            console.error('Error uploading file to Firebase Storage:', error);
            throw error;
        }
    }

    // Delete file from Firebase Storage
    static async deleteFile(path) {
        try {
            const fileRef = storage.ref(path);
            await fileRef.delete();
            return true;
        } catch (error) {
            console.error('Error deleting file from Firebase Storage:', error);
            throw error;
        }
    }
}

// Export Firebase service
window.FirebaseService = FirebaseService;

// Note: To use Firebase in production:
// 1. Replace the firebaseConfig with your actual Firebase project configuration
// 2. Enable Firebase Realtime Database and Storage in your Firebase console
// 3. Set up appropriate security rules for your database and storage
// 4. Update the TonfernJournal class to use FirebaseService instead of sessionStorage

console.log('Firebase configuration loaded. Remember to update with your actual Firebase config!');                    