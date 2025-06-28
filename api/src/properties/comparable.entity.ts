// broker-app/api/src/properties/comparable.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Property } from './property.entity';

@Entity()
export class Comparable {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Property, (prop) => prop.comparables, {
    onDelete: 'CASCADE',
  })
  property!: Property;

  @Column('numeric')
  price!: number;

  // troque timestamp por datetime para o SQLite
  @Column({ type: 'datetime' })
  listedAt!: Date;
}
