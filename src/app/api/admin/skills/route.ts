export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { skillSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const skills = await prisma.skill.findMany({
      include: { category: true },
      orderBy: { order: 'asc' }
    });
    return success(skills);
  } catch (error) {
    return serverError('Failed to fetch skills');
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const data = skillSchema.parse(body);

    const skill = await prisma.skill.create({
      data
    });

    await logActivity({
      action: 'create',
      entityType: 'skill',
      details: `Created skill: ${skill.name}`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.SKILLS);

    return success(skill, 201);
  } catch (error) {
    return badRequest('Invalid data provided');
  }
}
