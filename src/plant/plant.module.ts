import { Module } from '@nestjs/common';
import { PlantService } from './plant.service';
import { PlantController } from './plant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantEntity } from './entities/plant.entity';
import { GardenEntity } from 'src/garden/entities/garden.entity';
import { GardenService } from 'src/garden/garden.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CareLogService } from 'src/care-log/care-log.service';
import { CareLogEntity } from 'src/care-log/entities/care-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlantEntity,
      GardenEntity,
      UserEntity,
      CareLogEntity,
    ]),
  ],
  controllers: [PlantController],
  providers: [PlantService, GardenService, UserService, CareLogService],
})
export class PlantModule {}
