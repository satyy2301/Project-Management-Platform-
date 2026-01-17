import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './projects/project.module';
import { ProjectUserModule } from './project-users/project-user.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    AuthModule,
    ProjectModule,
    ProjectUserModule,
    UsersModule,
  ],
})
export class AppModule {}
