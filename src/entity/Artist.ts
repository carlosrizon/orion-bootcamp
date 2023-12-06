import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entidade com informações relacionadas a artistas parceiros
 */
@Entity('artists')
export default class Artist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 250, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  fullName: string;

  @Column({ type: 'varchar', length: 256 })
  artSampleURL: string;
}
