import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCareLogDto } from './dto/create-care-log.dto';
import { UpdateCareLogDto } from './dto/update-care-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CareLogEntity } from './entities/care-log.entity';
import { Repository } from 'typeorm';
import { PlantEntity } from 'src/plant/entities/plant.entity';

@Injectable()
export class CareLogService {
  constructor(
    @InjectRepository(CareLogEntity)
    private readonly careLogRepository: Repository<CareLogEntity>,
    @InjectRepository(PlantEntity)
    private readonly plantRepository: Repository<PlantEntity>,
  ) {}

  async create(
    plantId: string,
    data: CreateCareLogDto,
  ): Promise<CareLogEntity> {
    const plant = await this.plantRepository.findOne({
      where: {
        id: plantId,
      },
    });

    if (!plant) {
      throw new NotFoundException(`Plant with id ${plantId} not found`);
    }

    const log = this.careLogRepository.create({ ...data, plant });

    return await this.careLogRepository.save(log);
  }

  async getAll(plantId: string): Promise<CareLogEntity[]> {
    return await this.careLogRepository.find({
      where: {
        plant: {
          id: plantId,
        },
      },
    });
  }

  async getOne(plantId: string, id: string): Promise<CareLogEntity> {
    const log = await this.careLogRepository.findOne({
      where: {
        id: id,
        plant: {
          id: plantId,
        },
      },
    });

    if (!log) {
      throw new NotFoundException(`No logs found for this plant ${plantId}`);
    }

    return log;
  }

  async update(
    id: string,
    plantId: string,
    data: UpdateCareLogDto,
  ): Promise<CareLogEntity> {
    const log = await this.getOne(plantId, id);

    Object.assign(log, data);

    return this.careLogRepository.save(log);
  }

  async remove(id: string, plantId: string): Promise<{ message: string }> {
    const log = await this.getOne(plantId, id);

    await this.careLogRepository.remove(log);

    return { message: 'Log successfully deleted' };
  }
}
