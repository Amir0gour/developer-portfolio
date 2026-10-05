export const dynamic = 'force-dynamic';

import HeroSection from '@/components/public/Hero';
import About from '@/components/public/About';
import Skills from '@/components/public/Skills';
import Projects from '@/components/public/Projects';
import Experience from '@/components/public/Experience';
import Education from '@/components/public/Education';
import Certifications from '@/components/public/Certifications';
import Achievements from '@/components/public/Achievements';
import Contact from '@/components/public/Contact';
import prisma from '@/lib/prisma';

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div id="top" className="flex flex-col w-full">
      <HeroSection />
      
      <section id="about" className="py-20 container mx-auto px-4">
        <About />
      </section>

      <section id="skills" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <Skills />
        </div>
      </section>

      <section id="projects" className="py-20 container mx-auto px-4">
        <Projects />
      </section>

      <section id="experience" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <Experience />
        </div>
      </section>

      <section id="education" className="py-20 container mx-auto px-4">
        <Education />
      </section>

      <section id="certifications" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <Certifications />
        </div>
      </section>

      <section id="achievements" className="py-20 container mx-auto px-4">
        <Achievements />
      </section>

      <section id="contact" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <Contact profile={profile} />
        </div>
      </section>
    </div>
  );
}
