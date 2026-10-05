import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, notFound, badRequest, success, serverError } from '@/lib/auth-helpers';
import { socialLinkSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const item = await prisma.socialLink.findUnique({ where: { id: params.id } });
    if (!item) return notFound('Not found');
    return success(item);
  } catch (error) {
    return serverError('Failed to fetch');
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const data = socialLinkSchema.parse(body);

    const item = await prisma.socialLink.update({ where: { id: params.id }, data });

    await logActivity({
      action: 'update',
      entityType: 'socialLink',
      details: `Updated social link`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.SOCIAL_LINKS);
    return success(item);
  } catch (error) {
    return badRequest('Invalid data');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    await prisma.socialLink.delete({ where: { id: params.id } });

    await logActivity({
      action: 'delete',
      entityType: 'socialLink',
      details: `Deleted social link`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.SOCIAL_LINKS);
    return success({ message: 'Deleted' });
  } catch (error) {
    return serverError('Failed to delete');
  }
}
