import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const profileSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  bio: z.string().min(10),
  shortIntro: z.string().min(10),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  availability: z.string(),
});

export const projectSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  content: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal('')),
  techStack: z.array(z.string()),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  features: z.array(z.string()),
  category: z.string(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const skillCategorySchema = z.object({
  name: z.string().min(2),
  icon: z.string().optional().or(z.literal('')),
  order: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().min(2),
  icon: z.string().optional().or(z.literal('')),
  level: z.string(),
  order: z.number().int().default(0),
  categoryId: z.string(),
});

export const experienceSchema = z.object({
  company: z.string().min(2),
  position: z.string().min(2),
  location: z.string().optional().or(z.literal('')),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().min(10),
  technologies: z.array(z.string()),
  order: z.number().int().default(0),
});

export const educationSchema = z.object({
  institution: z.string().min(2),
  degree: z.string().min(2),
  field: z.string().optional().or(z.literal('')),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
  grade: z.string().optional().or(z.literal('')),
  order: z.number().int().default(0),
});

export const certificationSchema = z.object({
  name: z.string().min(2),
  organization: z.string().min(2),
  issueDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional().nullable(),
  credentialId: z.string().optional().or(z.literal('')),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  order: z.number().int().default(0),
});

export const achievementSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  date: z.string().datetime(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  link: z.string().url().optional().or(z.literal('')),
  order: z.number().int().default(0),
});

export const blogPostSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published']),
  publishedAt: z.string().datetime().optional().nullable(),
  seoTitle: z.string().optional().or(z.literal('')),
  seoDescription: z.string().optional().or(z.literal('')),
  readTime: z.number().int().optional(),
  tags: z.array(z.string()),
});

export const blogTagSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(2),
  url: z.string().url(),
  icon: z.string().optional().or(z.literal('')),
  enabled: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const seoSettingSchema = z.object({
  siteTitle: z.string().min(2),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  ogImage: z.string().url().optional().or(z.literal('')),
  twitterCard: z.string().optional(),
  twitterHandle: z.string().optional(),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const messageUpdateSchema = z.object({
  status: z.enum(['unread', 'read', 'archived']).optional(),
  isImportant: z.boolean().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type SkillCategoryFormData = z.infer<typeof skillCategorySchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
export type AchievementFormData = z.infer<typeof achievementSchema>;
export type BlogPostFormData = z.infer<typeof blogPostSchema>;
export type BlogTagFormData = z.infer<typeof blogTagSchema>;
export type SocialLinkFormData = z.infer<typeof socialLinkSchema>;
export type SeoSettingFormData = z.infer<typeof seoSettingSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
