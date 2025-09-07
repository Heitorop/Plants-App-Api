import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthResponseDto,
  LoginRequestDto,
  SignInRequestDto,
} from './dto/auth.dto';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(201)
  @Post('sign-in')
  signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() data: SignInRequestDto,
  ): Promise<AuthResponseDto> {
    const result = this.authService.signIn(res, data);
    return result;
  }

  @HttpCode(200)
  @Post('log-in')
  logIn(
    @Res({ passthrough: true }) res: Response,
    @Body() data: LoginRequestDto,
  ): Promise<AuthResponseDto> {
    const result = this.authService.logIn(res, data);
    return result;
  }

  @HttpCode(200)
  @Post('refresh')
  refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const result = this.authService.refresh(req, res);
    return result;
  }

  @HttpCode(200)
  @Post('log-out')
  logOut(@Res({ passthrough: true }) res: Response): boolean {
    const result = this.authService.logout(res);
    if (!result) {
      throw new UnauthorizedException('Logout failed');
    }
    return true;
  }
}
