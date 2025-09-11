import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LocationEnum } from 'src/common/enums/location.enum';

export class CreateGardenDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(LocationEnum, { message: 'Location must be indoor or outdoor.' })
  @IsNotEmpty()
  location: LocationEnum;
}
