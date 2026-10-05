import prisma from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import HeroContent from './HeroContent';

export default async function HeroSection() {
  const profile = await prisma.profile.findFirst();
  const socialLinks = await prisma.socialLink.findMany({
    where: { enabled: true },
    orderBy: { order: 'asc' },
  });
  const resume = await prisma.resume.findFirst({
    where: { isActive: true },
  });

  return (
    <HeroContent 
      profile={profile} 
      socialLinks={socialLinks} 
      resumeUrl={resume?.url} 
    />
  );
}
