import { type ConfigService } from '@nestjs/config';
import { type TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.getOrThrow('DATABASE_HOST'),
  port: config.getOrThrow('DATABASE_PORT'),
  username: config.getOrThrow('DATABASE_USERNAME'),
  password: config.getOrThrow('DATABASE_PASSWORD'),
  database: config.getOrThrow('DATABASE_NAME'),
  autoLoadEntities: true,
  synchronize: true,
});
