import prisma from '@/lib/prisma';
import AnimationWrapper from './AnimationWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default async function Skills() {
  const categories = await prisma.skillCategory.findMany({
    include: {
      skills: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  });

  if (categories.length === 0) return null;

  return (
    <div className="space-y-12">
      <AnimationWrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Technologies</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
      </AnimationWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, idx) => (
          <AnimationWrapper key={category.id} delay={0.1 * idx}>
            <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map(skill => (
                    <div key={skill.id} className="flex flex-col items-start gap-1">
                      <Badge variant="secondary" className="px-3 py-1">
                        {skill.name}
                      </Badge>
                      {skill.level && (
                        <span className="text-[10px] text-muted-foreground ml-1 uppercase font-semibold">
                          {skill.level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimationWrapper>
        ))}
      </div>
    </div>
  );
}
