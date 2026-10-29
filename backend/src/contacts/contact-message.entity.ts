import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const CONTACT_STATUSES = ['new', 'read', 'replied'] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

@Entity()
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  org: string | null;

  @Column({ length: 150 })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 20, default: 'new' })
  status: ContactStatus;

  @CreateDateColumn()
  createdAt: Date;
}
