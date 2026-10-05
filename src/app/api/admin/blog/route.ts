export const dynamic = 'force-dynamic';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth, unauthorized, badRequest, success, serverError } from '@/lib/auth-helpers';
import { blogPostSchema } from '@/lib/validation';
import { logActivity } from '@/lib/activity';
import { calculateReadTime } from '@/lib/utils';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const posts = await prisma.blogPost.findMany({
      include: { tags: true },
      orderBy: { createdAt: 'desc' }
    });
    return success(posts);
  } catch (error) {
    console.error('Blog GET Error:', error);
    return serverError('Failed to fetch blog posts');
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAuth();
    if (!admin) return unauthorized();

    const body = await request.json();
    const { tagIds = [], ...postData } = blogPostSchema.parse(body);

    const readTime = calculateReadTime(postData.content);
    const isPublishing = postData.status === 'published';

    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        readTime,
        publishedAt: isPublishing ? new Date() : null,
        tags: { connect: tagIds.map((id: string) => ({ id })) }
      },
      include: { tags: true }
    });

    await logActivity({
      action: 'create',
      entityType: 'blog',
      details: `Created blog post: ${post.title}`,
      adminId: admin.id
    });

    revalidateTag(CACHE_TAGS.BLOG);

    return success(post, 201);
  } catch (error) {
    console.error('Blog POST Error:', error);
    return badRequest('Invalid data provided');
  }
}
