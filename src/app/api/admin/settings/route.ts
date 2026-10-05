import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const settings = await prisma.siteSettings.findMany();
    return success(settings);
  } catch (error) {
    return serverError('Failed to fetch settings');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    if (!Array.isArray(body)) return badRequest('Expected array of settings');

    for (const item of body) {
      if (!item.key) continue;
      await prisma.siteSettings.upsert({
        where: { key: item.key },
        create: { key: item.key, value: item.value, group: item.group || 'general' },
        update: { value: item.value, group: item.group }
      });
    }

    await logActivity({
      action: 'update',
      entityType: 'settings',
      details: 'Updated site settings',
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.SETTINGS);

    return success({ message: 'Settings updated' });
  } catch (error) {
    return serverError('Failed to update settings');
  }
}
