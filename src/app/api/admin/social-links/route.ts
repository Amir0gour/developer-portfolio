import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { socialLinkSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const items = await prisma.socialLink.findMany({
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
    const data = socialLinkSchema.parse(body);

    const item = await prisma.socialLink.create({ data });

    await logActivity({
      action: 'create',
      entityType: 'socialLink',
      details: `Created social link`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.SOCIAL_LINKS);
    return success(item, 201);
  } catch (error) {
    return badRequest('Invalid data');
  }
}
