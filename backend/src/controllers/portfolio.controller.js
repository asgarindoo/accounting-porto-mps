import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { asc } from 'drizzle-orm';
import { catchAsync } from '../utils/catchAsync.js';

export const getPortfolioData = catchAsync(async (req, res) => {
  // Fetch all related entities in parallel
  const [
    // profiles removed
    profileHeadlines,
    profileBios,
    profileStats,
    floatingBadges,
    educations,
    softSkills,
    experiences,
    projects,
    projectTags,
    achievements,
    skills,
    resumeSections,
    contacts,
    navLinks,
    siteSettingsRaw,
  ] = await Promise.all([
    // profiles query removed
    db.select().from(schema.profileHeadlines).orderBy(asc(schema.profileHeadlines.sortOrder)),
    db.select().from(schema.profileBios).orderBy(asc(schema.profileBios.sortOrder)),
    db.select().from(schema.profileStats).orderBy(asc(schema.profileStats.sortOrder)),
    db.select().from(schema.floatingBadges).orderBy(asc(schema.floatingBadges.sortOrder)),
    db.select().from(schema.educations).orderBy(asc(schema.educations.sortOrder)),
    db.select().from(schema.softSkills).orderBy(asc(schema.softSkills.sortOrder)),
    db.select().from(schema.experiences).orderBy(asc(schema.experiences.sortOrder)),
    db.select().from(schema.projects).orderBy(asc(schema.projects.sortOrder)),
    db.select().from(schema.projectTags).orderBy(asc(schema.projectTags.sortOrder)),
    db.select().from(schema.achievements).orderBy(asc(schema.achievements.sortOrder)),
    db.select().from(schema.skills).orderBy(asc(schema.skills.sortOrder)),
    db.select().from(schema.resumeSections).orderBy(asc(schema.resumeSections.sortOrder)),
    db.select().from(schema.contacts).orderBy(asc(schema.contacts.sortOrder)),
    db.select().from(schema.navLinks).orderBy(asc(schema.navLinks.sortOrder)),
    db.select().from(schema.siteSettings),
  ]);

  const siteSettings = siteSettingsRaw.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  // Reconstruct the profile object
  const profile = {
    name: siteSettings.author_name || '',
    portrait: siteSettings.portrait || '',
    headline: profileHeadlines.map(h => h.isHighlight ? { highlight: h.text } : h.text),
    bio: profileBios.map(b => b.text),
    stats: profileStats.map(s => ({ value: s.value, label: s.label })),
    floatingBadges: floatingBadges.map(b => ({ icon: b.icon, text: b.text })),
  };

  // Reconstruct projects with tags
  const reconstructedProjects = projects.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    content: p.content,
    link: p.link,
    image: p.image,
    featured: p.featured,
    tags: projectTags.filter(pt => pt.projectId === p.id).map(pt => pt.name),
  }));

  const contact = contacts[0] || {};
  // siteSettings previously defined above

  // Reconstruct the full expected data shape
  const portfolioData = {
    profile,
    education: educations.map(e => ({ degree: e.degree, institution: e.institution, period: e.period, detail: e.detail })),
    softSkills: softSkills.map(s => s.name),
    experience: experiences.map(e => ({ type: e.type, role: e.role, company: e.company, period: e.period, description: e.description, align: e.align })),
    projects: reconstructedProjects,
    achievements: achievements.map(a => ({ id: a.id, icon: a.icon, title: a.title, subtitle: a.subtitle, description: a.description, content: a.content, link: a.link, image: a.image })),
    skills: skills.map(s => ({ icon: s.icon, title: s.title, subtitle: s.subtitle, featured: s.featured })),
    resumeSections: resumeSections.map(r => ({ label: r.label, description: r.description, file: r.file })),
    contactLinks: contacts.map(c => ({
      icon: c.icon,
      label: c.label,
      value: c.value,
      href: c.link || null
    })),
    navLinks: navLinks.map(n => ({ label: n.label, href: n.href })),
    siteSettings,
  };

  res.status(200).json(portfolioData);
});
