import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Client } from '../entities/client.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string, clientId: string, role?: string) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Verify client exists
    const client = await this.clientRepository.findOne({ where: { id: clientId } });
    if (!client) {
      throw new Error('Client not found');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const user = this.userRepository.create({
      email,
      password_hash,
      client_id: clientId,
      role: role || 'member',
    });

    await this.userRepository.save(user);
    return { id: user.id, email: user.email, role: user.role };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role, client_id: user.client_id };
    const token = this.jwtService.sign(payload);

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  async validateUser(userId: string) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['client'],
    });
  }
}
