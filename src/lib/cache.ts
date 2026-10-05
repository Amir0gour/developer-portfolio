import { revalidatePath, revalidateTag } from 'next/cache';

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
