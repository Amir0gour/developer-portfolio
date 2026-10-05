import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { projectSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' }
    });
    return success(projects);
  } catch (error) {
    console.error('Projects GET Error:', error);
    return serverError('Failed to fetch projects');
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const data = projectSchema.parse(body);

    const project = await prisma.project.create({
      data
    });

    await logActivity({
      action: 'create',
      entityType: 'project',
      details: `Created project: ${project.title}`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.PROJECTS);

    return success(project, 201);
  } catch (error) {
    console.error('Projects POST Error:', error);
    return badRequest('Invalid data provided');
  }
}
