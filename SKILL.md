# ⚡ Skills & Workflows: Tonfern Journal (Production Grade)

This document outlines the engineering standards, architectural patterns, and operational procedures for developing the Tonfern Journal project. It is structured to ensure scalability, security, and performance.

## 🟥 Tier 1 – Critical Skills (Must Follow)
*Violating these rules will likely cause production failures or security breaches.*

### 1. Performance Optimization
*Prevent memory leaks and ensure smooth rendering of heavy media.*
- **Hydration Safety (Next.js 15)**:
  - NEVER access `window`, `document`, or `localStorage` directly in server components or rendering logic.
  - Wrap client-only logic (Fabric.js, PDF.js, Date rendering) in `useEffect` or dynamic imports with `{ ssr: false }`.
  - Use `suppressHydrationWarning` only as a last resort for specific attributes (e.g., timestamps).
- **Heavy Component Management**:
  - **Fabric.js / PDF.js**: MUST be loaded lazily on the client side only.
  - **Clean Up**: Always `.dispose()` canvas instances and remove event listeners in `useEffect` cleanup function.
  - **Virtualization**: If rendering lists > 50 items (e.g., TOC), implement windowing/virtualization.

### 2. Admin Route Protection
*Ensure "Fern's Diary" remains private and secure.*
- **Double-Layer Auth**:
  - **Client-side**: Use `useEditorGate` hook to check UID matches `NEXT_PUBLIC_FERN_UID`.
  - **Server-side**: Never render sensitive admin UI/Forms if user is not authenticated.
- **Environment Safety**:
  - Never expose Admin UIDs or Service Account Keys in public variables.
  - Audit `FIREBASE-RULES.md` regularly to ensure only authenticated UIDs can write data.

### 3. Type Safety Enforcement
*Zero `any` policy to prevent runtime crashes.*
- **Strict Typing**:
  - Define interfaces for ALL Firebase data models in `src/types`.
  - No `any` allowed in function arguments, return types, or component props.
- **API Response**:
  - Always type API responses: `Promise<ApiResponse<T>>`.

### 4. Security Hardening
- **Input Validation**:
  - Validate all file uploads (Check MIME type and size) BEFORE sending to Cloudinary.
  - Sanitize user text inputs to prevent XSS (even within the Journal context).

## 🟧 Tier 2 – Architecture & Scalability
*Essential for keeping the codebase clean and maintainable.*

### 1. Reusable Hooks Pattern
- **Encapsulation**:
  - Never call `onValue` directly inside UI components.
  - Wrap logic in custom hooks: `useJournalData`, `useAdminAuth`, `useCloudinaryUpload`.
- **Subscription Management**:
  - **MANDATORY**: Always return an unsubscribe function in `useEffect`.
  - Avoid duplicate listeners for the same path.

### 2. Database Schema Discipline
- **Data Integrity**:
  - Ensure data structures match the defined Interfaces.
  - Use consistent naming conventions (camelCase for properties).

### 3. Cloudinary Optimization Rules
- **Transformation**:
  - NEVER display original images directly.
  - ALWAYS append `f_auto,q_auto` to image URLs.
  - Use specific width (`w_800` etc.) appropriate for the display container.

## 🟨 Tier 3 – UX & Aesthetic Consistency
*Maintain the unique "Scrapbook" identity.*

### 1. Scrapbook Design System
- **Texture Layering**:
  - Every "paper" element must have a subtle noise/texture overlay.
  - Use standard `tailwind.config.ts` colors (`emerald-800`, `stone-100`).
- **Shadows & Depth**:
  - Use `shadow-sm` for details (stickers, tapes).
  - Use `shadow-xl` for the main book container.
  - Use `mix-blend-mode` (multiply) for realistic tape effects.

### 2. Animation & Interaction
- **Micro-interactions**:
  - Add hover effects to all interactive elements (buttons, stickers).
  - Page transitions should feel like "turning a page" or "opening a book".

## 🟩 Tier 4 – Testing & Verification
*Ensure stability before deployment.*

### 1. Mandatory 3-Round Verification (The Iron Rule)
Before submitting any work, you MUST pass these 3 checks:

1.  **Technical Check**:
    - `npm run dev` has Zero Terminal Errors.
    - Browser Console has Zero Red Errors (ignore generic Extension errors).
    - TypeScript compilation succeeds without errors.

2.  **Visual Check**:
    - Design matches the "Scrapbook" aesthetic.
    - Responsive verify: Desktop & Mobile simulation.
    - Assets (Textures, Fonts, Icons) load correctly.

3.  **Functional Check**:
    - Core User Flows work: Open Book -> Read -> Close.
    - Admin Flows work: Upload -> Save -> Update TOC.
    - Data loads from Real Firebase (not Mock).

### 2. Manual QA Checklist
- [ ] Check console for Hydration Mismatches.
- [ ] Verify image loading speed (Cloudinary opt).
- [ ] Test on a small screen (Mobile view).

## 🗂 Operational Workflows

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
