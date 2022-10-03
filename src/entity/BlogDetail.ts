import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class BlogDetail {
  @PrimaryColumn()
  blog_id: number;

  @Column("text")
  content: string;
}
