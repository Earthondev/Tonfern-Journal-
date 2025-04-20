document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('next-page');
    const journalContainer = document.getElementById('journal-container');
    const flipbookContainer = $("#flipbook");
    const bookmarkButton = document.getElementById('bookmark-btn');
    const tocList = document.getElementById('toc');
    const flipSound = new Audio('/assets/sounds/page-flip.mp3'); // เสียงพลิกหน้า

    flipbookContainer.hide(); // ซ่อน flipbook ในตอนแรก

    // เปิดหน้า flipbook เมื่อคลิกหน้าปก
    nextButton.addEventListener('click', () => {
        journalContainer.style.display = 'none'; // ซ่อนหน้าปก
        flipbookContainer.show(); // แสดง flipbook

        flipbookContainer.turn({
            width: 800,
            height: 600,
            autoCenter: true,
        });

        nextButton.style.display = 'none'; // ซ่อนปุ่มหน้าถัดไป
    });

    // ปุ่มย้อนกลับ (previous page)
    document.getElementById('prev-page').addEventListener('click', () => {
        if (flipbookContainer.turn('page') > 1) {
            flipbookContainer.turn('previous');
            flipSound.play(); // เล่นเสียงพลิกหน้า
        }
    });

    // ปุ่มหน้าถัดไป (next page)
    nextButton.addEventListener('click', () => {
        flipbookContainer.turn('next');
        flipSound.play(); // เล่นเสียงพลิกหน้า
    });

    // ฟังก์ชัน Bookmark หน้า
    bookmarkButton.addEventListener('click', () => {
        const currentPage = flipbookContainer.turn('page');
        sessionStorage.setItem('bookmark', currentPage); // เก็บหน้า Bookmark
    });

    // โหลดหน้า Bookmark เมื่อกลับมาจากการปิดเว็บ
    const bookmarkPage = sessionStorage.getItem('bookmark');
    if (bookmarkPage) {
        flipbookContainer.turn('page', bookmarkPage);
    }

    // เพิ่มชื่อเรื่องใน TOC
    const pages = [
        { title: "หน้า 1 - เรื่องราว", pageNumber: 1 },
        { title: "หน้า 2 - บทที่ 1", pageNumber: 2 },
        { title: "หน้า 3 - บทที่ 2", pageNumber: 3 },
        // เพิ่มหน้าอื่นๆ
    ];

    pages.forEach(page => {
        const listItem = document.createElement('li');
        listItem.textContent = `${page.title} (หน้า ${page.pageNumber})`;
        tocList.appendChild(listItem);
    });

    // ฟังก์ชันเพิ่มโน้ตสั้นๆ ต่อหน้า
    document.querySelectorAll('.page').forEach(page => {
        const noteInput = document.createElement('input');
        noteInput.type = 'text';
        noteInput.placeholder = 'ใส่โน้ตที่นี่...';
        noteInput.addEventListener('change', (e) => {
            sessionStorage.setItem(`note-${page.dataset.page}`, e.target.value); // เก็บโน้ตใน sessionStorage
        });

        const savedNote = sessionStorage.getItem(`note-${page.dataset.page}`);
        if (savedNote) {
            noteInput.value = savedNote;
        }
        page.appendChild(noteInput);
    });
});
