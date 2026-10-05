import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { seoSettingSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const seo = await prisma.seoSetting.findFirst();
    return success(seo);
  } catch (error) {
    return serverError('Failed to fetch SEO settings');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const data = seoSettingSchema.parse(body);

    const existing = await prisma.seoSetting.findFirst();

    const seo = await prisma.seoSetting.upsert({
      where: { id: existing?.id || 'new' },
      create: data,
      update: data
    });

    await logActivity({
      action: 'update',
      entityType: 'seo',
      details: 'Updated SEO settings',
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.SEO);

    return success(seo);
  } catch (error) {
    return badRequest('Invalid data');
  }
}
