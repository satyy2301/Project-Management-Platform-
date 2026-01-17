import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        client_id: string;
        role?: string;
    }): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            role: string;
        };
    }>;
    getMe(req: any): Promise<{
        id: string;
        email: string;
        role: string;
        client_id: string;
    }>;
}
