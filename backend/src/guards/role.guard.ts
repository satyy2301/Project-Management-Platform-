import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUser } from '../entities/project-user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(ProjectUser)
    private projectUserRepository: Repository<ProjectUser>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = request.params.id;

    if (!user) {
      return false;
    }

    // Global admin can perform any action
    if (user.role === 'admin') {
      return true;
    }

    // Check project-level role
    const projectUser = await this.projectUserRepository.findOne({
      where: { project_id: projectId, user_id: user.sub },
    });

    return !!(projectUser && (projectUser.role === 'owner' || user.role === 'admin'));
  }
}
