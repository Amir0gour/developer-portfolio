import prisma from '@/lib/prisma';
import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
};

export default async function Footer() {
  const profile = await prisma.profile.findFirst();
  const socialLinks = await prisma.socialLink.findMany({
    where: { enabled: true },
    orderBy: { order: 'asc' },
  });

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground font-medium">
              © {year} {profile?.name || 'Developer'}. All rights reserved.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.platform.toLowerCase()] || Mail;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="sr-only">{link.name}</span>
                </a>
              );
            })}
          </div>

          <div className="text-center md:text-right">
            <a 
              href="#top" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Back to top <ArrowUp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
