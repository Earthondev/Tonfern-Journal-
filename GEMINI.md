# 🌿 Tonfern Journal (Next.js Edition)

## 📌 Project Overview
Tonfern Journal is a digital journal application designed to replicate the feel of a physical scrapbook or diary. It allows users to view entries with a rich, interactive scrapbook aesthetics. The project has been migrated from a vanilla HTML/CSS/JS stack to a modern **Next.js** application.

**Key Features:**
- **Scrapbook Aesthetic**: Visual design mimicking a real journal.
- **Digital Storytelling**: Support for images and PDFs in a "Story" format.
- **Admin System**: Secure area for editing and managing journal entries.
- **Cloud Integration**: Uses Firebase for data/auth and Cloudinary for media storage.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend & Auth**: Firebase (Authentication, Realtime Database)
- **Media Storage**: Cloudinary
- **Deployment**: Vercel (Recommended)
- **Key Libraries**: Fabric.js (Canvas), PDF.js (PDF rendering)

## 📂 Project Structure
The active development is located in the `tonfern-journal-next` directory.

```
Tonfern-Journal-/
├── tonfern-journal-next/       # MAIN PROJECT DIRECTORY
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/                # Config (Firebase, Cloudinary)
│   │   └── types/              # TS Interfaces
│   ├── public/                 # Static assets
│   ├── ... config files ...
└── (Legacy Files)              # Older HTML/CSS version (Do not use)
```

## 🚀 Getting Started

### 1. Key Commands
Run these inside `tonfern-journal-next/`:

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start local development server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm start` | Run production build locally |

### 2. Environment Setup
Create a `.env.local` file in `tonfern-journal-next/` with the following:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...

# Admin Access
NEXT_PUBLIC_FERN_UID=...
NEXT_PUBLIC_OWNER_UID=...
```

## 🧠 AI Context / Rules
- **Styling**: Always use Tailwind CSS. Match the "Scrapbook/Journal" aesthetic (warm tones, paper textures, handwritten-style fonts where appropriate).
- **State Management**: Use React Hooks and Firebase Realtime Database for dynamic content.
- **Type Safety**: strict TypeScript usage is enforced.
- **Directory**: Always prioritize working within `tonfern-journal-next`. Ignore the root legacy files unless explicitly asked to reference them.
