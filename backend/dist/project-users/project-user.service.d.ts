import { Repository } from 'typeorm';
import { ProjectUser } from '../entities/project-user.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
export declare class ProjectUserService {
    private projectUserRepository;
    private userRepository;
    private projectRepository;
    constructor(projectUserRepository: Repository<ProjectUser>, userRepository: Repository<User>, projectRepository: Repository<Project>);
    assignUserToProject(projectId: string, userId: string, currentUserId: string, role: string): Promise<ProjectUser>;
    updateUserRole(projectId: string, userId: string, currentUserId: string, newRole: string): Promise<ProjectUser>;
    removeUserFromProject(projectId: string, userId: string, currentUserId: string): Promise<{
        message: string;
    }>;
}
