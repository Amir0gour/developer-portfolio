'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Github, Linkedin, Twitter, Mail, Download } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
};

interface HeroContentProps {
  profile: any;
  socialLinks: any[];
  resumeUrl?: string;
}

export default function HeroContent({ profile, socialLinks, resumeUrl }: HeroContentProps) {
  if (!profile) return null;

  const handleContactClick = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex items-center relative overflow-hidden pt-16">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-3xl rounded-full animate-pulse mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 blur-3xl rounded-full animate-pulse delay-700 mix-blend-screen" />
      
      <div className="container mx-auto px-4 z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {profile.avatarUrl && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="flex justify-center"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  fill
                  className="rounded-full ring-2 ring-primary object-cover shadow-2xl shadow-primary/20"
                  priority
                />
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <p className="text-lg md:text-xl text-primary font-medium mb-2">Hello, I'm</p>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {profile.name}
            </h1>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-6">
              {profile.title}
            </p>
            <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
              {profile.shortIntro}
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {resumeUrl && (
              <Button asChild size="lg" className="w-full sm:w-auto gap-2">
                <a href={resumeUrl} download target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              </Button>
            )}
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={handleContactClick}>
              Contact Me
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center justify-center gap-6 pt-8"
          >
            {socialLinks.map((link) => {
              const Icon = iconMap[link.platform.toLowerCase()] || Mail;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary hover:scale-110 transition-all"
                >
                  <Icon className="w-6 h-6" />
                  <span className="sr-only">{link.name}</span>
                </a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
