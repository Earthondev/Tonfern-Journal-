document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('next-page');
    const journalContainer = document.getElementById('journal-container');
    const flipbook = document.getElementById('flipbook');
    
    const flipbookContainer = $("#flipbook");

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

        nextButton.style.display = 'block'; // แสดงปุ่มหน้าถัดไป
    });

    // ปุ่มย้อนกลับ (previous page)
    document.getElementById('prev-page').addEventListener('click', () => {
        if (flipbookContainer.turn('page') > 1) {
            flipbookContainer.turn('previous');
        }
    });
});
