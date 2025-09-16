import { Controller } from '@nestjs/common';
import { CareLogService } from './care-log.service';

@Controller('care-log')
export class CareLogController {
  constructor(private readonly careLogService: CareLogService) {}
}
