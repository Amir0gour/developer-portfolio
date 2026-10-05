import prisma from '@/lib/prisma';
import AnimationWrapper from './AnimationWrapper';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { GraduationCap, Calendar } from 'lucide-react';

export default async function Education() {
  const education = await prisma.education.findMany({
    orderBy: { startDate: 'desc' },
  });

  if (education.length === 0) return null;

  return (
    <div className="space-y-12">
      <AnimationWrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Education</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
      </AnimationWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((edu, idx) => (
          <AnimationWrapper key={edu.id} delay={0.1 * idx}>
            <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                    <p className="text-primary font-medium mb-3">{edu.institution}</p>
                    {edu.field && <p className="text-muted-foreground mb-3">{edu.field}</p>}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}</span>
                      </div>
                      {edu.grade && (
                        <div className="bg-secondary/50 px-2 py-1 rounded">
                          Grade: <span className="font-medium text-foreground">{edu.grade}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimationWrapper>
        ))}
      </div>
    </div>
  );
}
