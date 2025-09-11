import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { UserEntity } from './entities/user.entity';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { GardenEntity } from 'src/garden/entities/garden.entity';
import { GardenService } from 'src/garden/garden.service';
import { UpdateGardenDto } from 'src/garden/dto/update-garden.dto';
import { CreateGardenDto } from 'src/garden/dto/create-garden.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly gardenService: GardenService,
  ) {}

  @Authorization()
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  //getProfile(@Authorized('id') id: string) { return user id --- IGNORE ---
  getUser(@Authorized() user: UserEntity) {
    return user;
  }

  @Authorization()
  @HttpCode(HttpStatus.CREATED)
  @Post('gardens')
  async createUserGarden(
    @Authorized('id') userId: string,
    @Body() data: CreateGardenDto,
  ): Promise<GardenEntity> {
    const garden = await this.gardenService.createUserGarden(userId, data);

    return garden;
  }

  @Authorization()
  @Get('gardens')
  async getGardens(@Authorized('id') userId: string): Promise<GardenEntity[]> {
    const gardens = await this.gardenService.getUserGardens(userId);
    return gardens;
  }

  @Authorization()
  @Patch('gardens/:id')
  @HttpCode(HttpStatus.OK)
  async updateUserGarden(
    @Authorized('id') userId: string,
    @Body() updateGardenDto: UpdateGardenDto,
    @Param('id') gardenId: string,
  ) {
    await this.gardenService.updateUserGarden(
      userId,
      gardenId,
      updateGardenDto,
    );

    return { message: 'Garden updated successfully' };
  }

  @Authorization()
  @Delete('gardens/:id')
  @HttpCode(HttpStatus.OK)
  async removeUserGarden(
    @Authorized('id') userId: string,
    @Param('id') gardenId: string,
  ) {
    await this.gardenService.removeUserGarden(userId, gardenId);

    return { message: 'Garden deleted successfully' };
  }
}
