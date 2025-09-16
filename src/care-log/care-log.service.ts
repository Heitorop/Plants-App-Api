import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCareLogDto } from './dto/create-care-log.dto';
import { UpdateCareLogDto } from './dto/update-care-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CareLogEntity } from './entities/care-log.entity';
import { Repository } from 'typeorm';
import { PlantEntity } from 'src/plant/entities/plant.entity';

@Injectable()
export class CareLogService {
  private readonly logger = new Logger();
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
    try {
      const plant = await this.plantRepository.findOne({
        where: {
          id: plantId,
        },
      });

      if (!plant) {
        this.logger.error(`Plant with id ${plantId} not found`);
        throw new NotFoundException(`Plant with id ${plantId} not found`);
      }

      const log = this.careLogRepository.create({ ...data, plant });

      return await this.careLogRepository.save(log);
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;

      const message = error instanceof Error ? error.message : String(error);

      this.logger.error('Error creating plant: ' + message);

      throw new InternalServerErrorException(
        'Error creating plant: ' + message,
      );
    }
  }

  async getAll(plantId: string): Promise<CareLogEntity[]> {
    try {
      return await this.careLogRepository.find({
        where: {
          plant: {
            id: plantId,
          },
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.error('Error fetching logs: ' + message);

      throw new InternalServerErrorException('Error fetching logs: ' + message);
    }
  }

  async getOne(plantId: string, id: string): Promise<CareLogEntity> {
    try {
      const log = await this.careLogRepository.findOne({
        where: {
          id: id,
          plant: {
            id: plantId,
          },
        },
      });

      if (!log) {
        this.logger.error(`No logs found for this plant ${plantId}`);
        throw new NotFoundException(`No logs found for this plant ${plantId}`);
      }

      return log;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) throw error;

      const message = error instanceof Error ? error.message : String(error);

      this.logger.error(`Error fetching log ${id}: ` + message);

      throw new InternalServerErrorException(
        `Error fetching log ${id}: ` + message,
      );
    }
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
