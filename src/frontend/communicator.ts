export class Communicator {
  private socket: WebSocket;

  constructor(ip: string) {
    this.socket = new WebSocket(ip);
  }

  public sendJson(event: string, data: { [key: string]: any }) {
    this.socket.send(
      JSON.stringify({
        event: event,
        data: data,
      }),
    );
  }
}
