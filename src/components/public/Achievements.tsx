import prisma from '@/lib/prisma';
import AnimationWrapper from './AnimationWrapper';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { Trophy, ExternalLink } from 'lucide-react';

export default async function Achievements() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { date: 'desc' },
  });

  if (achievements.length === 0) return null;

  return (
    <div className="space-y-12">
      <AnimationWrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Achievements</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
      </AnimationWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, idx) => (
          <AnimationWrapper key={achievement.id} delay={0.1 * idx}>
            <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-bold text-lg">{achievement.title}</h3>
                      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap bg-secondary/50 px-2 py-1 rounded">
                        {formatDate(achievement.date)}
                      </span>
                    </div>
                    
                    {achievement.description && (
                      <p className="text-muted-foreground text-sm mb-3">
                        {achievement.description}
                      </p>
                    )}

                    {achievement.url && (
                      <a 
                        href={achievement.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        View Details <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
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
