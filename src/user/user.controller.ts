import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { UserEntity } from './entities/user.entity';
import { Authorized } from 'src/auth/decorators/authorized.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  //getProfile(@Authorized('id') id: string) { return user id --- IGNORE ---
  getProfile(@Authorized() user: UserEntity) {
    return user;
  }
}
