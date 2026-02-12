// TypeScript types for Tonfern Journal

export interface JournalPage {
  id: string;
  title: string;
  layout: 'classic' | 'documentA4' | 'scrapbook' | 'story' | 'cover' | 'toc';
  content?: string;
  media?: PageMedia;
  caption?: string;
  note?: string;
  blocks?: ScrapbookBlock[];
  order: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PageMedia {
  type: 'image' | 'pdf' | 'video';
  src: string;
  page?: number; // For PDF pages
  originalPdf?: string; // For PDF pages
  size?: string; // For story pages (e.g., "1080x1920")
}

export interface ScrapbookBlock {
  type: 'heading' | 'polaroid' | 'tape' | 'note' | 'checklist' | 'sticker' | 'date' | 'doodle';
  text?: string;
  src?: string;
  caption?: string;
  x: number;
  y: number;
  rot?: number;
  w?: number;
  h?: number;
  corner?: boolean;
  tag?: string;
  items?: ChecklistItem[];
}

export interface ChecklistItem {
  text: string;
  done: boolean;
}

export interface TOCItem {
  id: string;
  title: string;
  order: number;
}

export interface StoryDraft {
  id: string;
  canvasJSON: string;
  caption: string;
  updatedAt: number;
  owner: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface Bookmark {
  pageId: string;
  userId: string;
  createdAt: string;
}

export interface Note {
  pageId: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

// Form data types
export interface AddPageFormData {
  title: string;
  file: File | null;
  caption: string;
  layout: 'documentA4' | 'scrapbook';
  note: string;
}

export interface StoryFormData {
  caption: string;
  canvasData: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
