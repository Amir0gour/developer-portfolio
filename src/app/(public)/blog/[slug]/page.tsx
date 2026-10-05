export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import AnimationWrapper from '@/components/public/AnimationWrapper';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: 'Not Found' };
  
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!post) {
    notFound();
  }

  const tags = Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags as string || '[]');

  return (
    <article className="pt-24 pb-20 container mx-auto px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <AnimationWrapper>
          <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          
          <div className="space-y-6 mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt || post.createdAt)}
              </div>
              {post.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min read
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </AnimationWrapper>

        {post.coverImage && (
          <AnimationWrapper delay={0.1}>
            <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-12 shadow-xl">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </AnimationWrapper>
        )}

        <AnimationWrapper delay={0.2}>
          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </AnimationWrapper>
      </div>
    </article>
  );
}
