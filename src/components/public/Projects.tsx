import prisma from '@/lib/prisma';
import AnimationWrapper from './AnimationWrapper';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';
import { truncate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default async function Projects() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: [
      { isFeatured: 'desc' },
      { order: 'asc' },
    ],
  });

  if (projects.length === 0) return null;

  return (
    <div className="space-y-12">
      <AnimationWrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
      </AnimationWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, idx) => {
          const techStack = Array.isArray(project.techStack) ? project.techStack : JSON.parse(project.techStack as string || '[]');

          return (
            <AnimationWrapper key={project.id} delay={0.1 * idx}>
              <Link href={`/projects/${project.slug}`}>
                <Card className={`group h-full overflow-hidden bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 ${project.isFeatured ? 'ring-1 ring-primary/50' : 'border-border/50'}`}>
                  <div className="relative w-full h-64 overflow-hidden bg-muted">
                    {project.thumbnailUrl ? (
                      <Image
                        src={project.thumbnailUrl}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center">
                        <span className="text-muted-foreground font-medium">No Image</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-muted-foreground mb-6 h-12 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {techStack.slice(0, 4).map((tech: string) => (
                        <Badge key={tech} variant="outline" className="bg-background/50">
                          {tech}
                        </Badge>
                      ))}
                      {techStack.length > 4 && (
                        <Badge variant="outline" className="bg-background/50">
                          +{techStack.length - 4} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/50">
                      {project.githubUrl && (
                        <Button variant="ghost" size="sm" className="gap-2 z-10" asChild onClick={(e) => e.stopPropagation()}>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" /> Code
                          </a>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button variant="ghost" size="sm" className="gap-2 z-10" asChild onClick={(e) => e.stopPropagation()}>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" /> Live
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimationWrapper>
          );
        })}
      </div>
    </div>
  );
}
