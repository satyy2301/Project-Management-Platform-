import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';

describe('AuthService refresh rotation', () => {
  let authService: AuthService;
  let userRepository: {
    findOne: jest.Mock;
    update: jest.Mock;
  };
  let jwtService: { sign: jest.Mock; verify: jest.Mock };

  const user: User = {
    id: 'user-1',
    email: 'test@example.com',
    password_hash: 'hash',
    refresh_token_hash: null,
    created_at: new Date(),
    updated_at: new Date(),
    tasks: [],
  };

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn().mockReturnValue({ sub: user.id, email: user.email }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('rotates refresh token on valid refresh', async () => {
    const oldRefreshToken = 'old-refresh-token';
    user.refresh_token_hash = await bcrypt.hash(oldRefreshToken, 10);
    userRepository.findOne.mockResolvedValue(user);
    jwtService.sign
      .mockReturnValueOnce('new-access-token')
      .mockReturnValueOnce('new-refresh-token');
    userRepository.update.mockResolvedValue(undefined);

    const result = await authService.refresh(oldRefreshToken);

    expect(result.accessToken).toBe('new-access-token');
    expect(result.refreshToken).toBe('new-refresh-token');
    expect(userRepository.update).toHaveBeenCalledWith(
      user.id,
      expect.objectContaining({ refresh_token_hash: expect.any(String) }),
    );
  });

  it('rejects refresh when token hash does not match', async () => {
    user.refresh_token_hash = await bcrypt.hash('different-token', 10);
    userRepository.findOne.mockResolvedValue(user);

    await expect(authService.refresh('old-refresh-token')).rejects.toThrow(
      'Invalid refresh token',
    );
  });
});
