import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, notFound, success, serverError } from '@/lib/auth-helpers';
import { logActivity } from '@/lib/activity';
import { deleteFile } from '@/lib/upload';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const media = await prisma.media.findUnique({ where: { id: params.id } });
    if (!media) return notFound('Media not found');

    await deleteFile(media.url);
    await prisma.media.delete({ where: { id: params.id } });

    await logActivity({
      action: 'delete',
      entityType: 'media',
      details: `Deleted media: ${media.filename}`,
      adminId: admin.id
    });

    return success({ message: 'Media deleted' });
  } catch (error) {
    return serverError('Failed to delete media');
  }
}
