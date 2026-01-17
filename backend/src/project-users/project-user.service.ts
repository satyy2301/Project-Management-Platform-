import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUser } from '../entities/project-user.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private projectUserRepository: Repository<ProjectUser>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async assignUserToProject(
    projectId: string,
    userId: string,
    currentUserId: string,
    role: string,
  ) {
    // Verify current user is project owner or admin
    const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
    if (!currentUser) {
      throw new Error('User not found');
    }

    const currentUserProject = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: currentUserId },
    });

    if (!currentUserProject || currentUserProject.role !== 'owner') {
      if (currentUser.role !== 'admin') {
        throw new Error('Only project owner or admin can assign users');
      }
    }

    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Verify project exists
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new Error('Project not found');
    }

    // Check if already assigned
    const existingAssignment = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: userId },
    });

    if (existingAssignment) {
      throw new Error('User is already assigned to this project');
    }

    const projectUser = this.projectUserRepository.create({
      project_id: projectId,
      user_id: userId,
      role,
    });

    return this.projectUserRepository.save(projectUser);
  }

  async updateUserRole(
    projectId: string,
    userId: string,
    currentUserId: string,
    newRole: string,
  ) {
    // Verify current user is project owner or admin
    const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
    if (!currentUser) {
      throw new Error('User not found');
    }

    const currentUserProject = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: currentUserId },
    });

    if (!currentUserProject || currentUserProject.role !== 'owner') {
      if (currentUser.role !== 'admin') {
        throw new Error('Only project owner or admin can update user roles');
      }
    }

    const projectUser = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: userId },
    });

    if (!projectUser) {
      throw new Error('User is not assigned to this project');
    }

    projectUser.role = newRole;
    return this.projectUserRepository.save(projectUser);
  }

  async removeUserFromProject(
    projectId: string,
    userId: string,
    currentUserId: string,
  ) {
    // Verify current user is project owner or admin
    const currentUser = await this.userRepository.findOne({ where: { id: currentUserId } });
    if (!currentUser) {
      throw new Error('User not found');
    }

    const currentUserProject = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: currentUserId },
    });

    if (!currentUserProject || currentUserProject.role !== 'owner') {
      if (currentUser.role !== 'admin') {
        throw new Error('Only project owner or admin can remove users');
      }
    }

    const projectUser = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: userId },
    });

    if (!projectUser) {
      throw new Error('User is not assigned to this project');
    }

    await this.projectUserRepository.remove(projectUser);
    return { message: 'User removed from project successfully' };
  }
}
