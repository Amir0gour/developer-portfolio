const fs = require('fs');
const path = require('path');
const root = process.cwd();

// Fix 1: prisma.ts - add default export
const prismaPath = path.join(root, 'src/lib/prisma.ts');
let prismaContent = fs.readFileSync(prismaPath, 'utf8');
if (!prismaContent.includes('export default')) {
  prismaContent += '\nexport default prisma;\n';
  fs.writeFileSync(prismaPath, prismaContent);
  console.log('Fixed: prisma.ts - added default export');
}

// Fix 2: seed.ts - siteSettings -> siteSetting
const seedPath = path.join(root, 'prisma/seed.ts');
let seedContent = fs.readFileSync(seedPath, 'utf8');
if (seedContent.includes('prisma.siteSettings')) {
  seedContent = seedContent.replace(/prisma\.siteSettings/g, 'prisma.siteSetting');
  fs.writeFileSync(seedPath, seedContent);
  console.log('Fixed: seed.ts - siteSettings -> siteSetting');
}

// Fix 3: cache.ts - add CACHE_TAGS export
const cachePath = path.join(root, 'src/lib/cache.ts');
let cacheContent = fs.readFileSync(cachePath, 'utf8');
if (!cacheContent.includes('CACHE_TAGS')) {
  cacheContent = `import { revalidatePath, revalidateTag } from 'next/cache';

export const CACHE_TAGS = {
  projects: 'projects',
  blog: 'blog',
  skills: 'skills',
  experience: 'experience',
  education: 'education',
  profile: 'profile',
  settings: 'settings',
  seo: 'seo',
  socialLinks: 'social-links',
  certifications: 'certifications',
  achievements: 'achievements',
  messages: 'messages',
  media: 'media',
} as const;

export function revalidatePublicPages() {
  revalidatePath('/');
  revalidatePath('/blog');
}

export function revalidateProjects() {
  revalidatePath('/');
  revalidateTag(CACHE_TAGS.projects);
}

export function revalidateBlog() {
  revalidatePath('/blog');
  revalidateTag(CACHE_TAGS.blog);
}

export function revalidateBlogPost(slug) {
  revalidatePath('/blog/' + slug);
  revalidateBlog();
}

export function revalidateProfile() {
  revalidatePath('/');
  revalidateTag(CACHE_TAGS.profile);
}

export function revalidateSkills() {
  revalidatePath('/');
  revalidateTag(CACHE_TAGS.skills);
}

export function revalidateExperience() {
  revalidatePath('/');
  revalidateTag(CACHE_TAGS.experience);
}

export function revalidateSettings() {
  revalidatePath('/');
  revalidateTag(CACHE_TAGS.settings);
}

export function revalidateSeo() {
  revalidatePath('/');
  revalidateTag(CACHE_TAGS.seo);
}

export function revalidateAll() {
  revalidatePath('/', 'layout');
}
`;
  fs.writeFileSync(cachePath, cacheContent);
  console.log('Fixed: cache.ts - added CACHE_TAGS');
}

console.log('All fixes applied!');
