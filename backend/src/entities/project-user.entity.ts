import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity('project_users')
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  project_id!: string;

  @Column()
  user_id!: string;

  @Column()
  role!: string; // 'owner', 'developer', 'viewer'

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Project, (project) => project.projectUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project;

  @ManyToOne(() => User, (user) => user.projectUsers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
