# 🎨 Scrapbook Skin Pack

Make each page look like a real collage journal with polaroids, washi tape, torn paper, stickers, and hand-drawn elements!

## ✨ Features

- **📸 Polaroid Photos** - Realistic photo frames with captions
- **🎀 Washi Tape** - Decorative tape overlays
- **📝 Torn Paper Notes** - Authentic paper texture with torn edges
- **⭐ Stickers** - Fun decorative elements
- **✅ Checklists** - Interactive to-do lists
- **📅 Date Chips** - Stylish date indicators
- **✏️ Doodles** - Hand-drawn line elements
- **🏷️ Tags** - Categorized note labels

## 🚀 Quick Start

### 1. Add Scrapbook Layout to Your Page

```json
{
  "title": "My Scrapbook Page",
  "layout": "scrapbook",
  "blocks": [
    { "type": "heading", "text": "My Day", "x": 24, "y": 14 },
    { "type": "polaroid", "src": "path/to/image.jpg", "caption": "Great day!", "x": 34, "y": 68, "rot": -2 }
  ]
}
```

### 2. Import in Your Main Script

```javascript
import { renderScrapbook } from './skins/scrapbook.js';

// The renderer will automatically detect scrapbook layout
// and use the appropriate skin
```

## 🎯 Block Types

### Heading
```json
{ "type": "heading", "text": "Page Title", "x": 24, "y": 14 }
```

### Polaroid Photo
```json
{ 
  "type": "polaroid", 
  "src": "image-url.jpg", 
  "caption": "Photo caption", 
  "x": 34, "y": 68, 
  "rot": -2 
}
```

### Washi Tape
```json
{ "type": "tape", "x": 60, "y": 44 }
{ "type": "tape", "x": 60, "y": 44, "corner": true }
```

### Note
```json
{ 
  "type": "note", 
  "tag": "workout", 
  "text": "Note content here", 
  "x": 250, "y": 78 
}
```

### Sticker
```json
{ 
  "type": "sticker", 
  "src": "/assets/stickers/star.png", 
  "x": 215, "y": 220, 
  "rot": 6 
}
```

### Checklist
```json
{ 
  "type": "checklist", 
  "items": [
    {"text": "Task 1", "done": true},
    {"text": "Task 2", "done": false}
  ], 
  "x": 26, "y": 260 
}
```

### Date
```json
{ "type": "date", "text": "MAR 12", "x": 420, "y": 22 }
```

### Doodle
```json
{ "type": "doodle", "x": 240, "y": 220, "w": 120 }
```

## 🎨 Customization

### Colors
Edit `skins/scrapbook.css` to change the color scheme:

```css
:root {
  --scrap-ink: #3a2e2a;          /* Text color */
  --scrap-accent: #f59cab;       /* Primary accent */
  --scrap-accent-2: #a5c3ff;     /* Secondary accent */
}
```

### Textures
Replace the texture files in `assets/textures/`:
- `grid.png` - Background grid pattern
- `paper.png` - Paper grain texture
- `tape1.png` - Horizontal washi tape
- `tape2.png` - Corner washi tape
- `torn-mask.png` - Torn paper edge mask

### Stickers
Add your own stickers to `assets/stickers/`:
- `star.png` - Star sticker
- `camera.png` - Camera sticker
- `flower.png` - Flower sticker
- And more!

## 🔧 Technical Details

### Positioning
- All coordinates use `x` and `y` in pixels
- Origin (0,0) is top-left corner of the page
- Use `rot` for rotation in degrees

### Responsive Design
- The skin automatically adapts to different screen sizes
- Text and elements scale appropriately
- Mobile-friendly touch interactions

### Performance
- Lazy loading of images
- Efficient DOM manipulation
- Minimal reflows and repaints

## 📱 Mobile Support

- Touch-friendly interactions
- Responsive layouts
- Optimized for small screens
- Gesture support for navigation

## 🎭 Future Enhancements

- **Drag & Drop Editor** - Visual page builder for Fern
- **Animation Effects** - Smooth transitions and micro-interactions
- **Custom Themes** - Multiple color schemes
- **Export Options** - Save as image or PDF
- **Social Sharing** - Share pages on social media

## 🤝 Contributing

Want to add new block types or improve the skin?

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Submit a pull request

## 📄 License

This skin pack is part of Tonfern Journal and follows the same MIT license.

---

**Made with ❤️ for creative journaling!** 🎨✨
