import prisma from '@/lib/prisma';
import AnimationWrapper from './AnimationWrapper';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export default async function Experience() {
  const experiences = await prisma.experience.findMany({
    orderBy: [
      { isCurrent: 'desc' },
      { startDate: 'desc' },
    ],
  });

  if (experiences.length === 0) return null;

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <AnimationWrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
      </AnimationWrapper>

      <div className="relative border-l-2 border-border pl-8 space-y-12 before:absolute before:inset-0 before:ml-[-1px] before:-translate-x-1/2 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-transparent">
        {experiences.map((exp, idx) => {
          const techStack = Array.isArray(exp.technologies) ? exp.technologies : JSON.parse(exp.technologies as string || '[]');
          
          return (
            <AnimationWrapper key={exp.id} delay={0.1 * idx} direction="left">
              <div className="relative">
                <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-background border-4 border-primary shadow-sm shadow-primary/50" />
                
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{exp.position}</h3>
                      <p className="text-lg text-primary font-medium">{exp.company}</p>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full self-start">
                      {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : (exp.endDate ? formatDate(exp.endDate) : '')}
                    </div>
                  </div>
                  
                  <div className="prose prose-sm dark:prose-invert max-w-none mb-6 text-muted-foreground">
                    <p>{exp.description}</p>
                  </div>

                  {techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="bg-secondary/50">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </AnimationWrapper>
          );
        })}
      </div>
    </div>
  );
}
