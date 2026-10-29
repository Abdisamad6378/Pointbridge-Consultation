import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity.js';

// Kept out of the user table so normal user queries never load image bytes.
@Entity()
export class UserAvatar {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'bytea' })
  data: Buffer;

  @Column({ length: 20 })
  mimeType: string;
}
