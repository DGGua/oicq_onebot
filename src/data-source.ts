import "reflect-metadata";
import { DataSource } from "typeorm";
import { Blog } from "./entity/Blog";
import { BlogDetail } from "./entity/BlogDetail";
import { Image } from "./entity/Image";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Blog, BlogDetail, Image],
  migrations: [],
  subscribers: [],
});
