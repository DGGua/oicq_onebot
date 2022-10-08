import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Quotable, Sendable } from "oicq";
import { AppService } from "./app.service";
import { bot } from "./bot";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/sendGroupMsg")
  sendGroupMsg(
    @Body() body: { group_id: number; message: Sendable; source?: Quotable }
  ) {
    const { group_id, message, source } = body;
    bot.sendGroupMsg(group_id, message, source);
    return "ok";
  }
  @Post("/sendPrivateMsg")
  sendPrivateMsg(
    @Body() body: { user_id: number; message: Sendable; source?: Quotable }
  ) {
    const { user_id, message, source } = body;

    bot.sendPrivateMsg(user_id, message, source);
    return "ok";
  }
}
