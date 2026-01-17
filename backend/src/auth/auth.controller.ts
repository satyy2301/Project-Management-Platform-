import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; client_id: string; role?: string },
  ) {
    return this.authService.register(body.email, body.password, body.client_id, body.role);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: any) {
    const user = await this.authService.validateUser(req.user.sub);
    if (!user) {
      throw new Error('User not found');
    }
    return { id: user.id, email: user.email, role: user.role, client_id: user.client_id };
  }
}
