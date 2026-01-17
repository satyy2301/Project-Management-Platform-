import { Client } from './client.entity';
import { ProjectUser } from './project-user.entity';
export declare class Project {
    id: string;
    name: string;
    description: string;
    client_id: string;
    created_at: Date;
    updated_at: Date;
    client: Client;
    projectUsers: ProjectUser[];
}
