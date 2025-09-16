import { forwardRef, Module } from '@nestjs/common';
import { PlantService } from './plant.service';
import { PlantController } from './plant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantEntity } from './entities/plant.entity';
import { GardenEntity } from 'src/garden/entities/garden.entity';
import { CareLogEntity } from 'src/care-log/entities/care-log.entity';
import { GardenModule } from 'src/garden/garden.module';
import { CareLogModule } from 'src/care-log/care-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlantEntity, GardenEntity, CareLogEntity]),
    forwardRef(() => GardenModule),
    forwardRef(() => CareLogModule),
  ],
  exports: [PlantService],
  controllers: [PlantController],
  providers: [PlantService],
})
export class PlantModule {}
