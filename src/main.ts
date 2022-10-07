import { NestFactory } from "@nestjs/core";
import { config } from "./config";
import { AppModule } from "./app.module";
import { bot } from "./bot";
import { WsAdapter } from "@nestjs/platform-ws";
async function init() {
  await bot
    .on("system.login.slider", function (e) {
      console.log("输入ticket：");
      process.stdin.once("data", (ticket) =>
        this.submitSlider(String(ticket).trim())
      );
    })
    .login(config.password);
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(8080);
}
init();
