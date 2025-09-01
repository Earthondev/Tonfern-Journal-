// Render simple positioned collage items from a `page.blocks` array.
// Supported block types: heading, polaroid, note, tape, sticker, checklist, date, doodle
export function renderScrapbook(container, page) {
  container.classList.add('scrap-page');
  container.innerHTML = '';
  
  // Add bookmark button
  const bookmarkBtn = document.createElement('button');
  bookmarkBtn.className = 'bookmark-btn';
  bookmarkBtn.title = 'Bookmark';
  bookmarkBtn.setAttribute('aria-pressed', 'false');
  bookmarkBtn.innerHTML = '<span class="heart">❤</span>';
  container.appendChild(bookmarkBtn);
  
  // Add note input
  const noteDiv = document.createElement('div');
  noteDiv.className = 'note';
  noteDiv.innerHTML = `
    <input type="text" placeholder="เพิ่มบันทึก..." readonly>
    <button class="note-btn" onclick="tonfernJournal.editNote(${page.id || 'current'})">แก้ไข</button>
  `;
  container.appendChild(noteDiv);
  
  // Render blocks
  (page.blocks || []).forEach((b) => {
    const el = document.createElement('div');
    el.style.left = (b.x || 0) + 'px';
    el.style.top = (b.y || 0) + 'px';
    if (b.rot) el.style.setProperty('--rot', b.rot + 'deg');

    switch (b.type) {
      case 'heading':
        el.className = 'scrap-heading';
        el.textContent = b.text || '';
        break;
      case 'polaroid': {
        el.className = 'scrap-polaroid';
        const img = new Image();
        img.src = b.src;
        img.alt = b.caption || '';
        el.appendChild(img);
        const cap = document.createElement('div');
        cap.className = 'cap';
        cap.textContent = b.caption || '';
        el.appendChild(cap);
        break;
      }
      case 'tape':
        el.className = 'scrap-tape' + (b.corner ? ' corner' : '');
        break;
      case 'note': {
        el.className = 'scrap-note';
        const tag = b.tag ? `<span class="tag">${b.tag}</span>` : '';
        el.innerHTML = `${tag}${b.text || ''}`;
        break;
      }
      case 'sticker': {
        const img = new Image();
        img.src = b.src;
        img.className = 'scrap-sticker';
        el.replaceWith(img); // use <img> directly
        img.style.left = (b.x || 0) + 'px';
        img.style.top = (b.y || 0) + 'px';
        if (b.rot) img.style.setProperty('--rot', b.rot + 'deg');
        container.appendChild(img);
        return;
      }
      case 'checklist': {
        el.className = 'scrap-check';
        const ul = document.createElement('ul');
        (b.items || []).forEach(it => {
          const li = document.createElement('li');
          li.innerHTML = `<input type="checkbox" ${it.done ? 'checked' : ''} disabled> <span>${it.text}</span>`;
          ul.appendChild(li);
        });
        el.appendChild(ul);
        break;
      }
      case 'date':
        el.className = 'scrap-date';
        el.textContent = b.text || '';
        break;
      case 'doodle':
        el.className = 'scrap-doodle';
        el.style.width = (b.w || 120) + 'px';
        break;
      default:
        return;
    }
    container.appendChild(el);
  });
  
  // Bind bookmark events
  const heart = bookmarkBtn.querySelector('.heart');
  bookmarkBtn.addEventListener('click', () => {
    bookmarkBtn.classList.toggle('active');
    bookmarkBtn.setAttribute('aria-pressed', String(bookmarkBtn.classList.contains('active')));
    heart.classList.toggle('active');
    
    // Store bookmark in sessionStorage
    const pageId = page.id || 'current';
    const bookmarks = JSON.parse(sessionStorage.getItem('tonfernBookmarks') || '[]');
    if (bookmarkBtn.classList.contains('active')) {
      if (!bookmarks.includes(pageId)) {
        bookmarks.push(pageId);
      }
    } else {
      const index = bookmarks.indexOf(pageId);
      if (index > -1) {
        bookmarks.splice(index, 1);
      }
    }
    sessionStorage.setItem('tonfernBookmarks', JSON.stringify(bookmarks));
  });
  
  // Check if page is bookmarked
  const pageId = page.id || 'current';
  const bookmarks = JSON.parse(sessionStorage.getItem('tonfernBookmarks') || '[]');
  if (bookmarks.includes(pageId)) {
    bookmarkBtn.classList.add('active');
    bookmarkBtn.setAttribute('aria-pressed', 'true');
    heart.classList.add('active');
  }
}
