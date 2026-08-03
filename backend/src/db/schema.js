import { pgTable, serial, varchar, text, boolean, integer, uuid, timestamp } from 'drizzle-orm/pg-core';

// ─── Better Auth Tables ──────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('ADMIN'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ─── Portfolio CMS Tables ─────────────────────────────────────────────────────

export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  initials: varchar('initials', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  tagline: varchar('tagline', { length: 255 }),
  careerObjective: text('career_objective'),
  portrait: varchar('portrait', { length: 255 }),
  cvUrl: varchar('cv_url', { length: 255 }),
});

export const profileHeadlines = pgTable('profile_headlines', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  isHighlight: boolean('is_highlight').default(false).notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const profileBios = pgTable('profile_bios', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const profileStats = pgTable('profile_stats', {
  id: serial('id').primaryKey(),
  value: varchar('value', { length: 50 }).notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const floatingBadges = pgTable('floating_badges', {
  id: serial('id').primaryKey(),
  icon: varchar('icon', { length: 100 }).notNull(),
  text: varchar('text', { length: 255 }).notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const educations = pgTable('educations', {
  id: serial('id').primaryKey(),
  degree: varchar('degree', { length: 255 }).notNull(),
  institution: varchar('institution', { length: 255 }).notNull(),
  period: varchar('period', { length: 100 }).notNull(),
  detail: text('detail'),
  sortOrder: integer('sort_order').notNull(),
});

export const softSkills = pgTable('soft_skills', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const experiences = pgTable('experiences', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 100 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  period: varchar('period', { length: 100 }).notNull(),
  description: text('description').notNull(),
  align: varchar('align', { length: 20 }).notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  content: text('content'),
  link: varchar('link', { length: 255 }),
  image: varchar('image', { length: 255 }),
  featured: boolean('featured').default(false).notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const projectTags = pgTable('project_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const achievements = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  icon: varchar('icon', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 255 }).notNull(),
  description: text('description').notNull(),
  content: text('content'),
  link: varchar('link', { length: 255 }),
  image: varchar('image', { length: 255 }),
  sortOrder: integer('sort_order').notNull(),
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  icon: varchar('icon', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  subtitle: varchar('subtitle', { length: 255 }).notNull(),
  featured: boolean('featured').default(false).notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const resumeSections = pgTable('resume_sections', {
  id: serial('id').primaryKey(),
  label: varchar('label', { length: 255 }).notNull(),
  description: text('description').notNull(),
  file: varchar('file', { length: 255 }).notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  icon: varchar('icon', { length: 100 }).notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  link: varchar('link', { length: 255 }),
  sortOrder: integer('sort_order').notNull(),
});

export const navLinks = pgTable('nav_links', {
  id: serial('id').primaryKey(),
  label: varchar('label', { length: 100 }).notNull(),
  href: varchar('href', { length: 100 }).notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const siteSettings = pgTable('site_settings', {
  key: varchar('key', { length: 50 }).primaryKey(),
  value: text('value').notNull(),
});

export const analyticsEvents = pgTable('analytics_events', {
  id: serial('id').primaryKey(),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  visitorId: varchar('visitor_id', { length: 255 }),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
