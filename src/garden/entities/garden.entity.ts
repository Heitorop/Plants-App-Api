import { LocationEnum } from 'src/common/enums/location.enum';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @ManyToOne(() => UserEntity, (user) => user.gardens, { onDelete: 'CASCADE' })
  user: UserEntity;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  created_at: Date;
}
