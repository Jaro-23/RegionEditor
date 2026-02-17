import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PointStruct } from '../frontend/types';

@Injectable()
export class PointService {
  private points: { [key: string]: PointStruct } = {};

  public add(iden: string, point: PointStruct): boolean {
    if (iden in this.points) return false;

    this.points[iden] = point;
    return true;
  }

  public update(iden: string, point: PointStruct): boolean {
    if (!(iden in this.points)) return false;

    this.points[iden] = point;
    return true;
  }

  public remove(iden: string) {
    if (iden in this.points) delete this.points[iden];
  }

  public getAll() {
    return this.points;
  }
}
