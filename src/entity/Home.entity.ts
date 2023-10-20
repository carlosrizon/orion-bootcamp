import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

// @See https://typeorm.io/#features
// @See https://orkhan.gitbook.io/typeorm/docs/listeners-and-subscribers
@Entity()
export class Home {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isConfirmation: boolean;

  @Column()
  createdAt: Date;

  @BeforeInsert()
  createdAtDate() {
    this.createdAt = new Date();
  }
}
