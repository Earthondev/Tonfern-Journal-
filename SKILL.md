# ⚡ Skills & Workflows: Tonfern Journal

This document outlines the specialized skills, workflows, and operational procedures for maintaining and developing the Tonfern Journal project.

## 🛠 Development Skills

### 1. Frontend Development (Next.js + Tailwind)
- **Component Creation**:
  - Create atomic components in `src/components`.
  - Use `interface` for defining props.
  - Ensure all components are responsive (mobile-first approach).
- **Styling**:
  - Use Tailwind utility classes.
  - Extend `tailwind.config.ts` for custom colors or fonts if needed.
  - Avoid inline styles unless manipulating dynamic coordinates (e.g., drag-and-drop).

### 2. Backend Integration (Firebase & Cloudinary)
- **Database Operations**:
  - Read: Use Firebase Realtime Database hooks/subscriptions.
  - Write: Ensure proper validation before pushing to DB.
  - Rules: strict security rules defined in `FIREBASE-RULES.md`.
- **Media Handling**:
  - Upload images/PDFs to Cloudinary using the unsigned preset.
  - Store the returned public URL in Firebase.
  - Optimize images before display (use Cloudinary transformations).

### 3. Canvas & PDF Manipulation
- **Fabric.js**:
  - Used for the interactive "scrapbook" editing experience.
  - Key focus: Object manipulation (drag, rotate, resize).
- **PDF.js**:
  - Rendering PDF pages as images for the journal view.
  - Optimization: Lazy load pages to prevent memory spikes.

## 🔄 Operational Workflows

### 📥 Setup New Environment
```markdown
1. `cd tonfern-journal-next`
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in keys.
4. `npm run dev`
```

### 🚀 Deployment (Vercel)
1. Ensure all changes are committed and pushed to `main`.
2. Vercel automatically detects Next.js.
3. Verify Environment Variables are set in the Vercel Dashboard.
4. Redeploy triggers automatically on push.

### 🛡 Security Checks
- **Env Variables**: Never commit `.env.local`.
- **Firebase Rules**: Periodically audit `FIREBASE-RULES.md` and the actual Firebase console rules.
- **Access Control**: Verify `NEXT_PUBLIC_FERN_UID` and `NEXT_PUBLIC_OWNER_UID` strictly control admin routes.

## 🐞 Troubleshooting Guide

| Issue | Potential Cause | Solution |
|-------|-----------------|----------|
| **Images not loading** | Cloudinary domain not whitelisted in `next.config.ts` | Add hostname to `images` config. |
| **Permission Denied (Firebase)** | User UID not matching Rules | Check Auth status and Realtime DB rules. |
| **Hydration Error** | HTML mismatch between Server/Client | Check for random values or `window` access in usage during SSR. |
| **Canvas not interactive** | Fabric.js initialization timing | Ensure Fabric initializes inside `useEffect` after mount. |

## 📚 Reference Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react_integration)
