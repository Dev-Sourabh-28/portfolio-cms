import {
  IsArray,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProjectStyleDto {
  @IsOptional()
  @IsString()
  fontFamily?: string;

  @IsOptional()
  @IsString()
  fontSize?: string;

  @IsOptional()
  @IsString()
  fontWeight?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  githubUrl?: string;

  @IsOptional()
  @IsString()
  liveUrl?: string;

  @IsOptional()
  @IsArray()
  techStack?: string[];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ProjectStyleDto)
  titleStyle?: ProjectStyleDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ProjectStyleDto)
  descriptionStyle?: ProjectStyleDto;

  @IsOptional()
  @IsString()
  portfolioId?: string;
}
