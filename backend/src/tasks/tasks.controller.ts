import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Request() req: { user: { sub: string } }, @Query() query: QueryTasksDto) {
    return this.tasksService.findAll(req.user.sub, query);
  }

  @Post()
  create(@Request() req: { user: { sub: string } }, @Body() body: CreateTaskDto) {
    return this.tasksService.create(req.user.sub, body);
  }

  @Get(':id')
  findOne(@Request() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.tasksService.findOne(req.user.sub, id);
  }

  @Put(':id')
  update(
    @Request() req: { user: { sub: string } },
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ) {
    return this.tasksService.update(req.user.sub, id, body);
  }

  @Patch(':id/complete')
  complete(@Request() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.tasksService.complete(req.user.sub, id);
  }

  @Delete(':id')
  remove(@Request() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.tasksService.remove(req.user.sub, id);
  }
}
