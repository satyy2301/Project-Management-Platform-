import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export type TaskStatus = 'pending' | 'completed';

@Entity('tasks')
@Index('idx_tasks_user_id', ['user_id'])
@Index('idx_tasks_user_id_status', ['user_id', 'status'])
@Index('idx_tasks_user_id_due_date', ['user_id', 'due_date'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ default: 'pending' })
  status!: TaskStatus;

  @Column({ type: 'timestamp', nullable: true })
  due_date!: Date | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
