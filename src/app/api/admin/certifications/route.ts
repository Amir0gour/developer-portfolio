import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { certificationSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const items = await prisma.certification.findMany({
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
    const data = certificationSchema.parse(body);
    
    if (data.date) data.date = new Date(data.date);

    const item = await prisma.certification.create({ data });

    await logActivity({
      action: 'create',
      entityType: 'certification',
      details: `Created certification`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.CERTIFICATIONS);
    return success(item, 201);
  } catch (error) {
    return badRequest('Invalid data');
  }
}
