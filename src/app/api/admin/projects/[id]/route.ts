import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, notFound, badRequest, success, serverError } from '@/lib/auth-helpers';
import { projectSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const project = await prisma.project.findUnique({
      where: { id: params.id }
    });

    if (!project) return notFound('Project not found');

    return success(project);
  } catch (error) {
    console.error('Project GET Error:', error);
    return serverError('Failed to fetch project');
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const data = projectSchema.parse(body);

    const project = await prisma.project.update({
      where: { id: params.id },
      data
    });

    await logActivity({
      action: 'update',
      entityType: 'project',
      details: `Updated project: ${project.title}`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.PROJECTS);

    return success(project);
  } catch (error) {
    console.error('Project PUT Error:', error);
    return badRequest('Invalid data provided');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const project = await prisma.project.delete({
      where: { id: params.id }
    });

    await logActivity({
      action: 'delete',
      entityType: 'project',
      details: `Deleted project: ${project.title}`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.PROJECTS);

    return success({ message: 'Project deleted' });
  } catch (error) {
    console.error('Project DELETE Error:', error);
    return serverError('Failed to delete project');
  }
}
