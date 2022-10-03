import { NestFactory } from "@nestjs/core";
import { existsSync, readFileSync } from "fs";
import { argv } from "process";
import { AppModule } from "./app.module";
import { bot } from "./bot";
let config = { qq: 0, password: "" };
if (existsSync("./config.json")) {
  config = JSON.parse(readFileSync("./config.json").toString());
} else if (argv.length > 2) {
  config = { qq: Number.parseInt(argv[2]), password: argv[3] };
}

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
