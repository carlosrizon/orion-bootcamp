import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

/**
 * Entidade com informações relacionadas a histórias da Marvel
 */
@Entity('stories')
export default class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  idMarvel: number;

  @Column({ type: 'varchar', length: 256 })
  enTitle: string;

  @Column({ type: 'varchar', length: 256, default: null })
  ptTitle: string;

  @Column({ type: 'varchar', length: 2048, default: null })
  description: string;

  @Column({ type: 'varchar', length: 256, default: null })
  thumb: string;

  @Column({ type: 'varchar', length: 256, default: null })
  link: string;

  @Column({ default: false })
  isTranslated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdate: Date;
}
