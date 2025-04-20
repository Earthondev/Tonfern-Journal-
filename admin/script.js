import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set } from 'firebase/database';
import firebaseConfig from '../js/firebase-config.js';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Realtime Database reference
const database = getDatabase(app);
const pagesRef = ref(database, 'pages');
const tagsRef = ref(database, 'tags');

document.addEventListener('DOMContentLoaded', () => {
    const newPageForm = document.getElementById('newPageForm');
    const messageBox = document.getElementById('messageBox');

    newPageForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const imageUrl = document.getElementById('imageUrl').value.trim();
        const text = document.getElementById('text').value.trim();
        const tagsInput = document.getElementById('tags').value.trim();
        const order = parseInt(document.getElementById('order').value);

        // Check if URL and order are valid
        if (!imageUrl || isNaN(order)) {
            displayMessage('กรุณากรอก URL รูปภาพและลำดับหน้าให้ถูกต้อง', 'error');
            return;
        }

        const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        const newPageData = {
            imgurUrl: imageUrl,
            text: text,
            tags: tagsArray,
            order: order
        };

        try {
            const newPageRef = push(pagesRef);
            await set(newPageRef, newPageData);

            // อัปเดตแท็กใน node 'tags'
            tagsArray.forEach(tag => {
                set(ref(database, `tags/${tag}`), true);
            });

            displayMessage('บันทึกหน้าใหม่สำเร็จ!', 'success');
            newPageForm.reset();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
            displayMessage('เกิดข้อผิดพลาดในการบันทึกหน้าใหม่ โปรดลองอีกครั้ง', 'error');
        }
    });

    function displayMessage(message, type) {
        messageBox.textContent = message;
        messageBox.className = `success`; // Default to success
        messageBox.classList.remove('error');
        if (type === 'error') {
            messageBox.classList.add('error');
        } else {
            messageBox.classList.add('success');
        }
        messageBox.style.display = 'block';
    }
});
