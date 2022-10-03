import { createClient } from "oicq";
import { config } from "./config";
export const bot = createClient(config.qq);
