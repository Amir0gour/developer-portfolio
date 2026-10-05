export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, success, serverError } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const [
      projects,
      blogTotal,
      blogPublished,
      blogDraft,
      messagesTotal,
      messagesUnread,
      skills
    ] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: 'published' } }),
      prisma.blogPost.count({ where: { status: 'draft' } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'unread' } }),
      prisma.skill.count()
    ]);

    const activities = await prisma.activityLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { admin: { select: { name: true } } }
    });

    return success({
      projects,
      blog: {
        total: blogTotal,
        published: blogPublished,
        draft: blogDraft
      },
      messages: {
        total: messagesTotal,
        unread: messagesUnread
      },
      skills,
      activities
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return serverError('Failed to fetch dashboard data');
  }
}
