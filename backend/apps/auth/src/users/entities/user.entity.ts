import { SocialMedia } from '@app/common';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

export enum AuthProvider {
  GOOGLE = 'google',
  LOCAL = 'local',
}

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  OWNER = 'owner',
  GUEST = 'guest',
  STAFF = 'staff',
  TRAINER = 'trainer',
  MEMBER = 'member',
  OTHER = 'other',
}

@Entity()
export class User {
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dateOfBirth: string;

  @Column()
  location: string;

  @Column()
  gymId: string;

  @Column()
  gymLocationId: string;

  @Column()
  address: string;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.LOCAL })
  provider: AuthProvider;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string | undefined;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isSubscribed: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'jsonb', nullable: true })
  socialMedia?: SocialMedia | undefined;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
