import { IsOptional, IsIn, IsString } from 'class-validator';

export class QueryTasksDto {
  @IsOptional()
  @IsIn(['pending', 'completed'])
  status?: 'pending' | 'completed';

  @IsOptional()
  @IsString()
  search?: string;
}
