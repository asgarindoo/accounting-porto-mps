import * as projectService from '../services/project.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getProjects = catchAsync(async (req, res) => {
  const projects = await projectService.getAllProjects();
  sendSuccess(res, projects, 'Projects retrieved successfully');
});

export const getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  sendSuccess(res, project, 'Project retrieved successfully');
});

export const createProject = catchAsync(async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required' });
  }
  
  const project = await projectService.createProject(req.body);
  sendSuccess(res, project, 'Project created successfully', 201);
});

export const updateProject = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  const updatedProject = await projectService.updateProject(req.params.id, req.body);
  sendSuccess(res, updatedProject, 'Project updated successfully');
});

export const deleteProject = catchAsync(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  await projectService.deleteProject(req.params.id);
  sendSuccess(res, null, 'Project deleted successfully');
});
