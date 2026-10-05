import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

                                
  const email = process.env.ADMIN_EMAIL || 'admin@portfolio.dev';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.adminUser.findFirst();
  if (existingAdmin) {
    console.log('Admin user already exists. Skipping seed.');
    return;
  }

  const admin = await prisma.adminUser.create({
    data: {
      email,
      passwordHash: hashedPassword,
      name: 'Admin User',
    }
  });
  console.log(`Created admin user: ${email}`);

  await prisma.profile.create({
    data: {
      name: 'Amir',
      title: 'Full Stack Developer',
      bio: 'I am a passionate Full Stack Developer with experience in building web applications. I love learning new technologies and solving complex problems. My goal is to build scalable and efficient solutions that provide great user experiences.',
      shortIntro: 'Passionate full-stack developer building modern web applications.',
      location: 'Pakistan',
      email: 'amir@example.com',
      availability: 'Available for hire',
    }
  });
  console.log('Created profile');

  await prisma.project.createMany({
    data: [
      {
        title: 'E-commerce Platform',
        slug: 'ecommerce-platform',
        description: 'A full-featured e-commerce platform built with Next.js and Prisma.',
        techStack: ['Next.js', 'React', 'Prisma', 'Tailwind CSS'],
        featured: true,
        published: true,
        order: 1,
      },
      {
        title: 'Task Management App',
        slug: 'task-management-app',
        description: 'A collaborative task management tool for teams.',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
        featured: true,
        published: true,
        order: 2,
      },
      {
        title: 'Developer Blog',
        slug: 'developer-blog',
        description: 'A personal blog for sharing development tips and tutorials.',
        techStack: ['Next.js', 'MDX', 'Tailwind CSS'],
        featured: false,
        published: true,
        order: 3,
      },
      {
        title: 'REST API Service',
        slug: 'rest-api-service',
        description: 'A robust REST API service with authentication and rate limiting.',
        techStack: ['Node.js', 'Express', 'PostgreSQL', 'Redis'],
        featured: false,
        published: true,
        order: 4,
      }
    ]
  });
  console.log('Created projects');

  const categories = await Promise.all([
    prisma.skillCategory.create({ data: { name: 'Languages', order: 1 } }),
    prisma.skillCategory.create({ data: { name: 'Frontend', order: 2 } }),
    prisma.skillCategory.create({ data: { name: 'Backend', order: 3 } }),
    prisma.skillCategory.create({ data: { name: 'Tools & DevOps', order: 4 } })
  ]);
  
  await prisma.skill.createMany({
    data: [
      { name: 'JavaScript', proficiency: 90, categoryId: categories[0].id, order: 1 },
      { name: 'TypeScript', proficiency: 85, categoryId: categories[0].id, order: 2 },
      { name: 'Python', proficiency: 80, categoryId: categories[0].id, order: 3 },
      { name: 'React', proficiency: 90, categoryId: categories[1].id, order: 1 },
      { name: 'Next.js', proficiency: 85, categoryId: categories[1].id, order: 2 },
      { name: 'Tailwind CSS', proficiency: 95, categoryId: categories[1].id, order: 3 },
      { name: 'Node.js', proficiency: 85, categoryId: categories[2].id, order: 1 },
      { name: 'PostgreSQL', proficiency: 80, categoryId: categories[2].id, order: 2 },
      { name: 'Prisma', proficiency: 85, categoryId: categories[2].id, order: 3 },
      { name: 'Git', proficiency: 90, categoryId: categories[3].id, order: 1 },
      { name: 'Docker', proficiency: 75, categoryId: categories[3].id, order: 2 },
      { name: 'AWS', proficiency: 70, categoryId: categories[3].id, order: 3 },
    ]
  });
  console.log('Created skills and categories');

  await prisma.experience.createMany({
    data: [
      {
        title: 'Software Engineer',
        company: 'TechCorp',
        location: 'Remote',
        startDate: new Date('2023-01-01'),
        current: true,
        description: 'Developed modern web applications using React and Node.js. Led a team of 3 developers.',
        order: 1
      },
      {
        title: 'Junior Dev',
        company: 'StartupXYZ',
        location: 'On-site',
        startDate: new Date('2021-06-01'),
        endDate: new Date('2022-12-31'),
        current: false,
        description: 'Assisted in building responsive user interfaces and RESTful APIs.',
        order: 2
      }
    ]
  });
  console.log('Created experience');

  await prisma.education.createMany({
    data: [
      {
        degree: 'BS Computer Science',
        institution: 'University of Technology',
        location: 'City, Country',
        startDate: new Date('2017-09-01'),
        endDate: new Date('2021-06-01'),
        current: false,
        description: 'Graduated with honors. Specialized in software engineering.',
        order: 1
      },
      {
        degree: 'Online Certifications',
        institution: 'Coursera / Udemy',
        location: 'Online',
        startDate: new Date('2021-01-01'),
        current: true,
        description: 'Continuous learning through various online courses.',
        order: 2
      }
    ]
  });
  console.log('Created education');

  await prisma.certification.createMany({
    data: [
      {
        title: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: new Date('2023-05-01'),
        url: 'https://aws.amazon.com',
        order: 1
      },
      {
        title: 'React Professional Certification',
        issuer: 'Meta',
        date: new Date('2022-08-01'),
        url: 'https://coursera.org',
        order: 2
      }
    ]
  });
  console.log('Created certifications');

  await prisma.achievement.createMany({
    data: [
      {
        title: 'Hackathon Winner 2022',
        description: 'Won 1st place in the regional web development hackathon.',
        date: new Date('2022-11-01'),
        order: 1
      },
      {
        title: 'Open Source Contributor',
        description: 'Contributed multiple features to popular open source frameworks.',
        date: new Date('2023-03-01'),
        order: 2
      }
    ]
  });
  console.log('Created achievements');

  const tags = await Promise.all([
    prisma.blogTag.create({ data: { name: 'react', slug: 'react' } }),
    prisma.blogTag.create({ data: { name: 'nextjs', slug: 'nextjs' } }),
    prisma.blogTag.create({ data: { name: 'typescript', slug: 'typescript' } }),
    prisma.blogTag.create({ data: { name: 'webdev', slug: 'webdev' } })
  ]);
  
  await prisma.blogPost.create({
    data: {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-with-nextjs-14',
      excerpt: 'Learn the basics of App Router in Next.js 14.',
      content: 'Next.js 14 introduces many exciting features for building modern web applications...',
      status: 'published',
      publishedAt: new Date(),
      readTime: 5,
      tags: { connect: [{ id: tags[1].id }, { id: tags[0].id }] }
    }
  });
  await prisma.blogPost.create({
    data: {
      title: 'Advanced TypeScript Patterns',
      slug: 'advanced-typescript-patterns',
      excerpt: 'Deep dive into TypeScript utility types.',
      content: 'TypeScript is incredibly powerful when you understand its advanced type system...',
      status: 'published',
      publishedAt: new Date(),
      readTime: 8,
      tags: { connect: [{ id: tags[2].id }, { id: tags[3].id }] }
    }
  });
  await prisma.blogPost.create({
    data: {
      title: 'State Management in React',
      slug: 'state-management-in-react',
      excerpt: 'Comparing Redux, Zustand, and Context API.',
      content: 'Managing state is one of the most debated topics in the React ecosystem...',
      status: 'draft',
      readTime: 6,
      tags: { connect: [{ id: tags[0].id }] }
    }
  });
  console.log('Created blog posts and tags');

  await prisma.socialLink.createMany({
    data: [
      { platform: 'github', url: 'https://github.com/amir', order: 1, isActive: true },
      { platform: 'linkedin', url: 'https://linkedin.com/in/amir', order: 2, isActive: true },
      { platform: 'twitter', url: 'https://twitter.com/amir', order: 3, isActive: true },
      { platform: 'email', url: 'mailto:amir@example.com', order: 4, isActive: true },
      { platform: 'website', url: 'https://amir.dev', order: 5, isActive: true }
    ]
  });
  console.log('Created social links');

  await prisma.siteSetting.createMany({
    data: [
      { key: 'footer_text', value: '© 2024 Amir. All rights reserved.', group: 'general' },
      { key: 'availability', value: 'Available for freelance work', group: 'general' }
    ]
  });
  console.log('Created site settings');

  await prisma.seoSetting.create({
    data: {
      titleTemplate: '%s | Amir - Full Stack Developer',
      defaultTitle: 'Amir - Full Stack Developer',
      defaultDescription: 'Portfolio and blog of Amir, a passionate Full Stack Developer.',
      keywords: 'developer, full stack, react, nextjs, portfolio',
      siteName: 'Amir.dev'
    }
  });
  console.log('Created SEO settings');

  await prisma.contactMessage.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Freelance Inquiry',
      message: 'Hi Amir, I have a project I would like to discuss with you.',
      status: 'unread'
    }
  });
  console.log('Created sample contact message');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
