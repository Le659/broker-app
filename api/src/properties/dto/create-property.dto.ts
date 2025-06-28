import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Rua das Flores, 123' })
  @IsString()
  address!: string;

  @ApiProperty({ example: 120.5 })
  @IsNumber()
  area!: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  bedrooms!: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  bathrooms!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  parking!: number;

  @ApiPropertyOptional({ example: 'POINT(-51.9392 -23.5505)' })
  @IsOptional()
  @IsString()
  geom?:null | string;
}
