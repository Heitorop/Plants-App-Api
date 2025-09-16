import { Module } from '@nestjs/common';
import { CareLogService } from './care-log.service';
import { CareLogController } from './care-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareLogEntity } from './entities/care-log.entity';
import { PlantEntity } from 'src/plant/entities/plant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CareLogEntity, PlantEntity])],
  controllers: [CareLogController],
  providers: [CareLogService],
})
export class CareLogModule {}
