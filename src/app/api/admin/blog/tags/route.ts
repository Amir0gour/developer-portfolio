import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { blogTagSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const tags = await prisma.blogTag.findMany({
      orderBy: { name: 'asc' }
    });
    return success(tags);
  } catch (error) {
    return serverError('Failed to fetch tags');
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const data = blogTagSchema.parse(body);

    const tag = await prisma.blogTag.create({
      data
    });

    return success(tag, 201);
  } catch (error) {
    return badRequest('Invalid data provided');
  }
}
