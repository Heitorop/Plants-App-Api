import { forwardRef, Module } from '@nestjs/common';
import { CareLogService } from './care-log.service';
import { CareLogController } from './care-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareLogEntity } from './entities/care-log.entity';
import { PlantEntity } from 'src/plant/entities/plant.entity';
import { PlantModule } from 'src/plant/plant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CareLogEntity, PlantEntity]),
    forwardRef(() => PlantModule),
  ],
  exports: [CareLogService],
  controllers: [CareLogController],
  providers: [CareLogService],
})
export class CareLogModule {}
