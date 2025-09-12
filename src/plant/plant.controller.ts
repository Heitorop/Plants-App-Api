import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PlantService } from './plant.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { PlantEntity } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';

@Controller('plants')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}
}
