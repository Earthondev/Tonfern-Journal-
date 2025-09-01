// Tonfern Journal Admin Panel
class AdminPanel {
    constructor() {
        this.FERN_UID = 'FERN_UID_HERE'; // เปลี่ยนเป็น UID ของเฟิร์น
        this.currentUser = null;
        this.pages = [];
        this.selectedPages = new Set();
        
        this.init();
    }

    async init() {
        this.bindEvents();
        this.checkAuthState();
        this.loadSettings();
    }

    bindEvents() {
        // Auth events
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.signInWithEmail();
        });

        document.getElementById('googleSignIn').addEventListener('click', () => {
            this.signInWithGoogle();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.signOut();
        });

        // Form events
        document.getElementById('addPageForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewPage();
        });

        document.getElementById('clearForm').addEventListener('click', () => {
            this.clearAddPageForm();
        });

        document.getElementById('pageType').addEventListener('change', (e) => {
            this.toggleFormFields(e.target.value);
        });

        // Page management events
        document.getElementById('refreshPages').addEventListener('click', () => {
            this.loadPages();
        });

        document.getElementById('deleteSelected').addEventListener('click', () => {
            this.deleteSelectedPages();
        });

        // Settings events
        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
    }

    // Authentication
    async checkAuthState() {
        try {
            firebase.auth().onAuthStateChanged((user) => {
                if (user && user.uid === this.FERN_UID) {
                    this.currentUser = user;
                    this.showAdminPanel();
                    this.loadPages();
                    this.updateUserInfo();
                } else {
                    this.currentUser = null;
                    this.showAuthSection();
                }
            });
        } catch (error) {
            console.error('Auth state check failed:', error);
            this.showNotification('เกิดข้อผิดพลาดในการตรวจสอบการเข้าสู่ระบบ', 'error');
        }
    }

    async signInWithEmail() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            if (userCredential.user.uid !== this.FERN_UID) {
                await firebase.auth().signOut();
                this.showNotification('คุณไม่มีสิทธิ์เข้าถึง admin panel', 'error');
            }
        } catch (error) {
            console.error('Sign in failed:', error);
            this.showNotification('การเข้าสู่ระบบล้มเหลว: ' + error.message, 'error');
        }
    }

    async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await firebase.auth().signInWithPopup(provider);
            
            if (result.user.uid !== this.FERN_UID) {
                await firebase.auth().signOut();
                this.showNotification('คุณไม่มีสิทธิ์เข้าถึง admin panel', 'error');
            }
        } catch (error) {
            console.error('Google sign in failed:', error);
            this.showNotification('การเข้าสู่ระบบด้วย Google ล้มเหลว', 'error');
        }
    }

    async signOut() {
        try {
            await firebase.auth().signOut();
            this.showNotification('ออกจากระบบแล้ว', 'info');
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    }

    // UI Management
    showAuthSection() {
        document.getElementById('authSection').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
    }

    showAdminPanel() {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
    }

    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('userEmail').textContent = this.currentUser.email;
        }
    }

    // Form Management
    toggleFormFields(pageType) {
        const contentGroup = document.getElementById('contentGroup');
        const fileGroup = document.getElementById('fileGroup');

        if (pageType === 'text' || pageType === 'cover') {
            contentGroup.style.display = 'block';
            fileGroup.style.display = 'none';
        } else {
            contentGroup.style.display = 'none';
            fileGroup.style.display = 'block';
        }
    }

    clearAddPageForm() {
        document.getElementById('addPageForm').reset();
        document.getElementById('contentGroup').style.display = 'block';
        document.getElementById('fileGroup').style.display = 'none';
    }

    // Page Management
    async addNewPage() {
        const title = document.getElementById('pageTitle').value.trim();
        const pageType = document.getElementById('pageType').value;
        const content = document.getElementById('pageContent').value.trim();
        const note = document.getElementById('pageNote').value.trim();
        const order = parseInt(document.getElementById('pageOrder').value) || this.pages.length + 1;

        if (!title) {
            this.showNotification('กรุณากรอกหัวข้อหน้า', 'error');
            return;
        }

        try {
            let pageData = {
                title,
                type: pageType,
                note: note || null,
                order,
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            if (pageType === 'text' || pageType === 'cover') {
                if (!content) {
                    this.showNotification('กรุณากรอกเนื้อหา', 'error');
                    return;
                }
                pageData.content = content;
            } else {
                const file = document.getElementById('pageFile').files[0];
                if (!file) {
                    this.showNotification('กรุณาเลือกไฟล์', 'error');
                    return;
                }

                // Upload file to Firebase Storage
                const downloadURL = await this.uploadFile(file);
                pageData.src = downloadURL;
            }

            // Save to Firebase Database
            const pageId = await this.savePageToDatabase(pageData);
            
            this.showNotification('เพิ่มหน้าสำเร็จแล้ว!', 'success');
            this.clearAddPageForm();
            this.loadPages();
            
        } catch (error) {
            console.error('Add page failed:', error);
            this.showNotification('ไม่สามารถเพิ่มหน้าได้: ' + error.message, 'error');
        }
    }

    async uploadFile(file) {
        // Check file size (15MB limit)
        if (file.size > 15 * 1024 * 1024) {
            throw new Error('ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 15MB)');
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('ไฟล์ไม่ถูกต้อง (รองรับ: JPG, PNG, GIF, MP4, MOV)');
        }

        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`uploads/${this.FERN_UID}/${Date.now()}_${file.name}`);
        
        const snapshot = await fileRef.put(file);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        return downloadURL;
    }

    async savePageToDatabase(pageData) {
        const dbRef = firebase.database().ref();
        const newPageRef = await dbRef.child('pages').push(pageData);
        return newPageRef.key;
    }

    async loadPages() {
        try {
            const dbRef = firebase.database().ref('pages');
            const snapshot = await dbRef.once('value');
            
            this.pages = [];
            snapshot.forEach((childSnapshot) => {
                this.pages.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });

            // Sort by order
            this.pages.sort((a, b) => a.order - b.order);
            
            this.renderPages();
            this.updateStats();
            
        } catch (error) {
            console.error('Load pages failed:', error);
            this.showNotification('ไม่สามารถโหลดหน้าหนังสือได้', 'error');
        }
    }

    renderPages() {
        const pagesList = document.getElementById('pagesList');
        
        if (this.pages.length === 0) {
            pagesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <h3>ยังไม่มีหน้าใดๆ</h3>
                    <p>เริ่มต้นด้วยการเพิ่มหน้าแรกของคุณ</p>
                </div>
            `;
            return;
        }

        pagesList.innerHTML = this.pages.map(page => `
            <div class="page-item" data-page-id="${page.id}">
                <input type="checkbox" class="page-checkbox" 
                       onchange="adminPanel.togglePageSelection('${page.id}', this.checked)">
                
                <div class="page-info">
                    <div class="page-title">${page.title}</div>
                    <div class="page-meta">
                        ประเภท: ${this.getPageTypeLabel(page.type)} | 
                        ลำดับ: ${page.order} | 
                        สร้างเมื่อ: ${new Date(page.createdAt).toLocaleDateString('th-TH')}
                    </div>
                </div>
                
                <div class="page-actions">
                    <button class="action-btn edit" onclick="adminPanel.editPage('${page.id}')" title="แก้ไข">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="adminPanel.deletePage('${page.id}')" title="ลบ">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getPageTypeLabel(type) {
        const labels = {
            'text': 'ข้อความ',
            'image': 'รูปภาพ',
            'video': 'วิดีโอ',
            'cover': 'หน้าปก'
        };
        return labels[type] || type;
    }

    togglePageSelection(pageId, selected) {
        if (selected) {
            this.selectedPages.add(pageId);
        } else {
            this.selectedPages.delete(pageId);
        }
        
        const deleteBtn = document.getElementById('deleteSelected');
        deleteBtn.style.display = this.selectedPages.size > 0 ? 'block' : 'none';
    }

    async deletePage(pageId) {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบหน้านี้?')) return;

        try {
            const page = this.pages.find(p => p.id === pageId);
            
            // Delete from Firebase Database
            await firebase.database().ref(`pages/${pageId}`).remove();
            
            // Delete file from Storage if exists
            if (page.src) {
                try {
                    const fileRef = firebase.storage().refFromURL(page.src);
                    await fileRef.delete();
                } catch (error) {
                    console.log('File deletion failed (might not exist):', error);
                }
            }
            
            this.showNotification('ลบหน้าสำเร็จแล้ว', 'success');
            this.loadPages();
            
        } catch (error) {
            console.error('Delete page failed:', error);
            this.showNotification('ไม่สามารถลบหน้าได้', 'error');
        }
    }

    async deleteSelectedPages() {
        if (this.selectedPages.size === 0) return;
        
        if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบ ${this.selectedPages.size} หน้าที่เลือก?`)) return;

        try {
            for (const pageId of this.selectedPages) {
                await this.deletePage(pageId);
            }
            
            this.selectedPages.clear();
            document.getElementById('deleteSelected').style.display = 'none';
            
        } catch (error) {
            console.error('Delete selected pages failed:', error);
        }
    }

    editPage(pageId) {
        // TODO: Implement edit functionality
        this.showNotification('ฟีเจอร์แก้ไขจะมาเร็วๆ นี้', 'info');
    }

    // Settings Management
    async loadSettings() {
        try {
            const dbRef = firebase.database().ref('settings');
            const snapshot = await dbRef.once('value');
            const settings = snapshot.val() || {};
            
            document.getElementById('twoPageSpread').checked = settings.twoPageSpread !== false;
            document.getElementById('pageFlipSound').checked = settings.pageFlipSound !== false;
            document.getElementById('enableNotes').checked = settings.enableNotes === true;
            
        } catch (error) {
            console.error('Load settings failed:', error);
        }
    }

    async saveSettings() {
        try {
            const settings = {
                twoPageSpread: document.getElementById('twoPageSpread').checked,
                pageFlipSound: document.getElementById('pageFlipSound').checked,
                enableNotes: document.getElementById('enableNotes').checked,
                updatedAt: Date.now()
            };

            await firebase.database().ref('settings').set(settings);
            this.showNotification('บันทึกการตั้งค่าแล้ว', 'success');
            
        } catch (error) {
            console.error('Save settings failed:', error);
            this.showNotification('ไม่สามารถบันทึกการตั้งค่าได้', 'error');
        }
    }

    updateStats() {
        document.getElementById('totalPages').textContent = this.pages.length;
        document.getElementById('totalImages').textContent = this.pages.filter(p => p.type === 'image').length;
        document.getElementById('totalVideos').textContent = this.pages.filter(p => p.type === 'video').length;
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize admin panel when DOM is loaded
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});

// Global functions for onclick handlers
window.adminPanel = null;
