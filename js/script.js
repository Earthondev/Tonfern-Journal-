// Tonfern Journal - Digital Notebook Application
class TonfernJournal {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 1;
        this.pages = [];
        this.bookmarks = new Set();
        this.notes = {};
        this.isBookOpen = false;
        
        this.init();
    }

    init() {
        this.loadBookmarks();
        this.loadNotes();
        this.bindEvents();
        this.loadPages();
        this.renderTOC();
        this.updateNavigation();
    }

    bindEvents() {
        // Book cover events
        document.getElementById('openBookBtn').addEventListener('click', () => {
            this.openBook();
        });

        // Sidebar events
        document.getElementById('tocToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        document.getElementById('closeSidebar').addEventListener('click', () => {
            this.closeSidebar();
        });

        // Navigation events
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousPage();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextPage();
        });

        // Add page button
        document.getElementById('addPageBtn').addEventListener('click', () => {
            this.showAddPageModal();
        });



        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideModal('addPageModal');
        });

        document.getElementById('cancelAddPage').addEventListener('click', () => {
            this.hideModal('addPageModal');
        });

        document.getElementById('savePage').addEventListener('click', () => {
            this.savePage();
        });

        // Bookmark events
        document.getElementById('bookmarkBtn').addEventListener('click', () => {
            this.toggleBookmark();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousPage();
            } else if (e.key === 'ArrowRight') {
                this.nextPage();
            } else if (e.key === 'Escape') {
                this.closeSidebar();
                this.hideAllModals();
            }
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });
    }

    // Book Management
    openBook() {
        this.isBookOpen = true;
        document.getElementById('bookCover').style.display = 'none';
        document.getElementById('bookPages').style.display = 'block';
        this.goToPage(1);
        this.playPageFlipSound();
    }

    closeBook() {
        this.isBookOpen = false;
        document.getElementById('bookCover').style.display = 'block';
        document.getElementById('bookPages').style.display = 'none';
        this.currentPage = 1;
    }

    // Page Management
    async loadPages() {
        try {
            // Try to load from Firebase first
            if (window.firebaseServices) {
                const snapshot = await window.firebaseServices.pagesRef.once('value');
                this.pages = [];
                
                snapshot.forEach((childSnapshot) => {
                    this.pages.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });

                // Sort by order
                this.pages.sort((a, b) => (a.order || 0) - (b.order || 0));
            } else {
                // Fallback to demo pages if Firebase is not configured
                this.pages = [
                    {
                        id: 1,
                        title: 'ยินดีต้อนรับสู่ Tonfern Journal',
                        content: 'นี่คือสมุดบันทึกดิจิทัลของคุณ ที่ออกแบบมาให้เหมือนหนังสือจริง พร้อมฟีเจอร์ที่น่าสนใจมากมาย',
                        type: 'text',
                        note: 'เริ่มต้นการเดินทางในโลกแห่งการบันทึก',
                        order: 1
                    },
                    {
                        id: 2,
                        title: 'วิธีใช้งาน',
                        content: '• ใช้ปุ่มลูกศรซ้าย-ขวาเพื่อเปลี่ยนหน้า\n• คลิกที่ปุ่มเมนูเพื่อเปิดสารบัญ\n• ใช้ปุ่ม Bookmark เพื่อเก็บหน้าที่ชอบ\n• คลิกที่ไอคอนโน้ตเพื่อเพิ่มบันทึก',
                        type: 'text',
                        note: 'คู่มือการใช้งานเบื้องต้น',
                        order: 2
                    },
                    {
                        id: 3,
                        title: 'ตัวอย่างวิดีโอ',
                        content: 'คุณสามารถฝังวิดีโอลงในหน้ากระดาษได้ เพื่อให้เนื้อหาน่าสนใจมากขึ้น',
                        type: 'video',
                        src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        note: 'การใช้งานวิดีโอในสมุดบันทึก',
                        order: 3
                    }
                ];
            }

            this.totalPages = this.pages.length;
            this.renderCurrentPage();
            this.updateNavigation();
        } catch (error) {
            console.error('Error loading pages:', error);
            this.showError('ไม่สามารถโหลดหน้าหนังสือได้');
        }
    }

    async renderCurrentPage() {
        const pageContainer = document.getElementById('pageContainer');
        const currentPageData = this.pages[this.currentPage - 1];

        if (!currentPageData) {
            this.renderEmptyPage();
            return;
        }

        // Check if page should use scrapbook layout
        if (currentPageData.layout === 'scrapbook') {
            try {
                // Import and use scrapbook renderer
                const { renderScrapbook } = await import('../skins/scrapbook.js');
                renderScrapbook(pageContainer, currentPageData);
                return;
            } catch (error) {
                console.warn('Scrapbook renderer not available, falling back to default:', error);
            }
        }

        // Default page rendering
        pageContainer.innerHTML = `
            <div class="page ${this.currentPage % 2 === 1 ? 'left' : 'right'}" data-page-id="${currentPageData.id}">
                <button class="bookmark-btn" title="Bookmark" aria-pressed="${this.bookmarks.has(currentPageData.id)}">
                    <span class="heart ${this.bookmarks.has(currentPageData.id) ? 'active' : ''}">❤</span>
                </button>
                
                <h2 class="page-title">${currentPageData.title}</h2>
                
                ${currentPageData.type === 'text' || currentPageData.type === 'cover' ? 
                    `<div class="content">${this.formatContent(currentPageData.content)}</div>` : ''}
                
                ${currentPageData.type === 'image' ? 
                    `<img src="${currentPageData.src}" alt="${currentPageData.title}" class="page-media">` : ''}
                
                ${currentPageData.type === 'video' ? this.renderVideo(currentPageData.src) : ''}
                
                ${currentPageData.note ? `
                    <div class="note">
                        <input type="text" value="${currentPageData.note}" placeholder="เพิ่มบันทึก..." readonly>
                        <button class="note-btn" onclick="tonfernJournal.editNote(${currentPageData.id})">แก้ไข</button>
                    </div>
                ` : ''}
            </div>
        `;

        // Bind page-specific events
        this.bindPageEvents();
    }

    renderEmptyPage() {
        const pageContainer = document.getElementById('pageContainer');
        pageContainer.innerHTML = `
            <div class="page">
                <div class="empty-page">
                    <i class="fas fa-book-open"></i>
                    <h3>ไม่มีเนื้อหาในหน้านี้</h3>
                    <p>คลิกปุ่ม "เพิ่มหน้า" เพื่อสร้างเนื้อหาใหม่</p>
                </div>
            </div>
        `;
    }

    renderVideo(videoUrl) {
        if (videoUrl.includes('youtube.com')) {
            const videoId = videoUrl.split('v=')[1] || videoUrl.split('embed/')[1];
            return `<iframe class="page-media" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        }
        return `<video class="page-media" controls><source src="${videoUrl}" type="video/mp4">เบราว์เซอร์ของคุณไม่รองรับวิดีโอ</video>`;
    }

    renderNote(noteText) {
        return `
            <div class="note">
                <input type="text" value="${noteText}" placeholder="เพิ่มบันทึก..." readonly>
                <button class="note-btn">แก้ไข</button>
            </div>
        `;
    }

    formatContent(content) {
        return content.replace(/\n/g, '<br>');
    }

    bindPageEvents() {
        // Bookmark page button
        document.querySelector('.bookmark-btn').addEventListener('click', (e) => {
            const pageId = parseInt(e.currentTarget.closest('.page').dataset.pageId);
            this.togglePageBookmark(pageId);
            
            // Update button state
            const heart = e.currentTarget.querySelector('.heart');
            const isBookmarked = this.bookmarks.has(pageId);
            e.currentTarget.setAttribute('aria-pressed', !isBookmarked);
            heart.classList.toggle('active', !isBookmarked);
        });
    }

    // Navigation
    goToPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > this.totalPages) return;

        this.currentPage = pageNumber;
        this.renderCurrentPage();
        this.updateNavigation();
        this.updateTOC();
        this.playPageFlipSound();
        
        // Add page flip animation
        const page = document.querySelector('.page');
        page.classList.add('page-flip');
        setTimeout(() => {
            page.classList.remove('page-flip');
        }, 600);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    updateNavigation() {
        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = this.totalPages;
        
        document.getElementById('prevBtn').disabled = this.currentPage === 1;
        document.getElementById('nextBtn').disabled = this.currentPage === this.totalPages;
    }

    // Sidebar Management
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const tocToggle = document.getElementById('tocToggle');
        const isHidden = sidebar.getAttribute('aria-hidden') === 'true';
        
        sidebar.setAttribute('aria-hidden', !isHidden);
        tocToggle.setAttribute('aria-expanded', !isHidden);
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const tocToggle = document.getElementById('tocToggle');
        sidebar.setAttribute('aria-hidden', 'true');
        tocToggle.setAttribute('aria-expanded', 'false');
    }

    // Table of Contents
    renderTOC() {
        const tocList = document.getElementById('tocList');
        tocList.innerHTML = '';

        this.pages.forEach((page, index) => {
            const tocItem = document.createElement('a');
            tocItem.href = '#';
            tocItem.className = 'toc-item';
            tocItem.dataset.pageNumber = index + 1;
            
            tocItem.innerHTML = `
                <span class="toc-bullet"></span>
                <span class="toc-title">${page.title}</span>
            `;

            tocItem.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToPage(index + 1);
                this.closeSidebar();
            });

            tocList.appendChild(tocItem);
        });
    }

    updateTOC() {
        // Remove active class from all items
        document.querySelectorAll('.toc-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current page
        const currentTocItem = document.querySelector(`[data-page-number="${this.currentPage}"]`);
        if (currentTocItem) {
            currentTocItem.classList.add('active');
        }
    }

    // Bookmark System
    toggleBookmark() {
        if (this.bookmarks.has(this.currentPage)) {
            this.bookmarks.delete(this.currentPage);
        } else {
            this.bookmarks.add(this.currentPage);
        }
        
        this.saveBookmarks();
        this.updateBookmarkButton();
        this.renderCurrentPage(); // Re-render to update bookmark icon
    }

    togglePageBookmark(pageId) {
        if (this.bookmarks.has(pageId)) {
            this.bookmarks.delete(pageId);
        } else {
            this.bookmarks.add(pageId);
        }
        
        this.saveBookmarks();
        this.updateBookmarkButton();
        this.renderCurrentPage();
    }

    updateBookmarkButton() {
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        const isBookmarked = this.bookmarks.has(this.currentPage);
        
        bookmarkBtn.innerHTML = `
            <i class="fas fa-bookmark ${isBookmarked ? 'text-yellow-500' : ''}"></i> 
            ${isBookmarked ? 'ยกเลิก Bookmark' : 'Bookmark'}
        `;
    }

    saveBookmarks() {
        sessionStorage.setItem('tonfernBookmarks', JSON.stringify(Array.from(this.bookmarks)));
    }

    loadBookmarks() {
        const saved = sessionStorage.getItem('tonfernBookmarks');
        if (saved) {
            this.bookmarks = new Set(JSON.parse(saved));
        }
    }

    // Note System
    showNoteModal(pageId) {
        const modal = document.getElementById('noteModal');
        const noteText = document.getElementById('noteText');
        
        // Pre-fill with existing note
        noteText.value = this.notes[pageId] || '';
        
        // Update save button to work with specific page
        const saveNoteBtn = document.getElementById('saveNote');
        saveNoteBtn.onclick = () => this.saveNote(pageId);
        
        modal.classList.add('show');
    }

    saveNote(pageId) {
        const noteText = document.getElementById('noteText').value.trim();
        
        if (noteText) {
            this.notes[pageId] = noteText;
            this.saveNotes();
        } else {
            delete this.notes[pageId];
            this.saveNotes();
        }
        
        this.hideModal('noteModal');
        this.renderCurrentPage();
        this.renderTOC();
    }

    saveNotes() {
        sessionStorage.setItem('tonfernNotes', JSON.stringify(this.notes));
    }

    loadNotes() {
        const saved = sessionStorage.getItem('tonfernNotes');
        if (saved) {
            this.notes = JSON.parse(saved);
        }
    }

    editNote(pageId) {
        // TODO: Implement note editing
        this.showNotification('ฟีเจอร์แก้ไขบันทึกจะมาเร็วๆ นี้', 'info');
    }

    // Add Page Modal
    showAddPageModal() {
        this.hideAllModals();
        const modal = document.getElementById('addPageModal');
        modal.classList.add('show');
        
        // Clear form
        document.getElementById('pageTitle').value = '';
        document.getElementById('pageContent').value = '';
        document.getElementById('pageVideo').value = '';
        document.getElementById('pageNote').value = '';
    }

    async savePage() {
        const title = document.getElementById('pageTitle').value.trim();
        const content = document.getElementById('pageContent').value.trim();
        const video = document.getElementById('pageVideo').value.trim();
        const note = document.getElementById('pageNote').value.trim();

        if (!title || !content) {
            this.showError('กรุณากรอกหัวข้อและเนื้อหา');
            return;
        }

        try {
            const newPage = {
                id: this.pages.length + 1,
                title,
                content,
                video: video || null,
                note: note || null
            };

            this.pages.push(newPage);
            this.totalPages = this.pages.length;

            // In production, save to Firebase here
            // await this.savePageToFirebase(newPage);

            this.hideModal('addPageModal');
            this.renderTOC();
            this.goToPage(this.totalPages);
            
            this.showSuccess('เพิ่มหน้าสำเร็จแล้ว!');
        } catch (error) {
            console.error('Error saving page:', error);
            this.showError('ไม่สามารถบันทึกหน้าได้');
        }
    }

    // Modal Management
    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    // Utility Functions
    playPageFlipSound() {
        const audio = document.getElementById('pageFlipSound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#fee2e2' : type === 'success' ? '#dcfce7' : '#dbeafe'};
            color: ${type === 'error' ? '#991b1b' : type === 'success' ? '#166534' : '#1e40af'};
            border: 2px solid ${type === 'error' ? '#fca5a5' : type === 'success' ? '#86efac' : '#93c5fd'};
            border-radius: 12px;
            padding: 15px 20px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tonfernJournal = new TonfernJournal();
});

// Add some CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(notificationStyles);
