import prisma from '@/lib/prisma';
import AnimationWrapper from './AnimationWrapper';
import { Card, CardContent } from '@/components/ui/Card';

export default async function About() {
  const profile = await prisma.profile.findFirst();

  if (!profile || !profile.bio) {
    return null;
  }

  return (
    <div className="space-y-8">
      <AnimationWrapper>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
      </AnimationWrapper>

      <AnimationWrapper delay={0.2}>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8 md:p-12">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: profile.bio.replace(/\n/g, '<br/>') }}
            />
          </CardContent>
        </Card>
      </AnimationWrapper>
    </div>
  );
}
