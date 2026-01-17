import { ProjectUserService } from './project-user.service';
export declare class ProjectUserController {
    private readonly projectUserService;
    constructor(projectUserService: ProjectUserService);
    assignUserToProject(projectId: string, req: any, body: {
        user_id: string;
        role: string;
    }): Promise<import("../entities/project-user.entity").ProjectUser>;
    updateUserRole(projectId: string, userId: string, req: any, body: {
        role: string;
    }): Promise<import("../entities/project-user.entity").ProjectUser>;
    removeUserFromProject(projectId: string, userId: string, req: any): Promise<{
        message: string;
    }>;
}
