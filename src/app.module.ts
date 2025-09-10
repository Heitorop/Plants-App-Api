import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PlantModule } from './plant/plant.module';
import { GardenModule } from './garden/garden.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    PlantModule,
    GardenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
