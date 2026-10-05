import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_DOC_SIZE = 10 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
export const ALLOWED_DOC_TYPES = ['application/pdf'];

export interface UploadResult {
  filename: string;
  url: string;
  type: string;
  mimeType: string;
  size: number;
}

export function validateFile(file: File, type: 'image' | 'document' = 'image') {
  if (type === 'image') {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new Error('Invalid image type. Allowed: JPG, PNG, WEBP, GIF, SVG');
    if (file.size > MAX_IMAGE_SIZE) throw new Error('Image too large. Max size: 5MB');
  } else {
    if (!ALLOWED_DOC_TYPES.includes(file.type)) throw new Error('Invalid document type. Allowed: PDF');
    if (file.size > MAX_DOC_SIZE) throw new Error('Document too large. Max size: 10MB');
  }
}

export async function saveFile(file: File): Promise<UploadResult> {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  validateFile(file, isImage ? 'image' : 'document');

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const filename = `${crypto.randomUUID()}.${ext}`;
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);

  return { filename, url: `/uploads/${filename}`, type: isImage ? 'image' : 'document', mimeType: file.type, size: file.size };
}

export async function deleteFile(url: string): Promise<boolean> {
  try {
    const filename = url.split('/').pop();
    if (!filename) return false;
    const filepath = join(process.cwd(), 'public', 'uploads', filename);
    if (existsSync(filepath)) { await unlink(filepath); return true; }
    return false;
  } catch (error) {
    console.error(`Failed to delete file: ${url}`, error);
    return false;
  }
}
