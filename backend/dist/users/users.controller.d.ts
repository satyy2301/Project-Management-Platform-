import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UsersController {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getUserByEmail(email: string): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
}
