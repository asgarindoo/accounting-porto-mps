import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export const getAllProjects = async () => {
  const projects = await db.select().from(schema.projects).orderBy(asc(schema.projects.sortOrder));
  const tags = await db.select().from(schema.projectTags).orderBy(asc(schema.projectTags.sortOrder));

  return projects.map(p => ({
    ...p,
    tags: tags.filter(t => t.projectId === p.id).map(t => t.name)
  }));
};

export const getProjectById = async (id) => {
  const project = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
  if (project.length === 0) return null;
  
  const tags = await db.select().from(schema.projectTags).where(eq(schema.projectTags.projectId, id)).orderBy(asc(schema.projectTags.sortOrder));
  
  return {
    ...project[0],
    tags: tags.map(t => t.name)
  };
};

export const createProject = async (data) => {
  const { tags, ...projectData } = data;
  
  // Set default sortOrder if not provided (to the end)
  if (projectData.sortOrder === undefined) {
    const existing = await db.select().from(schema.projects).orderBy(asc(schema.projects.sortOrder));
    projectData.sortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0;
  }

  const result = await db.insert(schema.projects).values(projectData).returning();
  const newProject = result[0];

  if (tags && tags.length > 0) {
    await db.insert(schema.projectTags).values(
      tags.map((name, index) => ({
        projectId: newProject.id,
        name,
        sortOrder: index
      }))
    );
  }

  return getProjectById(newProject.id);
};

export const updateProject = async (id, data) => {
  const { tags, ...projectData } = data;

  if (Object.keys(projectData).length > 0) {
    await db.update(schema.projects).set(projectData).where(eq(schema.projects.id, id));
  }

  if (tags !== undefined) {
    // Delete existing tags
    await db.delete(schema.projectTags).where(eq(schema.projectTags.projectId, id));
    
    // Insert new tags
    if (tags.length > 0) {
      await db.insert(schema.projectTags).values(
        tags.map((name, index) => ({
          projectId: id,
          name,
          sortOrder: index
        }))
      );
    }
  }

  return getProjectById(id);
};

export const deleteProject = async (id) => {
  // Cascades will handle tags if configured, but to be safe we can delete them explicitly if not
  await db.delete(schema.projects).where(eq(schema.projects.id, id));
};
