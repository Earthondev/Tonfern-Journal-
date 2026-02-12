// ═══════════════════════════════════════════
// Cloudinary — Media Pipeline
// ═══════════════════════════════════════════

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your-upload-preset",
};

// ─── Optimized URL Builder ──────────────────
// Auto-format + auto-quality for all Cloudinary URLs
export function getOptimizedUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'limit';
    quality?: 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best' | number;
    format?: 'auto' | 'webp' | 'avif';
  } = {}
): string {
  // Only transform Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;

  const transforms: string[] = ['f_auto', 'q_auto'];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.quality && options.quality !== 'auto') transforms.push(`q_${options.quality}`);
  if (options.format && options.format !== 'auto') transforms.push(`f_${options.format}`);

  const transformStr = transforms.join(',');

  // Insert transforms into URL: .../upload/{transforms}/...
  return url.replace('/upload/', `/upload/${transformStr}/`);
}

// ─── Get Cloudinary URL (legacy) ────────────
export function getCloudinaryUrl(publicId: string, options: Record<string, string | number> = {}) {
  const { cloudName } = cloudinaryConfig;
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  const transformations = [];
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.quality) transformations.push(`q_${options.quality}`);

  const transformString = transformations.length > 0 ? `/${transformations.join(',')}` : '';
  return `${baseUrl}${transformString}/${publicId}`;
}

// ─── Upload Image ───────────────────────────
export async function uploadToCloudinary(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  const r = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: "POST",
    body: form,
  });

  const j = await r.json();
  if (!j.secure_url) throw new Error(j.error?.message || "Upload failed");
  return j.secure_url as string;
}

// ─── Upload PDF ─────────────────────────────
export async function uploadPdfToCloudinary(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  form.append("resource_type", "raw");

  const r = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`, {
    method: "POST",
    body: form,
  });

  const j = await r.json();
  if (!j.secure_url) throw new Error(j.error?.message || "Upload failed");
  return j.secure_url as string;
}

// ─── Upload Video ───────────────────────────
export async function uploadVideoToCloudinary(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  const r = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`, {
    method: "POST",
    body: form,
  });

  const j = await r.json();
  if (!j.secure_url) throw new Error(j.error?.message || "Video upload failed");
  return j.secure_url as string;
}

// ─── Get Video Thumbnail ────────────────────
export function getVideoThumbnail(videoUrl: string, options: { width?: number; time?: string } = {}): string {
  if (!videoUrl.includes('res.cloudinary.com')) return '';
  const w = options.width || 480;
  const t = options.time || 'so_1';
  return videoUrl
    .replace('/video/upload/', `/video/upload/w_${w},c_fill,f_jpg,q_auto,${t}/`)
    .replace(/\.\w+$/, '.jpg');
}
