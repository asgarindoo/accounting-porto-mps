import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import * as data from '../../frontend/src/data.js';

async function seed() {
  console.log('🌱 Starting relational database seed...');
  try {
    // 1. Profile
    const profileResult = await db.insert(schema.profiles).values({
      initials: data.profile.initials,
      name: data.profile.name,
      tagline: data.profile.tagline,
      careerObjective: data.profile.careerObjective,
      portrait: data.profile.portrait,
      cvUrl: data.profile.cvUrl,
    }).returning();
    const profileId = profileResult[0].id;
    console.log('Inserted Profile');

    // Headlines
    if (data.profile.headline) {
      await db.insert(schema.profileHeadlines).values(
        data.profile.headline.map((item, index) => {
          const isHighlight = typeof item === 'object' && !!item.highlight;
          const text = isHighlight ? item.highlight : item;
          return { text, isHighlight, sortOrder: index };
        })
      );
    }
    
    // Bio
    if (data.profile.bio) {
      await db.insert(schema.profileBios).values(
        data.profile.bio.map((text, index) => ({ text, sortOrder: index }))
      );
    }

    // Stats
    if (data.profile.stats) {
      await db.insert(schema.profileStats).values(
        data.profile.stats.map((stat, index) => ({ value: stat.value, label: stat.label, sortOrder: index }))
      );
    }

    // Floating Badges
    if (data.profile.floatingBadges) {
      await db.insert(schema.floatingBadges).values(
        data.profile.floatingBadges.map((badge, index) => ({ icon: badge.icon, text: badge.text, sortOrder: index }))
      );
    }

    // 2. Education
    if (data.education) {
      await db.insert(schema.educations).values(
        data.education.map((edu, index) => ({ ...edu, sortOrder: index }))
      );
      console.log('Inserted Education');
    }

    // 3. Soft Skills
    if (data.softSkills) {
      await db.insert(schema.softSkills).values(
        data.softSkills.map((name, index) => ({ name, sortOrder: index }))
      );
      console.log('Inserted Soft Skills');
    }

    // 4. Experience
    if (data.experience) {
      await db.insert(schema.experiences).values(
        data.experience.map((exp, index) => ({ ...exp, sortOrder: index }))
      );
      console.log('Inserted Experience');
    }

    // 5. Projects
    if (data.projects) {
      for (const [index, proj] of data.projects.entries()) {
        const pRes = await db.insert(schema.projects).values({
          title: proj.title,
          description: proj.description,
          image: proj.image,
          featured: proj.featured,
          sortOrder: index,
        }).returning();
        const pId = pRes[0].id;
        
        if (proj.tags && proj.tags.length > 0) {
          await db.insert(schema.projectTags).values(
            proj.tags.map((tag, tIndex) => ({
              projectId: pId,
              name: tag,
              sortOrder: tIndex,
            }))
          );
        }
      }
      console.log('Inserted Projects');
    }

    // 6. Achievements
    if (data.achievements) {
      await db.insert(schema.achievements).values(
        data.achievements.map((ach, index) => ({ ...ach, sortOrder: index }))
      );
      console.log('Inserted Achievements');
    }

    // 7. Skills
    if (data.skills) {
      await db.insert(schema.skills).values(
        data.skills.map((s, index) => ({ ...s, sortOrder: index }))
      );
      console.log('Inserted Skills');
    }

    // 8. Resume Sections
    if (data.resumeSections) {
      await db.insert(schema.resumeSections).values(
        data.resumeSections.map((r, index) => ({ ...r, sortOrder: index }))
      );
      console.log('Inserted Resume Sections');
    }

    // 9. Contact
    if (data.contact) {
      await db.insert(schema.contacts).values({
        email: data.contact.email,
        whatsapp: data.contact.whatsapp,
        linkedin: data.contact.linkedin,
        location: data.contact.location,
      });
      console.log('Inserted Contact');
    }

    // 10. Nav Links
    if (data.navLinks) {
      await db.insert(schema.navLinks).values(
        data.navLinks.map((nav, index) => ({ ...nav, sortOrder: index }))
      );
      console.log('Inserted Nav Links');
    }

    console.log('✅ Seeding completed successfully.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
  process.exit(0);
}

seed();
