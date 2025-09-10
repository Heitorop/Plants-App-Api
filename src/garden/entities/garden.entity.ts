import { LocationEnum } from 'src/common/enums/location.enum';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
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

  @OneToOne(() => UserEntity, (user) => user.id, { cascade: true })
  user: UserEntity;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  created_at: Date;
}
