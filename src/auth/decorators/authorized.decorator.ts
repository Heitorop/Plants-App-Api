import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { Request } from 'express';

export const Authorized = createParamDecorator(
  (
    data: keyof UserEntity,
    ctx: ExecutionContext,
  ): UserEntity[keyof UserEntity] | UserEntity | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as UserEntity | undefined;

    return data ? user?.[data] : user;
  },
);
