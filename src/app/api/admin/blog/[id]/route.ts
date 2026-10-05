import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, notFound, badRequest, success, serverError } from '@/lib/auth-helpers';
import { blogPostSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { calculateReadTime } from '@/lib/utils';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: { tags: true }
    });

    if (!post) return notFound('Blog post not found');

    return success(post);
  } catch (error) {
    return serverError('Failed to fetch post');
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const { tagIds = [], ...postData } = blogPostSchema.parse(body);

    const readTime = calculateReadTime(postData.content);

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        ...postData,
        readTime,
        tags: { set: [], connect: tagIds.map((id: string) => ({ id })) }
      },
      include: { tags: true }
    });

    await logActivity({
      action: 'update',
      entityType: 'blog',
      details: `Updated blog post: ${post.title}`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.BLOG);

    return success(post);
  } catch (error) {
    return badRequest('Invalid data provided');
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const post = await prisma.blogPost.delete({
      where: { id: params.id }
    });

    await logActivity({
      action: 'delete',
      entityType: 'blog',
      details: `Deleted blog post: ${post.title}`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.BLOG);

    return success({ message: 'Post deleted' });
  } catch (error) {
    return serverError('Failed to delete post');
  }
}
