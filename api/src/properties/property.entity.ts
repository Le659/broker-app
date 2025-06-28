// broker-app/api/src/properties/property.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Comparable } from './comparable.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  address!: string;

  @Column('numeric')
  area!: number;

  @Column('int')
  bedrooms!: number;

  @Column('int')
  bathrooms!: number;

  @Column('int')
  parking!: number;

  // Passa a aceitar null
  @Column({ type: 'varchar', nullable: true })
  geom!: string | null;

  @OneToMany(() => Comparable, (comp) => comp.property, { cascade: true })
  comparables!: Comparable[];
}
