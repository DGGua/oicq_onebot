import { createClient } from "oicq";
import config from "./config.json";
export const bot = createClient(config.qq);
