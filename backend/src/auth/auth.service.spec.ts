import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  password_hash: '$2a$10$hashed',
  refresh_token_hash: null,
  created_at: new Date(),
  updated_at: new Date(),
  tasks: [],
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: {
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    update: jest.Mock;
  };
  let jwtService: { sign: jest.Mock; verify: jest.Mock };

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      create: jest.fn((data) => ({ ...mockUser, ...data })),
      save: jest.fn(async (user) => user),
      update: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token'),
      verify: jest.fn(),
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

  describe('register', () => {
    it('registers a new user successfully', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await authService.register('new@example.com', 'password123');

      expect(result).toEqual({ id: mockUser.id, email: 'new@example.com' });
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('throws ConflictException for duplicate email', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(authService.register('test@example.com', 'password123')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('returns tokens for valid credentials', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);
      userRepository.update.mockResolvedValue(undefined);

      jwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await authService.login('test@example.com', 'password123');

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('throws UnauthorizedException for invalid credentials', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(authService.login('test@example.com', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refresh', () => {
    it('throws UnauthorizedException for invalid refresh token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('invalid');
      });

      await expect(authService.refresh('bad-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('clears refresh token hash', async () => {
      const result = await authService.logout('user-1');

      expect(userRepository.update).toHaveBeenCalledWith('user-1', {
        refresh_token_hash: null,
      });
      expect(result.message).toBe('Logged out successfully');
    });
  });
});
