import { User } from './user.entity';
import { Project } from './project.entity';
export declare class Client {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    users: User[];
    projects: Project[];
}
