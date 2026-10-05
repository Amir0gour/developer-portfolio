export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { skillSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const data = skillSchema.parse(body);

    const skill = await prisma.skill.update({
      where: { id: params.id },
      data
    });

    await logActivity({
      action: 'update',
      entityType: 'skill',
      details: `Updated skill: ${skill.name}`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.SKILLS);
    return success(skill);
  } catch (error) {
    return badRequest('Invalid data provided');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const skill = await prisma.skill.delete({
      where: { id: params.id }
    });

    await logActivity({
      action: 'delete',
      entityType: 'skill',
      details: `Deleted skill: ${skill.name}`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.SKILLS);
    return success({ message: 'Deleted skill' });
  } catch (error) {
    return serverError('Failed to delete skill');
  }
}
