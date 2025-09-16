import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlantDto } from './dto/create-plant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlantEntity } from './entities/plant.entity';
import { Repository } from 'typeorm';
import { GardenService } from 'src/garden/garden.service';
import { UpdatePlantDto } from './dto/update-plant.dto';

@Injectable()
export class PlantService {
  private readonly logger = new Logger(PlantService.name);
  constructor(
    @InjectRepository(PlantEntity)
    private readonly plantRepository: Repository<PlantEntity>,
    @Inject(forwardRef(() => GardenService))
    private readonly gardenService: GardenService,
  ) {}

  async getAllUserPlants(
    userId: string,
    gardenId: string,
  ): Promise<PlantEntity[]> {
    try {
      const plants = await this.plantRepository.find({
        where: {
          garden: {
            id: gardenId,
            user: {
              id: userId,
            },
          },
        },
      });
      return plants;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(
        `Error fetching plants for garden: ${gardenId} ` + message,
      );

      throw new InternalServerErrorException(
        `Error fetching plants for garden: ${gardenId} ` + message,
      );
    }
  }
  async getUserPlant(
    userId: string,
    gardenId: string,
    plantId: string,
  ): Promise<PlantEntity> {
    try {
      const plant = await this.plantRepository.findOne({
        where: {
          id: plantId,
          garden: {
            id: gardenId,
            user: {
              id: userId,
            },
          },
        },
        relations: ['careLogs'],
      });

      if (!plant) {
        this.logger.error(
          `Plant with id ${plantId} not found for garden with id ${gardenId}`,
        );

        throw new NotFoundException(
          `Plant with id ${plantId} not found for garden with id ${gardenId}`,
        );
      }

      return plant;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;

      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(
        `Plant with id ${plantId} not found for garden with id ${gardenId} ` +
          message,
      );

      throw new InternalServerErrorException(
        `Plant with id ${plantId} not found for garden with id ${gardenId} ` +
          message,
      );
    }
  }

  async createUserPlant(
    userId: string,
    gardenId: string,
    data: CreatePlantDto,
  ) {
    try {
      const garden = await this.gardenService.getUserGarden(userId, gardenId);

      const plant = this.plantRepository.create({ ...data, garden });

      return await this.plantRepository.save(plant);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error('Error creating plant: ' + message);

      throw new InternalServerErrorException(
        'Error creating plant: ' + message,
      );
    }
  }
  async updateUserPlant(
    userId: string,
    gardenId: string,
    plantId: string,
    data: UpdatePlantDto,
  ): Promise<PlantEntity> {
    try {
      const plant = await this.getUserPlant(userId, gardenId, plantId);

      Object.assign(plant, data);

      return this.plantRepository.save(plant);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;

      const message = error instanceof Error ? error.message : String(error);

      this.logger.error('Error editing garden plant: ' + message);

      throw new InternalServerErrorException(
        'Error editing garden plant: ' + message,
      );
    }
  }
  async removeUserPlant(
    userId: string,
    gardenId: string,
    plantId: string,
  ): Promise<{ message: string }> {
    const plant = await this.getUserPlant(userId, gardenId, plantId);

    await this.plantRepository.remove(plant);

    return { message: 'Plant successfully deleted' };
  }
}
