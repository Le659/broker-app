import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './property.entity';

@ApiTags('properties')
@Controller('properties')
export class PropertyController {
  constructor(private readonly service: PropertyService) {}

  @ApiOperation({ summary: 'Listar todas as propriedades' })
  @ApiResponse({ status: 200, type: [Property] })
  @Get()
  findAll(): Promise<Property[]> {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Obter uma propriedade por ID' })
  @ApiResponse({ status: 200, type: Property })
  @ApiResponse({ status: 404, description: 'Não encontrada' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Property> {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Criar nova propriedade' })
  @ApiResponse({ status: 201, type: Property })
  @Post()
  create(@Body() dto: CreatePropertyDto): Promise<Property> {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Atualizar propriedade por ID' })
  @ApiResponse({ status: 200, type: Property })
  @ApiResponse({ status: 404, description: 'Não encontrada' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePropertyDto,
  ): Promise<Property> {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Remover propriedade por ID' })
  @ApiResponse({ status: 204, description: 'Removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Não encontrada' })
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
