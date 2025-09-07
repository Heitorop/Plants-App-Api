import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import {
  AuthResponseDto,
  LoginRequestDto,
  SignInRequestDto,
} from './dto/auth.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, type Response } from 'express';
import { isDev } from 'src/utils/is-dev.utils';
import { JwtPayload } from './interfaces/jwt.interface';
import { parseTtlToMs } from 'src/utils/ttl-to-ms.util';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly COOKIE_DOMAIN: string;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = this.config.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = this.config.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.COOKIE_DOMAIN = this.config.getOrThrow<string>('COOKIE_DOMAIN');
  }

  private generateTokens = (
    id: string,
    role: string,
  ): { accessToken: string; refreshToken: string } => {
    const payload: JwtPayload = { sub: id, role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });

    return { accessToken, refreshToken };
  };

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.config),
      sameSite: isDev(this.config) ? 'none' : 'lax',
    });
  }

  private auth(res: Response, id: string, role: string): AuthResponseDto {
    const { accessToken, refreshToken } = this.generateTokens(id, role);
    this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + parseTtlToMs(this.JWT_REFRESH_TOKEN_TTL)),
    );
    return { access_token: accessToken };
  }

  async signIn(
    res: Response,
    data: SignInRequestDto,
  ): Promise<AuthResponseDto> {
    const { name, email, password } = data;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new ConflictException('User with this email already exists.');
    }

    const newUser = this.userRepository.create({
      name,
      email,
      password: await hash(password),
    });
    const savedUser = await this.userRepository.save(newUser);
    console.log(savedUser);

    return this.auth(res, savedUser.id, savedUser.role);
  }

  async logIn(res: Response, data: LoginRequestDto): Promise<AuthResponseDto> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User with this email does not exist.');
    }

    const isValidPassword = await verify(user.password, password);
    if (!isValidPassword) {
      throw new NotFoundException('Invalid email or password');
    }

    return this.auth(res, user.id, user.role);
  }

  async refresh(req: Request, res: Response): Promise<AuthResponseDto> {
    const refreshToken = (req.cookies as Record<string, string>)[
      'refreshToken'
    ];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const payload: JwtPayload = await this.jwtService.verifyAsync(
      refreshToken,
      {
        secret: this.config.getOrThrow<string>('JWT_SECRET_KEY'),
      },
    );
    if (payload) {
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.auth(res, payload.sub, payload.role);
    }
    throw new UnauthorizedException('Invalid refresh token');
  }

  logout(res: Response): boolean {
    this.setCookie(res, '', new Date());
    return true;
  }

  async validateUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
