import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum CustomFieldType {
  PARAGRAPH = 'paragraph',
  ORDERED_LIST = 'orderedList',
  UNORDERED_LIST = 'unorderedList',
  HEADING = 'heading',
}

export class CustomFieldStyleDto {
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
  fontStyle?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class CreateCustomFieldDto {
  @IsEnum(CustomFieldType)
  @IsNotEmpty()
  type: CustomFieldType;

  content: any; // JSON for rich text content

  @IsInt()
  @IsNotEmpty()
  order: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldStyleDto)
  style?: CustomFieldStyleDto;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
