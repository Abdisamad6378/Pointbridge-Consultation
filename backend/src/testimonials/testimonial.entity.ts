import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  // The person's title or company, shown under their name.
  @Column({ length: 150 })
  role: string;

  @Column({ type: 'text' })
  quote: string;

  @Column({ type: 'text', nullable: true })
  image: string | null;

  @Column({ default: false })
  approved: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
