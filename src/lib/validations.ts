import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(200).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  image: z.string().url().nullable().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const galleryImageSchema = z.object({
  title: z.string().min(1).max(200),
  src: z.string().min(1),
  alt: z.string().max(500).nullable().optional(),
  span: z.string().max(50).nullable().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const googleReviewSchema = z.object({
  name: z.string().min(1).max(200),
  text: z.string().min(1).max(2000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  date: z.string().max(50).nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const blogPostSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(500).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().max(1000).nullable().optional(),
  content: z.string().max(50000).nullable().optional(),
  coverImage: z.string().url().nullable().optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
});

export const aboutSectionSchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1).max(10000),
  image: z.string().url().nullable().optional().or(z.literal("")),
  tags: z.string().max(500).nullable().optional(),
});

export const siteSettingSchema = z.object({
  key: z.string().min(1).max(200),
  value: z.string().max(5000).nullable().optional(),
});

export const contactReadSchema = z.object({
  isRead: z.boolean(),
});
