import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { experienceSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const items = await prisma.experience.findMany({
      orderBy: { order: 'asc' }
    });
    return success(items);
  } catch (error) {
    return serverError('Failed to fetch');
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const data = experienceSchema.parse(body);
    
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);

    const item = await prisma.experience.create({ data });

    await logActivity({
      action: 'create',
      entityType: 'experience',
      details: `Created experience`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.EXPERIENCE);
    return success(item, 201);
  } catch (error) {
    return badRequest('Invalid data');
  }
}
