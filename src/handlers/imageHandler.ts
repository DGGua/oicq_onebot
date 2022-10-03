import { randomInt } from "crypto";
import { Router } from "express";
import { readFileSync, writeFileSync } from "fs";
import multer from "multer";
import { tmpdir } from "os";
import { AppDataSource } from "../data-source";
import { Image } from "../entity/Image";
import { resData } from "../template/resTemp";
const imageHandler = Router();
const upload = multer({ dest: tmpdir() });
const MAX_IMAGE = 1e9;
const ALLOWTYPE = ["image/jpeg", "image/png", "image/jpg"]
imageHandler.post("/uploadImage", upload.single("image"), async (req, res) => {
    const file = req.file;
    if (!ALLOWTYPE.includes(file.mimetype)) {
        res.send(resData(400002));
        return;
    }
    let id = randomInt(MAX_IMAGE);
    while (
        (await AppDataSource.manager.find(Image, { where: { image_id: id } }))
            .length != 0
    ) {
        id++;
    }
    let image = new Image(id,
        readFileSync(file.path));
    await AppDataSource.manager.insert(Image, image)
    res.send(resData(200000, id.toString(16).toUpperCase()))
});
imageHandler.get("/get/:imageId", async (req, res) => {
    const id = Number.parseInt(req.params.imageId, 16)
    if (isNaN(id)) {
        res.send(400003)
        return;
    }
    const image = await AppDataSource.manager.find(Image, { where: { image_id: id } })
    if (image.length == 0) {
        res.send(400003)
        return;
    }
    res.end(image[0].data, "binary")
})

export default imageHandler