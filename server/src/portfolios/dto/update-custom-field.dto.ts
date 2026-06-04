import {
  IsEnum,
  IsInt,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CustomFieldType,
  CustomFieldStyleDto,
} from './create-custom-field.dto';

export class UpdateCustomFieldDto {
  @IsOptional()
  @IsEnum(CustomFieldType)
  type?: CustomFieldType;

  @IsOptional()
  content?: any;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomFieldStyleDto)
  style?: CustomFieldStyleDto;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
