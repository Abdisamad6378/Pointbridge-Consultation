import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

export const USER_ROLES = ['admin', 'user'] as const;
export type UserRole = (typeof USER_ROLES)[number];

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  organization: string;

  @Column({ type: 'varchar', default: 'user' })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  // Set when a profile photo is uploaded; also versions the avatar URL for caching.
  @Column({ type: 'timestamp', nullable: true })
  avatarUpdatedAt: Date | null;
}

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  createdAt: string;
  avatarUrl: string | null;
};

export function toPublicUser(user: User): PublicUser {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    organization: user.organization ?? '',
    role: user.role,
    createdAt: new Date(user.createdAt).toISOString(),
    avatarUrl: user.avatarUpdatedAt
      ? `/api/users/${user.id}/avatar?v=${new Date(user.avatarUpdatedAt).getTime()}`
      : null,
  };
}
