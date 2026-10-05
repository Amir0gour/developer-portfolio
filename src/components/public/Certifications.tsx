import prisma from '@/lib/prisma';
import AnimationWrapper from './AnimationWrapper';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default async function Certifications() {
  const certifications = await prisma.certification.findMany({
    orderBy: { issueDate: 'desc' },
  });

  if (certifications.length === 0) return null;

  return (
    <div className="space-y-12">
      <AnimationWrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
      </AnimationWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert, idx) => (
          <AnimationWrapper key={cert.id} delay={0.1 * idx}>
            <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold leading-tight mb-1">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.organization}</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                  <span className="text-sm text-muted-foreground font-medium">
                    {formatDate(cert.issueDate)}
                  </span>
                  
                  {cert.credentialUrl && (
                    <Button variant="ghost" size="sm" className="gap-2" asChild>
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                        Verify <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimationWrapper>
        ))}
      </div>
    </div>
  );
}
