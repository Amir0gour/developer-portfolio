export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import AnimationWrapper from '@/components/public/AnimationWrapper';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({ where: { slug: params.slug } });
  if (!project) return { title: 'Not Found' };
  
  return {
    title: `${project.title} | Projects`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!project) {
    notFound();
  }

  const techStack = Array.isArray(project.techStack) ? project.techStack : JSON.parse(project.techStack as string || '[]');

  return (
    <article className="pt-24 pb-20 container mx-auto px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <AnimationWrapper>
          <Link href="/#projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
          
          <div className="space-y-6 mb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">{project.title}</h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              {project.githubUrl && (
                <Button asChild size="lg" className="gap-2">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5" /> View Source
                  </a>
                </Button>
              )}
              {project.liveUrl && (
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-5 h-5" /> Live Demo
                  </a>
                </Button>
              )}
            </div>

            {techStack.length > 0 && (
              <div className="pt-8 border-t border-border/50">
                <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech: string) => (
                    <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm bg-secondary/50">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </AnimationWrapper>

        {project.thumbnailUrl && (
          <AnimationWrapper delay={0.1}>
            <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden mb-12 shadow-2xl border border-border/50">
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </AnimationWrapper>
        )}

        {project.content && (
          <AnimationWrapper delay={0.2}>
            <div 
              className="prose prose-lg dark:prose-invert max-w-none mt-12 prose-headings:font-bold prose-img:rounded-xl prose-img:border prose-img:border-border/50"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </AnimationWrapper>
        )}
      </div>
    </article>
  );
}
