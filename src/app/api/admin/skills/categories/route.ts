import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { skillCategorySchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const categories = await prisma.skillCategory.findMany({
      include: { skills: true },
      orderBy: { order: 'asc' }
    });
    return success(categories);
  } catch (error) {
    return serverError('Failed to fetch categories');
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const data = skillCategorySchema.parse(body);

    const category = await prisma.skillCategory.create({ data });

    await logActivity({
      action: 'create',
      entityType: 'skillCategory',
      details: `Created category: ${category.name}`,
      adminId: admin.id
    });

    return success(category, 201);
  } catch (error) {
    return badRequest('Invalid data provided');
  }
}
