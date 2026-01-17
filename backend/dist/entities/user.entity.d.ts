import { Client } from './client.entity';
import { ProjectUser } from './project-user.entity';
export declare class User {
    id: string;
    email: string;
    password_hash: string;
    role: string;
    client_id: string;
    created_at: Date;
    updated_at: Date;
    client: Client;
    projectUsers: ProjectUser[];
}
