import { existsSync, readFileSync } from "fs";
import { argv } from "process";

let config = { qq: 0, password: "" };
if (existsSync("./config.json")) {
  config = JSON.parse(readFileSync("./config.json").toString());
} else if (argv.length > 2) {
  config = { qq: Number.parseInt(argv[2]), password: argv[3] };
}
export { config };
