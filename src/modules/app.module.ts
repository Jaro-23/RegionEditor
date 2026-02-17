import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { PointService } from '../services/app.pointService';
import { RegionService } from '../services/app.regionService';
import { Gateway } from '../gateways/app.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PointService, RegionService, Gateway],
})
export class AppModule {}
