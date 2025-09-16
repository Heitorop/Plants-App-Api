import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { CreateCareLogDto } from 'src/care-log/dto/create-care-log.dto';
import { CareLogEntity } from 'src/care-log/entities/care-log.entity';
import { CareLogService } from 'src/care-log/care-log.service';
import { UpdateCareLogDto } from 'src/care-log/dto/update-care-log.dto';

@Controller('plants')
export class PlantController {
  constructor(
    @Inject(forwardRef(() => CareLogService))
    private readonly careLogService: CareLogService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Authorization()
  @Post('/:plantId/logs')
  async createLog(
    @Param('plantId') plantId: string,
    @Body() data: CreateCareLogDto,
  ): Promise<CareLogEntity> {
    const log = await this.careLogService.create(plantId, data);
    return log;
  }

  @Authorization()
  @Get('/:plantId/logs')
  async getAllLogs(
    @Param('plantId') plantId: string,
  ): Promise<CareLogEntity[]> {
    const logs = await this.careLogService.getAll(plantId);

    return logs;
  }

  @Authorization()
  @Patch('/:plantId/logs/:logId')
  async updateLog(
    @Param('plantId') plantId: string,
    @Param('logId') logId: string,
    @Body() data: UpdateCareLogDto,
  ): Promise<CareLogEntity> {
    const log = await this.careLogService.update(logId, plantId, data);

    return log;
  }

  @Authorization()
  @Delete('/:plantId/logs/:logId')
  async removeUserPlants(
    @Param('plantId') plantId: string,
    @Param('logId') logId: string,
  ): Promise<{ message: string }> {
    const response = await this.careLogService.remove(logId, plantId);

    return response;
  }
}
