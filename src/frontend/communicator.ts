import { Canvas } from './canvas.js';

export class Communicator {
  private socket: WebSocket;
  private subscriptions: { [key: string]: (data: any) => boolean } = {};
  private canvas: Canvas | undefined = undefined;

  constructor(ip: string) {
    this.socket = new WebSocket(ip);
    this.socket.onmessage = (message: MessageEvent) =>
      this.messageParse(message);
  }

  public setCanvas(canvas: Canvas) {
    this.canvas = canvas;
  }

  public sendJson(event: string, data: unknown) {
    this.socket.send(
      JSON.stringify({
        event: event,
        data: data,
      }),
    );
  }

  public subscribeMessage(event: string, func: (data: any) => boolean): void {
    if (event in this.subscriptions) {
      console.error('There is already a subscription bound to ' + event);
      return;
    }
    this.subscriptions[event] = func;
  }

  private messageParse(message: MessageEvent): void {
    interface SocketMessage {
      event: string;
      data: unknown;
    }

    const json: SocketMessage = JSON.parse(
      message.data as string,
    ) as SocketMessage;
    const event: string = json.event;
    const data: any = json.data;

    if (event in this.subscriptions) {
      if (this.subscriptions[event](data) && this.canvas) {
        this.canvas.update();
      }
    }
  }
}
