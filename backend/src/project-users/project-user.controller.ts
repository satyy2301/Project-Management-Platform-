import { Controller, Post, Put, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/projects')
@UseGuards(JwtAuthGuard)
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}

  @Post(':id/users')
  async assignUserToProject(
    @Param('id') projectId: string,
    @Request() req: any,
    @Body() body: { user_id: string; role: string },
  ) {
    return this.projectUserService.assignUserToProject(projectId, body.user_id, req.user.sub, body.role);
  }

  @Put(':id/users/:userId')
  async updateUserRole(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
    @Request() req: any,
    @Body() body: { role: string },
  ) {
    return this.projectUserService.updateUserRole(projectId, userId, req.user.sub, body.role);
  }

  @Delete(':id/users/:userId')
  async removeUserFromProject(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
    @Request() req: any,
  ) {
    return this.projectUserService.removeUserFromProject(projectId, userId, req.user.sub);
  }
}
