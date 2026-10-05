import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { saveFile } from '@/lib/upload';
import { logActivity } from '@/lib/activity';

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return badRequest('No file provided');
    }

    const result = await saveFile(file);

    const media = await prisma.media.create({
      data: {
        filename: result.filename,
        url: result.url,
        type: result.type,
        mimeType: result.mimeType,
        size: result.size
      }
    });

    await logActivity({
      action: 'upload',
      entityType: 'media',
      details: result.filename,
      adminId: admin.id
    });

    return success(media, 201);
  } catch (error) {
    console.error('Upload API Error:', error);
    return serverError('Failed to upload file');
  }
}
