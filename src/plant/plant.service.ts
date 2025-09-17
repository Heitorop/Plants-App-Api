import {
  forwardRef,
  Inject,
  Injectable,
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
  }
  async getUserPlant(
    userId: string,
    gardenId: string,
    plantId: string,
  ): Promise<PlantEntity> {
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
      throw new NotFoundException(
        `Plant with id ${plantId} not found for garden with id ${gardenId}`,
      );
    }

    return plant;
  }

  async createUserPlant(
    userId: string,
    gardenId: string,
    data: CreatePlantDto,
  ) {
    const garden = await this.gardenService.getUserGarden(userId, gardenId);

    const plant = this.plantRepository.create({ ...data, garden });

    return await this.plantRepository.save(plant);
  }
  async updateUserPlant(
    userId: string,
    gardenId: string,
    plantId: string,
    data: UpdatePlantDto,
  ): Promise<PlantEntity> {
    const plant = await this.getUserPlant(userId, gardenId, plantId);

    Object.assign(plant, data);

    return this.plantRepository.save(plant);
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
