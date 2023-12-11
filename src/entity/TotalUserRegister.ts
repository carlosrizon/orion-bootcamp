import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

/**
 * Entidade con informações relacionadas às métricas de ativação de registros dos usuários
 */
@Entity('total_registrations_completed')
export default class TotalRegistrations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  activeRegistrations: number;

  @Column({ default: 0 })
  inactiveRegistrations: number;

  @Column({ default: 0 })
  totalRegistrations: number;

  @UpdateDateColumn()
  lastUpdate: Date;
}
