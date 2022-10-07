import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { WebSocket } from "ws";

@WebSocketGateway(8081)
export class WsGateway
  implements OnGatewayConnection<WebSocket>, OnGatewayDisconnect<WebSocket>
{
  private clients: WebSocket[] = [];

  handleConnection(client: WebSocket, ...args: any[]) {
    this.clients.push(client);
  }

  handleDisconnect(client: WebSocket) {
    this.clients.splice(this.clients.indexOf(client), 1);
  }
  @SubscribeMessage("hello")
  hello(@MessageBody() data: any): any {
    return {
      event: "hello",
      data: data,
      msg: "rustfisher.com",
    };
  }
  @SubscribeMessage("hello2")
  hello2(@MessageBody() data: any, @ConnectedSocket() client: WebSocket): any {
    console.log("收到消息 client:", client);
    client.send(JSON.stringify({ event: "tmp", data: "这里是个临时信息" }));
    return { event: "hello2", data: data };
  }
  private broadcast(message: any) {
    const broadCastMessage = JSON.stringify(message);
    for (const c of this.clients) {
      c.send(broadCastMessage);
    }
  }
}
