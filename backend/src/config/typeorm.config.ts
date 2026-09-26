import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Task } from '../entities/task.entity';

const baseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  entities: [User, Task],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
};

export const typeormConfig: TypeOrmModuleOptions = process.env.DATABASE_URL
  ? {
      ...baseConfig,
      url: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      ...baseConfig,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'task_management_db',
    };
