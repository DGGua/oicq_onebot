import { NestFactory } from "@nestjs/core";
import { config } from "./config";
import { AppModule } from "./app.module";
import { bot } from "./bot";
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
  await app.listen(8080, "localhost");
}
init();
