import { forwardRef, Module } from '@nestjs/common';
import { GardenService } from './garden.service';
import { GardenController } from './garden.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GardenEntity } from './entities/garden.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { PlantEntity } from 'src/plant/entities/plant.entity';
import { UserModule } from 'src/user/user.module';
import { PlantModule } from 'src/plant/plant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GardenEntity, UserEntity, PlantEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => PlantModule),
  ],
  exports: [GardenService],
  controllers: [GardenController],
  providers: [GardenService],
})
export class GardenModule {}
