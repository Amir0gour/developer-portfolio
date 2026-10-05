import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { saveFile } from '@/lib/upload';
import { logActivity } from '@/lib/activity';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const resume = await prisma.resume.findFirst({ where: { isActive: true } });
    return success(resume);
  } catch (error) {
    return serverError('Failed to fetch resume');
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) return badRequest('No file provided');

    const result = await saveFile(file);

    await prisma.resume.updateMany({ data: { isActive: false } });

    const resume = await prisma.resume.create({
      data: {
        filename: result.filename,
        url: result.url,
        size: result.size,
        isActive: true
      }
    });

    await logActivity({
      action: 'upload',
      entityType: 'resume',
      details: `Uploaded new resume: ${result.filename}`,
      adminId: admin.id
    });

    return success(resume, 201);
  } catch (error) {
    return serverError('Failed to upload resume');
  }
}
