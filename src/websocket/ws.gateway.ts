import { Catch } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Quotable, Sendable } from "oicq";
import { WebSocket, WebSocketServer } from "ws";
import { bot } from "../bot";

@WebSocketGateway(8081)
export class WsGateway
  implements
    OnGatewayConnection<WebSocket>,
    OnGatewayDisconnect<WebSocket>,
    OnGatewayInit<WebSocketServer>
{
  private server: WebSocketServer;
  private clients: WebSocket[] = [];

  afterInit(server: WebSocketServer) {
    this.server = server;
    bot.on("message.private", (event) =>
      this.broadcast({ event: "message.private", data: event })
    );
  }

  handleConnection(client: WebSocket) {
    this.clients.push(client);
  }

  handleDisconnect(client: WebSocket) {
    this.clients.splice(this.clients.indexOf(client), 1);
  }

  @SubscribeMessage("sendPrivateMsg")
  async privateMsg(
    @MessageBody()
    data: {
      userId: number;
      message: Sendable;
      source?: Quotable;
    }
  ): Promise<any> {
    try {
      const { userId, message, source } = data;
      const ret = await bot.sendPrivateMsg(userId, message, source);
      return {
        event: "ok",
        data: ret,
      };
    } catch (e) {
      return {
        event: "error",
        data: e,
      };
    }
  }
  private broadcast(message: Object) {
    const broadCastMessage = JSON.stringify(message);
    for (const c of this.clients) {
      c.send(broadCastMessage);
    }
  }
}
