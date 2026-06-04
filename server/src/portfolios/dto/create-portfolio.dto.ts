import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCustomFieldDto } from './create-custom-field.dto';

export class CreatePortfolioDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsInt()
  yearsExperience?: number;

  @IsOptional()
  @IsInt()
  clientsHandled?: number;

  @IsOptional()
  @IsArray()
  techStack?: string[];

  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  @IsOptional()
  @IsString()
  resumeImageUrl?: string;

  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @IsOptional()
  @IsString()
  bestProjectUrl?: string;

  @IsOptional()
  @IsObject()
  subtitleStyle?: {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
  };

  @IsOptional()
  @IsObject()
  bioStyle?: {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
  };

  @IsOptional()
  @IsObject()
  profileImageStyle?: {
    size?: string;
    shape?:
      | 'circular'
      | 'square'
      | 'rounded'
      | 'hexagon'
      | 'pentagon'
      | 'octagon';
  };

  @IsOptional()
  @IsObject()
  projectImageStyle?: {
    size?: string;
    shape?:
      | 'circular'
      | 'square'
      | 'rounded'
      | 'hexagon'
      | 'pentagon'
      | 'octagon';
  };

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCustomFieldDto)
  customFields?: CreateCustomFieldDto[];
}
