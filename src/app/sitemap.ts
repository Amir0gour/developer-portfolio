export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    select: { slug: true, updatedAt: true }
  });
  
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true }
  });
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    ...posts.map(p => ({ url: `${baseUrl}/blog/${p.slug}`, lastModified: p.updatedAt })),
    ...projects.map(p => ({ url: `${baseUrl}/projects/${p.slug}`, lastModified: p.updatedAt }))
  ];
}
