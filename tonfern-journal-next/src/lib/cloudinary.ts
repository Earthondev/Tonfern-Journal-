// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your-upload-preset",
};

// Get Cloudinary URL
export function getCloudinaryUrl(publicId: string, options: any = {}) {
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

// Upload to Cloudinary (client-side upload) - ง่ายสุด
export async function uploadToCloudinary(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  
  const r = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, { 
    method: "POST", 
    body: form 
  });
  
  const j = await r.json();
  if (!j.secure_url) throw new Error(j.error?.message || "Upload failed");
  return j.secure_url as string;
}

// Upload PDF to Cloudinary
export async function uploadPdfToCloudinary(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
  form.append("resource_type", "raw");
  
  const r = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`, { 
    method: "POST", 
    body: form 
  });
  
  const j = await r.json();
  if (!j.secure_url) throw new Error(j.error?.message || "Upload failed");
  return j.secure_url as string;
}
