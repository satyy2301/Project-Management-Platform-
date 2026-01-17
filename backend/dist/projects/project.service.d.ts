import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { ProjectUser } from '../entities/project-user.entity';
import { User } from '../entities/user.entity';
export declare class ProjectService {
    private projectRepository;
    private projectUserRepository;
    private userRepository;
    constructor(projectRepository: Repository<Project>, projectUserRepository: Repository<ProjectUser>, userRepository: Repository<User>);
    getAllProjects(userId: string, clientId: string): Promise<Project[]>;
    getProjectById(projectId: string): Promise<Project | null>;
    createProject(userId: string, clientId: string, name: string, description?: string): Promise<Project>;
    updateProject(projectId: string, userId: string, name: string, description?: string): Promise<Project | null>;
    deleteProject(projectId: string, userId: string): Promise<{
        message: string;
    }>;
    private isProjectOwner;
}
