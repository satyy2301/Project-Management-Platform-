import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUser } from '../entities/project-user.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { ProjectUserService } from './project-user.service';
import { ProjectUserController } from './project-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectUser, User, Project])],
  providers: [ProjectUserService],
  controllers: [ProjectUserController],
  exports: [ProjectUserService],
})
export class ProjectUserModule {}
