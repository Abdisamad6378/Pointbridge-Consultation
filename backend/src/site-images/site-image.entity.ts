import { Column, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['key'])
export class SiteImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Stable lookup key used by the frontend, e.g. "hero.slide.1".
  @Column({ length: 100 })
  key: string;

  @Column({ length: 150 })
  label: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ length: 50, default: 'other' })
  category: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
