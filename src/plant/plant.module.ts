import { Module } from '@nestjs/common';
import { PlantService } from './plant.service';
import { PlantController } from './plant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantEntity } from './entities/plant.entity';
import { GardenEntity } from 'src/garden/entities/garden.entity';
import { GardenService } from 'src/garden/garden.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlantEntity, GardenEntity, UserEntity])],
  controllers: [PlantController],
  providers: [PlantService, GardenService, UserService],
})
export class PlantModule {}
