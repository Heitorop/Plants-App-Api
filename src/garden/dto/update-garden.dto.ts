import { PartialType } from '@nestjs/mapped-types';
import { CreateGardenDto } from './create-garden.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LocationEnum } from 'src/common/enums/location.enum';

export class UpdateGardenDto extends PartialType(CreateGardenDto) {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(LocationEnum, { message: 'Location must be indoor or outdoor.' })
  @IsNotEmpty()
  location: LocationEnum;
}
