import {
  Injectable,
  InternalServerErrorException,
  Logger,
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
  private readonly logger = new Logger(GardenService.name);

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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error('Error creating garden: ' + message);

      throw new InternalServerErrorException(
        'Error creating garden: ' + message,
      );
    }
  }

  // async findAll(): Promise<GardenEntity[]> {
  //   try {
  //     const gardens = await this.gardenRepository.find();
  //     return gardens;
  //   } catch (error: unknown) {
  //     const message = error instanceof Error ? error.message : String(error);

  //     this.logger.error('Error creating garden: ' + message);

  //     throw new InternalServerErrorException(
  //       'Error fetching gardens: ' + message,
  //     );
  //   }
  // }

  // async findOne(id: string): Promise<GardenEntity> {
  //   try {
  //     const garden = await this.gardenRepository.findOne({ where: { id: id } });

  //     if (!garden) {
  //       console.log('Garden not found with id:', id);
  //       throw new NotFoundException('Garden not found');
  //     }
  //     return garden;
  //   } catch (error: unknown) {
  //     if (error instanceof NotFoundException) throw error;

  //     const message = error instanceof Error ? error.message : String(error);

  //     this.logger.error('Error creating garden: ' + message);

  //     throw new InternalServerErrorException(
  //       'Error fetching garden: ' + message,
  //     );
  //   }
  // }

  // async update(
  //   id: string,
  //   updateGardenDto: UpdateGardenDto,
  // ): Promise<GardenEntity> {
  //   try {
  //     const garden = await this.gardenRepository.preload({
  //       id,
  //       ...updateGardenDto,
  //     });
  //     if (!garden) {
  //       console.log('Garden not found with id:', id);
  //       throw new NotFoundException('Garden not found');
  //     }
  //     return this.gardenRepository.save(garden);
  //   } catch (error: unknown) {
  //     if (error instanceof NotFoundException) throw error;

  //     const message = error instanceof Error ? error.message : String(error);

  //     this.logger.error('Error creating garden: ' + message);

  //     throw new InternalServerErrorException(
  //       'Error updating garden: ' + message,
  //     );
  //   }
  // }

  // async remove(id: string): Promise<{ success: boolean; message: string }> {
  //   try {
  //     const garden = await this.findOne(id);
  //     await this.gardenRepository.remove(garden);
  //     return { success: true, message: `Garden with id ${id} removed.` };
  //   } catch (error: unknown) {
  //     if (error instanceof NotFoundException) throw error;

  //     const message = error instanceof Error ? error.message : String(error);

  //     this.logger.error('Error creating garden: ' + message);

  //     throw new InternalServerErrorException(
  //       'Error removing garden: ' + message,
  //     );
  //   }
  // }

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

      this.logger.error('Error creating garden: ' + message);

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

      if (!gardens) {
        this.logger.error(`No gardens found for this user ${userId}`);
        throw new NotFoundException(`No gardens found for this user ${userId}`);
      }

      return gardens;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;

      const message = error instanceof Error ? error.message : String(error);

      this.logger.error('Error fetching user gardens: ' + message);

      throw new InternalServerErrorException(
        'Error fetching user gardens: ' + message,
      );
    }
  }

  async getUserGarden(userId: string, gardenId: string): Promise<GardenEntity> {
    try {
      const garden = await this.gardenRepository.findOne({
        where: { id: gardenId, user: { id: userId } },
      });

      if (!garden) {
        const msg = `Garden with id ${gardenId} not found for user ${userId}`;
        this.logger.error(msg);
        throw new NotFoundException(msg);
      }

      return garden;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;

      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error fetching garden ${gardenId} for user ${userId}: ${message}`,
      );
      throw new InternalServerErrorException(
        `Error fetching garden ${gardenId} for user ${userId}: ${message}`,
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
        this.logger.error(
          `Garden with id ${gardenId} not found for user with id ${userId}`,
        );

        throw new NotFoundException(
          `Garden with id ${gardenId} not found for user with id ${userId}`,
        );
      }

      Object.assign(garden, data);

      return await this.gardenRepository.save(garden);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;

      const message = error instanceof Error ? error.message : String(error);

      this.logger.error('Error editing user gardens: ' + message);

      throw new InternalServerErrorException(
        'Error editing user gardens: ' + message,
      );
    }
  }

  async removeUserGarden(
    userId: string,
    gardenId: string,
  ): Promise<{ message: string }> {
    try {
      const garden = await this.gardenRepository.findOne({
        where: {
          id: gardenId,
          user: {
            id: userId,
          },
        },
      });

      if (!garden) {
        this.logger.error(
          `Garden with id ${gardenId} not found for user with id ${userId}`,
        );
        throw new NotFoundException(
          `Garden with id ${gardenId} not found for user with id ${userId}`,
        );
      }

      await this.gardenRepository.remove(garden);

      return { message: 'Garden deleted successfully' };
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;

      const message = error instanceof Error ? error.message : String(error);

      this.logger.error('Error removing user gardens: ' + message);

      throw new InternalServerErrorException(
        'Error removing garden: ' + message,
      );
    }
  }
}
