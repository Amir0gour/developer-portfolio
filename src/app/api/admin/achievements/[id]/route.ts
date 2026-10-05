export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, notFound, badRequest, success, serverError } from '@/lib/auth-helpers';
import { achievementSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const item = await prisma.achievement.findUnique({ where: { id: params.id } });
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
    const data = achievementSchema.parse(body);

    if (data.date) data.date = new Date(data.date);

    const item = await prisma.achievement.update({ where: { id: params.id }, data });

    await logActivity({
      action: 'update',
      entityType: 'achievement',
      details: `Updated achievement`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.ACHIEVEMENTS);
    return success(item);
  } catch (error) {
    return badRequest('Invalid data');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    await prisma.achievement.delete({ where: { id: params.id } });

    await logActivity({
      action: 'delete',
      entityType: 'achievement',
      details: `Deleted achievement`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.ACHIEVEMENTS);
    return success({ message: 'Deleted' });
  } catch (error) {
    return serverError('Failed to delete');
  }
}
