import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

import { PointService } from '../services/app.pointService';
import { RegionService } from '../services/app.regionService';
import { PointStruct, RegionStruct } from '../frontend/types';

@WebSocketGateway()
export class Gateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private pointService: PointService,
    private regionService: RegionService,
  ) {}

  @SubscribeMessage('PointCreation')
  pointCreation(_client: WebSocket, data: { iden: string; data: PointStruct }) {
    this.pointService.add(data.iden, data.data);
    this.broadcast('PointCreation', data);
  }

  @SubscribeMessage('PointModified')
  pointModified(_client: WebSocket, data: { iden: string; data: PointStruct }) {
    this.pointService.update(data.iden, data.data);
    this.broadcast('PointModified', data);
  }

  @SubscribeMessage('PointDeletion')
  pointDeletion(_client: WebSocket, data: { iden: string }) {
    this.pointService.remove(data.iden);
    this.broadcast('PointDeletion', data);
  }

  @SubscribeMessage('RegionCreation')
  regionCreation(
    _client: WebSocket,
    data: { name: string; data: RegionStruct },
  ) {
    this.regionService.add(data.name, data.data);
    this.broadcast('RegionCreation', data);
  }

  @SubscribeMessage('RegionModified')
  regionModified(
    _client: WebSocket,
    data: { name: string; data: RegionStruct },
  ) {
    this.regionService.update(data.name, data.data);
    this.broadcast('RegionModified', data);
  }

  @SubscribeMessage('RegionDeletion')
  regionDeletion(_client: WebSocket, data: { name: string }) {
    this.regionService.remove(data.name);
    this.broadcast('RegionDeletion', data);
  }

  private broadcast(event: string, data: any): void {
    this.server.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN)
        client.send(JSON.stringify({ event: event, data: data as unknown }));
    });
  }
}
