export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import AnimationWrapper from '@/components/public/AnimationWrapper';

export const metadata = {
  title: 'Blog | Portfolio',
  description: 'Read my latest thoughts, tutorials, and insights on software development.',
};

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="pt-24 pb-20 container mx-auto px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <AnimationWrapper>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground">Thoughts, tutorials, and insights on software development.</p>
            <div className="w-20 h-1 bg-primary mt-6 rounded-full" />
          </div>
        </AnimationWrapper>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-xl">No posts published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, idx) => {
              const tags = Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags as string || '[]');

              return (
                <AnimationWrapper key={post.id} delay={0.1 * idx}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="h-full group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                      {post.coverImage && (
                        <div className="relative h-48 w-full overflow-hidden bg-muted">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                          {post.readTime && <span>• {post.readTime} min read</span>}
                        </div>
                        <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground mb-6 line-clamp-3">
                          {post.excerpt}
                        </p>
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {tags.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="bg-secondary/50 text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </AnimationWrapper>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
