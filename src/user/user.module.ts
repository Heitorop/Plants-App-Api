import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { GardenEntity } from 'src/garden/entities/garden.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, GardenEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
