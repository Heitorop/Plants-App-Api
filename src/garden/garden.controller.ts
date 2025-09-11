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
import { UpdateGardenDto } from './dto/update-garden.dto';
import { GardenEntity } from './entities/garden.entity';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';

@Controller('gardens')
export class GardenController {
  constructor(private readonly gardenService: GardenService) {}

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

  @HttpCode(HttpStatus.OK)
  @Get()
  async all(): Promise<GardenEntity[]> {
    const gardens = await this.gardenService.findAll();
    return gardens;
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GardenEntity> {
    const garden = await this.gardenService.findOne(id);
    return garden;
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGardenDto: UpdateGardenDto,
  ): Promise<GardenEntity> {
    const garden = await this.gardenService.update(id, updateGardenDto);
    return garden;
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    return await this.gardenService.remove(id);
  }
}
