import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Image {
    @PrimaryColumn()
    image_id: number;

    @Column("blob")
    data: Buffer;


    constructor(image_id: number, data: Buffer) {
        this.image_id = image_id
        this.data = data
    }
}
