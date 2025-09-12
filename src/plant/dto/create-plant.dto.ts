import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlantDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  species: string;
}
