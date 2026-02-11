import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  get(@Res() res: Response) {
    return res.render('main');
  }
}
