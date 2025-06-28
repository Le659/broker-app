import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, IsOptional } from 'class-validator';

export class UpdatePropertyDto {
  @ApiPropertyOptional({ example: 'Rua Nova, 456' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 150 })
  @IsOptional()
  @IsNumber()
  area?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsInt()
  bedrooms?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  bathrooms?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  parking?: number;

  @ApiPropertyOptional({ example: 'POINT(-51.9500 -23.5600)' })
  @IsOptional()
  @IsString()
  geom?: string;
}
