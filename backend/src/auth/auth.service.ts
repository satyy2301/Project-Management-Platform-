import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';

export interface AuthUserResponse {
  id: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly accessSecret =
    process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me';
  private readonly refreshSecret =
    process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me';
  private readonly accessExpiry = process.env.ACCESS_TOKEN_EXPIRY || '15m';
  private readonly refreshExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<AuthUserResponse> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password_hash,
      refresh_token_hash: null,
    });

    await this.userRepository.save(user);
    return { id: user.id, email: user.email };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: AuthUserResponse } & TokenPair> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.issueTokenPair(user);
    return {
      ...tokens,
      user: { id: user.id, email: user.email },
    };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    let payload: { sub: string; email: string };

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user || !user.refresh_token_hash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refresh_token_hash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokenPair(user);
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.userRepository.update(userId, { refresh_token_hash: null });
    return { message: 'Logged out successfully' };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  private async issueTokenPair(user: User): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.accessSecret,
      expiresIn: this.accessExpiry,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshExpiry,
    });

    const refresh_token_hash = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(user.id, { refresh_token_hash });

    return { accessToken, refreshToken };
  }
}
