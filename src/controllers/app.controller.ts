import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

import { PointService } from '../services/app.pointService';
import { RegionService } from '../services/app.regionService';

@Controller()
export class BaseController {
  constructor(
    private pointService: PointService,
    private regionService: RegionService,
  ) {}

  @Get()
  get(@Res() res: Response) {
    return res.render('main');
  }

  @Get('data')
  getData(@Res() res: Response) {
    return res.json({
      points: this.pointService.getAll(),
      regions: this.regionService.getAll(),
    });
  }
}
