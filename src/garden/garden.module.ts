import { Module } from '@nestjs/common';
import { GardenService } from './garden.service';
import { GardenController } from './garden.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GardenEntity } from './entities/garden.entity';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { PlantService } from 'src/plant/plant.service';
import { PlantEntity } from 'src/plant/entities/plant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GardenEntity, UserEntity, PlantEntity])],
  controllers: [GardenController],
  providers: [GardenService, UserService, PlantService],
})
export class GardenModule {}
