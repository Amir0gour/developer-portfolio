import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, success, serverError } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const entityType = searchParams.get('entityType');

    const where: any = {};
    if (entityType) where.entityType = entityType;

    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        include: { admin: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.activityLog.count({ where })
    ]);

    return success({
      activities,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    return serverError('Failed to fetch activity logs');
  }
}
