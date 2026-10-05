export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, notFound, badRequest, success, serverError } from '@/lib/auth-helpers';
import { messageUpdateSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    let message = await prisma.contactMessage.findUnique({ where: { id: params.id } });
    if (!message) return notFound('Message not found');

    if (message.status === 'unread') {
      message = await prisma.contactMessage.update({
        where: { id: params.id },
        data: { status: 'read' }
      });
    }

    return success(message);
  } catch (error) {
    return serverError('Failed to fetch message');
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const data = messageUpdateSchema.parse(body);

    const message = await prisma.contactMessage.update({
      where: { id: params.id },
      data
    });

    return success(message);
  } catch (error) {
    return badRequest('Invalid data');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    await prisma.contactMessage.delete({ where: { id: params.id } });

    await logActivity({
      action: 'delete',
      entityType: 'message',
      details: 'Deleted contact message',
      adminId: admin.id
    });

    return success({ message: 'Deleted' });
  } catch (error) {
    return serverError('Failed to delete');
  }
}
