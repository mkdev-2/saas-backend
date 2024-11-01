import {PrismaClient} from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});

export const createProject = async (req, res, next) => {
  try {
    const { name, description } = projectSchema.parse(req.body);
    
    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: req.user.id
      }
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id }
    });
    
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { name, description } = projectSchema.parse(req.body);

    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updatedProject = await prisma.project.update({
      where: { id: req.params.id },
      data: { name, description }
    });

    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await prisma.project.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};