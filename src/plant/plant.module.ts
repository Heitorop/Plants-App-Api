import { Module } from '@nestjs/common';
import { PlantService } from './plant.service';
import { PlantController } from './plant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantEntity } from './entities/plant.entity';
import { GardenEntity } from 'src/garden/entities/garden.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlantEntity, GardenEntity])],
  controllers: [PlantController],
  providers: [PlantService],
})
export class PlantModule {}
