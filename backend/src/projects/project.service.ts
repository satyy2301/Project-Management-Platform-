import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ProjectUser } from '../entities/project-user.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ProjectUser)
    private projectUserRepository: Repository<ProjectUser>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllProjects(userId: string, clientId: string) {
    const projects = await this.projectRepository.find({
      where: { client_id: clientId },
      relations: ['projectUsers', 'projectUsers.user'],
    });
    return projects;
  }

  async getProjectById(projectId: string) {
    return this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['projectUsers', 'projectUsers.user'],
    });
  }

  async createProject(userId: string, clientId: string, name: string, description?: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || (user.role !== 'admin' && !this.isProjectOwner(userId, clientId))) {
      throw new Error('Only admin or project owner can create projects');
    }

    const project = this.projectRepository.create({
      name,
      description,
      client_id: clientId,
    });

    const savedProject = await this.projectRepository.save(project);

    // Add creator as owner
    await this.projectUserRepository.save({
      project_id: savedProject.id,
      user_id: userId,
      role: 'owner',
    });

    return savedProject;
  }

  async updateProject(projectId: string, userId: string, name: string, description?: string) {
    const projectUser = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: userId },
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || (!projectUser || projectUser.role !== 'owner') && user.role !== 'admin') {
      throw new Error('Only project owner or admin can update project');
    }

    await this.projectRepository.update(projectId, { name, description });
    return this.getProjectById(projectId);
  }

  async deleteProject(projectId: string, userId: string) {
    const projectUser = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: userId },
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || (!projectUser || projectUser.role !== 'owner') && user.role !== 'admin') {
      throw new Error('Only project owner or admin can delete project');
    }

    await this.projectRepository.delete(projectId);
    return { message: 'Project deleted successfully' };
  }

  private async isProjectOwner(userId: string, clientId: string): Promise<boolean> {
    const projectUser = await this.projectUserRepository.findOne({
      where: { user_id: userId },
      relations: ['project'],
    });
    return !!(projectUser && projectUser.project.client_id === clientId);
  }
}
