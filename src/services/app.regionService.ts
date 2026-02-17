import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { RegionStruct } from '../frontend/types';

@Injectable()
export class RegionService {
  private regions: { [key: string]: RegionStruct } = {};

  public add(name: string, region: RegionStruct): boolean {
    if (name in this.regions) return false;

    this.regions[name] = region;
    return true;
  }

  public update(name: string, region: RegionStruct): boolean {
    if (!(name in this.regions)) return false;

    this.regions[name] = region;
    return true;
  }

  public remove(name: string) {
    if (name in this.regions) delete this.regions[name];
  }
}
