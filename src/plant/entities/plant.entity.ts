import { CareLogEntity } from 'src/care-log/entities/care-log.entity';
import { GardenEntity } from 'src/garden/entities/garden.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('plants')
export class PlantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GardenEntity, (garden) => garden.plants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'garden_id' })
  garden: GardenEntity;

  @OneToMany(() => CareLogEntity, (careLog) => careLog.plant)
  careLogs: CareLogEntity[];

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
