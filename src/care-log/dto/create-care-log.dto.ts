import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ActionTypeEnum } from 'src/common/enums/action-type.enum';

export class CreateCareLogDto {
  @IsEnum(ActionTypeEnum)
  action_type: ActionTypeEnum;

  @IsString()
  @IsOptional()
  notes: string;
}
