import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, success, serverError } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return success(media);
  } catch (error) {
    return serverError('Failed to fetch media');
  }
}
