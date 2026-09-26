import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { TaskResponse, toTaskResponse } from './task.mapper';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll(userId: string, query: QueryTasksDto): Promise<TaskResponse[]> {
    const qb = this.taskRepository
      .createQueryBuilder('task')
      .where('task.user_id = :userId', { userId })
      .orderBy('task.created_at', 'DESC');

    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }

    if (query.search) {
      qb.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    const tasks = await qb.getMany();
    return tasks.map(toTaskResponse);
  }

  async findOne(userId: string, taskId: string): Promise<TaskResponse> {
    const task = await this.findOwnedTask(userId, taskId);
    return toTaskResponse(task);
  }

  async create(userId: string, dto: CreateTaskDto): Promise<TaskResponse> {
    const task = this.taskRepository.create({
      user_id: userId,
      title: dto.title,
      description: dto.description ?? null,
      status: 'pending',
      due_date: dto.dueDate ? new Date(dto.dueDate) : null,
    });

    const saved = await this.taskRepository.save(task);
    return toTaskResponse(saved);
  }

  async update(
    userId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ): Promise<TaskResponse> {
    const task = await this.findOwnedTask(userId, taskId);

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.dueDate !== undefined) {
      task.due_date = dto.dueDate ? new Date(dto.dueDate) : null;
    }

    const saved = await this.taskRepository.save(task);
    return toTaskResponse(saved);
  }

  async complete(userId: string, taskId: string): Promise<TaskResponse> {
    const task = await this.findOwnedTask(userId, taskId);
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    const saved = await this.taskRepository.save(task);
    return toTaskResponse(saved);
  }

  async remove(userId: string, taskId: string): Promise<{ message: string }> {
    const task = await this.findOwnedTask(userId, taskId);
    await this.taskRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }

  private async findOwnedTask(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, user_id: userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
