export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { achievementSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const items = await prisma.achievement.findMany({
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
    const data = achievementSchema.parse(body);
    
    if (data.date) data.date = new Date(data.date);

    const item = await prisma.achievement.create({ data });

    await logActivity({
      action: 'create',
      entityType: 'achievement',
      details: `Created achievement`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.ACHIEVEMENTS);
    return success(item, 201);
  } catch (error) {
    return badRequest('Invalid data');
  }
}
