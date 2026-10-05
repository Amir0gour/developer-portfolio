export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, success, serverError } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } }
      ];
    }

    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contactMessage.count({ where })
    ]);

    return success({
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    return serverError('Failed to fetch messages');
  }
}
