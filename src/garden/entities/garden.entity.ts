import { LocationEnum } from 'src/common/enums/location.enum';
import { PlantEntity } from 'src/plant/entities/plant.entity';
import { UserEntity } from 'src/user/entities/user.entity';
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

@Entity('gardens')
export class GardenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'enum',
    enum: LocationEnum,
    default: LocationEnum.INDOOR,
  })
  location: LocationEnum;

  @ManyToOne(() => UserEntity, (user) => user.gardens)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => PlantEntity, (plant) => plant.garden, {
    onDelete: 'CASCADE',
  })
  plants: PlantEntity[];

  @CreateDateColumn({
    type: 'timestamptz',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updated_at: Date;
}
