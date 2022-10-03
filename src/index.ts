import { AppDataSource } from "./data-source";
import { Blog } from "./entity/Blog";
import express from "express";
import cors from "cors";
import { BlogDetail } from "./entity/BlogDetail";
import { json } from "body-parser";
import { resData } from "./template/resTemp";
import config from "./config.json";
import morgan from "morgan";
import imageHandler from "./handlers/imageHandler";
const app = express();
app.use(cors());
app.use(json());
app.use(morgan("common"));

async function init() {
  await AppDataSource.initialize();
}
app.get("/blog/list", async (req, res) => {
  const blogs = await AppDataSource.manager.find(Blog, {
    order: { last_modify: "DESC" },
  });
  res.send(resData(200000, blogs));
});
app.get("/blog/detail", async (req, res) => {
  const id = req.query["id"];
  if (typeof id != "string") return;

  const blog = await AppDataSource.manager.findOneBy(Blog, {
    blog_id: Number.parseInt(id),
  });

  const blogDetail = await AppDataSource.manager.findOneBy(BlogDetail, {
    blog_id: Number.parseInt(id),
  });

  res.send(resData(200000, { ...blog, ...blogDetail }));
});
app.post<{}, any, { title: string; content: string; brief?: string }>(
  "/blog/create",
  async (req, res) => {
    const { title, content, brief = content } = req.body;
    const blog = new Blog();
    blog.title = title;
    blog.brief = brief;
    blog.create_time = new Date();
    blog.last_modify = new Date();
    await AppDataSource.manager.insert(Blog, blog);

    const blogDetail = new BlogDetail();
    blogDetail.blog_id = blog.blog_id;
    blogDetail.content = content;
    await AppDataSource.manager.insert(BlogDetail, blogDetail);

    res.send(resData(200000, blog.blog_id));
  }
);
app.post<{}, any, { content: string; secret: string }>(
  "/temp/createBlog",
  async (req, res) => {
    const { secret, content } = req.body;
    if (secret != config.secret) {
      res.send(resData(400001));
      return;
    }

    const firstRowEnd = content.indexOf("\n");
    let title = content.slice(0, firstRowEnd);
    if (title.startsWith("# ")) {
      title = title.slice(2);
    }
    let body = content.slice(firstRowEnd + 1);

    const blog = new Blog();
    blog.title = title;
    blog.brief = body.slice(0, body.indexOf("\n"));
    blog.create_time = new Date();
    blog.last_modify = new Date();
    await AppDataSource.manager.insert(Blog, blog);

    const blogDetail = new BlogDetail();
    blogDetail.blog_id = blog.blog_id;
    blogDetail.content = content;
    await AppDataSource.manager.insert(BlogDetail, blogDetail);

    res.send(resData(200000, blog.blog_id));
  }
);
app.post<{}, any, { id: string; content: string; secret: string }>(
  "/temp/updateBlog",
  async (req, res) => {
    const { id, secret, content } = req.body;
    if (secret != config.secret) {
      res.send(resData(400001));
      return;
    }

    const firstRowEnd = content.indexOf("\n");
    let title = content.slice(0, firstRowEnd);
    if (title.startsWith("# ")) {
      title = title.slice(2);
    }
    let body = content.slice(firstRowEnd + 1);

    const blog = new Blog();
    blog.title = title;
    blog.brief = body.slice(0, body.indexOf("\n"));
    blog.last_modify = new Date();
    await AppDataSource.manager.update(Blog, id, blog);

    const blogDetail = new BlogDetail();
    blogDetail.content = body;
    await AppDataSource.manager.update(BlogDetail, id, blogDetail);

    res.send(resData(200000, blog.blog_id));
  }
);
app.use("/image", imageHandler)
init().then(() => {
  app.listen(80);
});
app.all("*", () => console.log("hi"));
