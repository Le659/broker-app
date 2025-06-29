import { 
  Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@ApiTags('properties')
@Controller('properties')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de imóveis' })
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Imóvel encontrado' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.propertyService.findOne(id);
  }

  @Post()
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({ status: 201, description: 'Imóvel criado' })
  create(@Body() dto: CreatePropertyDto) {
    return this.propertyService.create(dto);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePropertyDto })
  @ApiResponse({ status: 200, description: 'Imóvel atualizado' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePropertyDto) {
    return this.propertyService.update(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204, description: 'Imóvel removido' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.propertyService.remove(id);
  }
}
