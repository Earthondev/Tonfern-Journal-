import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

// นำเข้าข้อมูลการตั้งค่า Firebase จากไฟล์ firebase-config.js
import firebaseConfig from './firebase-config.js';

// Initialize Firebase app if not already initialized
const app = initializeApp(firebaseConfig);

// Get Realtime Database reference
const database = getDatabase(app);
const pagesRef = ref(database, 'pages');
const journalContainer = document.getElementById('journal-container');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const tocList = document.getElementById('toc-list');

let pagesData = [];
let currentPageIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    // ดึงข้อมูลหน้าทั้งหมดจาก Firebase
    onValue(pagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // แปลง Object เป็น Array และเรียงตามลำดับ 'order'
            pagesData = Object.values(data).sort((a, b) => a.order - b.order);
            displayPage(currentPageIndex);
            createTableOfContents(pagesData);
            updateNavigationButtons();
        } else {
            journalContainer.innerHTML = '<p>ไม่มีหน้าใน Journal</p>';
            tocList.innerHTML = '';
            updateNavigationButtons();
        }
    });

    // Event listeners สำหรับปุ่มเปลี่ยนหน้า
    prevButton.addEventListener('click', showPreviousPage);
    nextButton.addEventListener('click', showNextPage);
});

function displayPage(index) {
    if (index >= 0 && index < pagesData.length) {
        const page = pagesData[index];
        journalContainer.innerHTML = `
            <div class="page">
                <img src="${page.imgurUrl}" alt="Page ${index + 1}">
                ${page.text ? `<p>${page.text}</p>` : ''}
                <div class="tags">${page.tags ? page.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ') : ''}</div>
            </div>
        `;
        updateNavigationButtons(); // อัปเดตสถานะปุ่มเมื่อเปลี่ยนหน้า
    } else {
        journalContainer.innerHTML = '<p>ไม่พบหน้า</p>';
        updateNavigationButtons();
    }
}

function showPreviousPage() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        displayPage(currentPageIndex);
    }
}

function showNextPage() {
    if (currentPageIndex < pagesData.length - 1) {
        currentPageIndex++;
        displayPage(currentPageIndex);
    }
}

function createTableOfContents(pages) {
    const allTags = {};
    pages.forEach(page => {
        if (page.tags) {
            page.tags.forEach(tag => {
                allTags[tag] = true;
            });
        }
    });
    const uniqueTags = Object.keys(allTags);
    tocList.innerHTML = ''; // เคลียร์สารบัญเก่าก่อนอัปเดต
    uniqueTags.forEach(tag => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = tag;
        link.addEventListener('click', () => filterByTag(tag));
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
}

function filterByTag(tag) {
    const filteredPagesIndex = pagesData.findIndex(page => page.tags && page.tags.includes(tag));
    if (filteredPagesIndex !== -1) {
        currentPageIndex = filteredPagesIndex;
        displayPage(currentPageIndex);
    } else {
        alert(`ไม่พบหน้าที่มีแท็ก "${tag}"`);
    }
}

function updateNavigationButtons() {
    prevButton.disabled = currentPageIndex === 0;
    nextButton.disabled = currentPageIndex === pagesData.length - 1;
}