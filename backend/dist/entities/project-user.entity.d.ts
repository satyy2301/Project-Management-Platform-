import { User } from './user.entity';
import { Project } from './project.entity';
export declare class ProjectUser {
    id: string;
    project_id: string;
    user_id: string;
    role: string;
    created_at: Date;
    project: Project;
    user: User;
}
