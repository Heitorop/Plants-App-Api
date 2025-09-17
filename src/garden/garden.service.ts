import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGardenDto } from './dto/create-garden.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GardenEntity } from './entities/garden.entity';
import { Repository } from 'typeorm';
import { UpdateGardenDto } from './dto/update-garden.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GardenService {
  constructor(
    @InjectRepository(GardenEntity)
    private readonly gardenRepository: Repository<GardenEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  async create(data: CreateGardenDto, userId: string): Promise<GardenEntity> {
    const user = await this.userService.findOne(userId);

    const garden = this.gardenRepository.create({ ...data, user });

    return await this.gardenRepository.save(garden);
  }

  async createUserGarden(
    userId: string,
    data: CreateGardenDto,
  ): Promise<GardenEntity> {
    const { name } = data;
    const user = await this.userService.findOne(userId);

    const isExist = await this.gardenRepository.findOne({
      where: {
        name: name,
      },
    });

    if (isExist) {
      throw new ConflictException('Garden with this name already exists');
    }

    const garden = this.gardenRepository.create({
      user,
      ...data,
    });

    return await this.gardenRepository.save(garden);
  }

  async getUserGardens(userId: string): Promise<GardenEntity[]> {
    const gardens = await this.gardenRepository.find({
      where: { user: { id: userId } },
    });

    if (!gardens) {
      throw new NotFoundException(`No gardens found for this user ${userId}`);
    }

    return gardens;
  }

  async getUserGarden(userId: string, gardenId: string): Promise<GardenEntity> {
    const garden = await this.gardenRepository.findOne({
      where: { id: gardenId, user: { id: userId } },
    });

    if (!garden) {
      const msg = `Garden with id ${gardenId} not found for user ${userId}`;
      throw new NotFoundException(msg);
    }

    return garden;
  }

  async updateUserGarden(
    userId: string,
    gardenId: string,
    data: UpdateGardenDto,
  ): Promise<GardenEntity> {
    const garden = await this.gardenRepository.findOne({
      where: {
        id: gardenId,
        user: { id: userId },
      },
    });

    if (!garden) {
      throw new NotFoundException(
        `Garden with id ${gardenId} not found for user with id ${userId}`,
      );
    }

    Object.assign(garden, data);

    return await this.gardenRepository.save(garden);
  }

  async removeUserGarden(
    userId: string,
    gardenId: string,
  ): Promise<{ message: string }> {
    const garden = await this.gardenRepository.findOne({
      where: {
        id: gardenId,
        user: {
          id: userId,
        },
      },
    });

    if (!garden) {
      throw new NotFoundException(
        `Garden with id ${gardenId} not found for user with id ${userId}`,
      );
    }

    await this.gardenRepository.remove(garden);

    return { message: 'Garden deleted successfully' };
  }
}
