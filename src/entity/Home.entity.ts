import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @See https://typeorm.io/#features
@Entity()
export class Home {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
