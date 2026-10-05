import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { skillCategorySchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const data = skillCategorySchema.parse(body);

    const category = await prisma.skillCategory.update({
      where: { id: params.id },
      data
    });

    await logActivity({
      action: 'update',
      entityType: 'skillCategory',
      details: `Updated category: ${category.name}`,
      adminId: admin.id
    });

    return success(category);
  } catch (error) {
    return badRequest('Invalid data');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const category = await prisma.skillCategory.delete({
      where: { id: params.id }
    });

    await logActivity({
      action: 'delete',
      entityType: 'skillCategory',
      details: `Deleted category: ${category.name}`,
      adminId: admin.id
    });

    return success({ message: 'Deleted' });
  } catch (error) {
    return serverError('Failed to delete');
  }
}
