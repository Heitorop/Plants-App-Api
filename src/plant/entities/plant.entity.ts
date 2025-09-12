import { GardenEntity } from 'src/garden/entities/garden.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('plants')
export class PlantEntity {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => GardenEntity, (garden) => garden.plants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'garden_id' })
  garden: GardenEntity;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  species: string;

  @Column({
    type: 'varchar',
  })
  nickname: string;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updated_at: Date;
}
