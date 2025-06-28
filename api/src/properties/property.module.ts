import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { Property } from './property.entity';
import { Comparable } from './comparable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Comparable])],
  controllers: [PropertyController],
  providers: [PropertyService]
})
export class PropertyModule {}
