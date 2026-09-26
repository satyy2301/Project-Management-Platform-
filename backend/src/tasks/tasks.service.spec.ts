import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '../entities/task.entity';

const ownerId = 'user-1';
const otherUserId = 'user-2';

const mockTask: Task = {
  id: 'task-1',
  user_id: ownerId,
  title: 'Test task',
  description: 'A description',
  status: 'pending',
  due_date: null,
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
  user: {} as Task['user'],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let taskRepository: {
    createQueryBuilder: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    findOne: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    const qb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([mockTask]),
    };

    taskRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(qb),
      create: jest.fn((data) => ({ ...mockTask, ...data })),
      save: jest.fn(async (task) => task),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: taskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
  });

  it('returns tasks for authenticated user', async () => {
    const tasks = await tasksService.findAll(ownerId, {});

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Test task');
  });

  it('creates a task scoped to user', async () => {
    const task = await tasksService.create(ownerId, {
      title: 'New task',
      description: 'Details',
    });

    expect(task.title).toBe('New task');
    expect(taskRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: ownerId }),
    );
  });

  it('returns 404 when task is not owned by user', async () => {
    taskRepository.findOne.mockResolvedValue(null);

    await expect(tasksService.findOne(otherUserId, 'task-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('toggles task completion status', async () => {
    taskRepository.findOne.mockResolvedValue({ ...mockTask });

    const completed = await tasksService.complete(ownerId, 'task-1');
    expect(completed.status).toBe('completed');

    taskRepository.findOne.mockResolvedValue({ ...mockTask, status: 'completed' });
    const pending = await tasksService.complete(ownerId, 'task-1');
    expect(pending.status).toBe('pending');
  });

  it('deletes owned task', async () => {
    taskRepository.findOne.mockResolvedValue({ ...mockTask });

    const result = await tasksService.remove(ownerId, 'task-1');

    expect(result.message).toBe('Task deleted successfully');
    expect(taskRepository.remove).toHaveBeenCalled();
  });
});
