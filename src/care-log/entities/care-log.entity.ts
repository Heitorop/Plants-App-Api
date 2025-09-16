import { ActionTypeEnum } from 'src/common/enums/action-type.enum';
import { PlantEntity } from 'src/plant/entities/plant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('care-logs')
export class CareLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ActionTypeEnum,
  })
  action_type: ActionTypeEnum;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes: string;

  @ManyToOne(() => PlantEntity, (plant) => plant.careLogs)
  @JoinColumn({
    name: 'plant_id',
  })
  plant: PlantEntity;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updated_at: Date;
}
