import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';

/**
 * Entidade com informações relacionadas às atualizações diárias das categorias da Marvel
 */
@Entity('categories_updates')
export default class CategoryUpdate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  categoryAlias: string;

  @Column({ default: null })
  specifiedDate: Date;

  @Column({ type: 'int' })
  totalUpdated: number;

  @CreateDateColumn()
  updateDate: Date;
}
