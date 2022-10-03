import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  blog_id: number;

  @Column()
  title: string;

  @Column()
  create_time: Date;

  @Column()
  last_modify: Date;

  @Column()
  brief: string;
}
