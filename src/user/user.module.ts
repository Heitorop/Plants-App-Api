import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { GardenEntity } from 'src/garden/entities/garden.entity';
import { GardenModule } from 'src/garden/garden.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, GardenEntity]),
    forwardRef(() => GardenModule),
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
