import { IsNotEmpty, IsString } from 'class-validator';
import { LocationEnum } from 'src/common/enums/location.enum';

export class CreateGardenDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: LocationEnum;
}
