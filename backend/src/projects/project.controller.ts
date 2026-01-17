import { Controller, Get, Post, Put, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProjects(@Request() req: any) {
    return this.projectService.getAllProjects(req.user.sub, req.user.client_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProject(
    @Request() req: any,
    @Body() body: { name: string; description?: string },
  ) {
    return this.projectService.createProject(req.user.sub, req.user.client_id, body.name, body.description);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProjectById(@Param('id') projectId: string) {
    return this.projectService.getProjectById(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateProject(
    @Param('id') projectId: string,
    @Request() req: any,
    @Body() body: { name: string; description?: string },
  ) {
    return this.projectService.updateProject(projectId, req.user.sub, body.name, body.description);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProject(
    @Param('id') projectId: string,
    @Request() req: any,
  ) {
    return this.projectService.deleteProject(projectId, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/users')
  async getProjectUsers(@Param('id') projectId: string) {
    // This will return users as part of the project details
    const project = await this.projectService.getProjectById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return project.projectUsers.map(pu => ({
      id: pu.user.id,
      email: pu.user.email,
      role: pu.role,
    }));
  }
}
