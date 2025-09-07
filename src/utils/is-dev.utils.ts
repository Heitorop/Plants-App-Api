import { ConfigService } from '@nestjs/config';

export const isDev = (config: ConfigService) => {
  return config.get<string>('NODE_ENV') === 'development';
};
