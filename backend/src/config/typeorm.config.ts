import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { ProjectUser } from '../entities/project-user.entity';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'project_management',
  entities: [Client, User, Project, ProjectUser],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
};
