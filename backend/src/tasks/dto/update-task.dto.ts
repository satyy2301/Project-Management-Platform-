import { IsString, IsOptional, IsIn, IsDateString, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['pending', 'completed'])
  status?: 'pending' | 'completed';

  @IsOptional()
  @IsDateString()
  dueDate?: string | null;
}
