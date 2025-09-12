import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GardenService } from './garden.service';
import { CreateGardenDto } from './dto/create-garden.dto';
import { GardenEntity } from './entities/garden.entity';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { PlantEntity } from 'src/plant/entities/plant.entity';
import { PlantService } from 'src/plant/plant.service';
import { CreatePlantDto } from 'src/plant/dto/create-plant.dto';
import { UpdatePlantDto } from 'src/plant/dto/update-plant.dto';

@Controller('gardens')
export class GardenController {
  constructor(
    private readonly gardenService: GardenService,
    private readonly plantService: PlantService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Authorization()
  @Post()
  async create(
    @Authorized('id') userId: string,
    @Body() createGardenDto: CreateGardenDto,
  ): Promise<GardenEntity> {
    const garden = await this.gardenService.create(createGardenDto, userId);
    return garden;
  }

  @Authorization()
  @Get('/:gardenId/plants')
  async getAllUserPlants(
    @Authorized('id') userId: string,
    @Param('gardenId') gardenId: string,
  ): Promise<PlantEntity[]> {
    const plants = await this.plantService.getAllUserPlants(userId, gardenId);

    return plants;
  }

  @Authorization()
  @Post('/:gardenId/plants')
  async createUserPlants(
    @Authorized('id') userId: string,
    @Param('gardenId') gardenId: string,
    @Body() data: CreatePlantDto,
  ): Promise<PlantEntity> {
    const plant = await this.plantService.createUserPlant(
      userId,
      gardenId,
      data,
    );

    return plant;
  }

  @Authorization()
  @Patch('/:gardenId/plants/:plantId')
  async updateUserPlants(
    @Authorized('id') userId: string,
    @Param('gardenId') gardenId: string,
    @Param('plantId') plantId: string,
    @Body() data: UpdatePlantDto,
  ) {
    const plant = await this.plantService.updateUserPlant(
      userId,
      gardenId,
      plantId,
      data,
    );

    return plant;
  }

  @Authorization()
  @Get('/:gardenId/plants/:plantId')
  async getUserPlant(
    @Authorized('id') userId: string,
    @Param('gardenId') gardenId: string,
    @Param('plantId') plantId: string,
  ): Promise<PlantEntity> {
    const plant = await this.plantService.getUserPlant(
      userId,
      gardenId,
      plantId,
    );

    return plant;
  }

  @Authorization()
  @Delete('/:gardenId/plants/:plantId')
  async removeUserPlants(
    @Authorized('id') userId: string,
    @Param('gardenId') gardenId: string,
    @Param('plantId') plantId: string,
  ): Promise<{ message: string }> {
    const response = await this.plantService.removeUserPlant(
      userId,
      gardenId,
      plantId,
    );

    return response;
  }
}
