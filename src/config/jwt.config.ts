import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = (config: ConfigService): JwtModuleOptions => ({
  secret: config.getOrThrow<string>('JWT_SECRET_KEY'),
  signOptions: {
    algorithm: 'HS256',
  },
  verifyOptions: {
    algorithms: ['HS256'],
    ignoreExpiration: false,
  },
});
