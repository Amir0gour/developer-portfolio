import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, notFound, badRequest, success, serverError } from '@/lib/auth-helpers';
import { educationSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const item = await prisma.education.findUnique({ where: { id: params.id } });
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
    const data = educationSchema.parse(body);

    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    const item = await prisma.education.update({ where: { id: params.id }, data });

    await logActivity({
      action: 'update',
      entityType: 'education',
      details: `Updated education`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.EDUCATION);
    return success(item);
  } catch (error) {
    return badRequest('Invalid data');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    await prisma.education.delete({ where: { id: params.id } });

    await logActivity({
      action: 'delete',
      entityType: 'education',
      details: `Deleted education`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.EDUCATION);
    return success({ message: 'Deleted' });
  } catch (error) {
    return serverError('Failed to delete');
  }
}
