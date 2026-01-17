import { ProjectService } from './project.service';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    getProjects(req: any): Promise<import("../entities/project.entity").Project[]>;
    createProject(req: any, body: {
        name: string;
        description?: string;
    }): Promise<import("../entities/project.entity").Project>;
    getProjectById(projectId: string): Promise<import("../entities/project.entity").Project | null>;
    updateProject(projectId: string, req: any, body: {
        name: string;
        description?: string;
    }): Promise<import("../entities/project.entity").Project | null>;
    deleteProject(projectId: string, req: any): Promise<{
        message: string;
    }>;
    getProjectUsers(projectId: string): Promise<{
        id: string;
        email: string;
        role: string;
    }[]>;
}
