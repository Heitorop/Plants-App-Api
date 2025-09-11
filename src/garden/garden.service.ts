import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGardenDto } from './dto/create-garden.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GardenEntity } from './entities/garden.entity';
import { Repository } from 'typeorm';
import { UpdateGardenDto } from './dto/update-garden.dto';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class GardenService {
  constructor(
    @InjectRepository(GardenEntity)
    private readonly gardenRepository: Repository<GardenEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {}
  async create(data: CreateGardenDto, userId: string): Promise<GardenEntity> {
    try {
      const user = await this.userService.findOne(userId);

      const garden = this.gardenRepository.create({ ...data, user });

      return await this.gardenRepository.save(garden);
    } catch (error) {
      throw new InternalServerErrorException('Error creating garden: ' + error);
    }
  }

  async findAll(): Promise<GardenEntity[]> {
    try {
      const gardens = await this.gardenRepository.find();
      return gardens;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching gardens: ' + error,
      );
    }
  }

  async findOne(id: string): Promise<GardenEntity> {
    try {
      const garden = await this.gardenRepository.findOne({ where: { id: id } });

      if (!garden) {
        console.log('Garden not found with id:', id);
        throw new NotFoundException('Garden not found');
      }
      return garden;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Error fetching garden: ' + error);
    }
  }

  async update(
    id: string,
    updateGardenDto: UpdateGardenDto,
  ): Promise<GardenEntity> {
    try {
      const garden = await this.gardenRepository.preload({
        id,
        ...updateGardenDto,
      });
      if (!garden) {
        console.log('Garden not found with id:', id);
        throw new NotFoundException('Garden not found');
      }
      return this.gardenRepository.save(garden);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Error updating garden: ' + error);
    }
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const garden = await this.findOne(id);
      await this.gardenRepository.remove(garden);
      return { success: true, message: `Garden with id ${id} removed.` };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error removing garden: ' + error);
    }
  }

  async createUserGarden(
    userId: string,
    data: CreateGardenDto,
  ): Promise<GardenEntity> {
    try {
      const user = await this.userService.findOne(userId);

      const garden = this.gardenRepository.create({
        user,
        ...data,
      });

      return await this.gardenRepository.save(garden);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      throw new InternalServerErrorException(
        'Error fetching user gardens: ' + message,
      );
    }
  }

  async getUserGardens(userId: string): Promise<GardenEntity[]> {
    try {
      const gardens = await this.gardenRepository.find({
        where: { user: { id: userId } },
      });

      if (!gardens || gardens.length === 0) {
        console.log('No gardens found for this user:', userId);
        throw new NotFoundException(`No gardens found for this user ${userId}`);
      }

      return gardens;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;

      const message = error instanceof Error ? error.message : String(error);

      throw new InternalServerErrorException(
        'Error fetching user gardens: ' + message,
      );
    }
  }

  async updateUserGarden(
    userId: string,
    gardenId: string,
    data: UpdateGardenDto,
  ): Promise<GardenEntity> {
    try {
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
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;

      const message = error instanceof Error ? error.message : String(error);

      throw new InternalServerErrorException(
        'Error fetching user gardens: ' + message,
      );
    }
  }

  async removeUserGarden(
    userId: string,
    gardenId: string,
  ): Promise<GardenEntity> {
    const garden = await this.gardenRepository.findOne({
      where: {
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

    return await this.gardenRepository.remove(garden);
  }
}
