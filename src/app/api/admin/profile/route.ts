export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { profileSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const profile = await prisma.profile.findFirst();
    return success(profile);
  } catch (error) {
    console.error('Profile GET Error:', error);
    return serverError('Failed to fetch profile');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const data = profileSchema.parse(body);

    const existing = await prisma.profile.findFirst();

    const profile = await prisma.profile.upsert({
      where: { id: existing?.id || 'new' },
      create: data,
      update: data
    });

    await logActivity({
      action: 'update',
      entityType: 'profile',
      details: 'Updated profile information',
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.PROFILE);

    return success(profile);
  } catch (error) {
    console.error('Profile PUT Error:', error);
    return badRequest('Invalid data provided');
  }
}
