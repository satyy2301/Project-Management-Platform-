import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly clientRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, clientRepository: Repository<Client>, jwtService: JwtService);
    register(email: string, password: string, clientId: string, role?: string): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
    login(email: string, password: string): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    validateUser(userId: string): Promise<User | null>;
}
