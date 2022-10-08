import { createClient } from "oicq";
import { config } from "./config";
export const bot = createClient(config.qq);
bot.on("request.friend.add", (event) => {
  event.approve();
});
