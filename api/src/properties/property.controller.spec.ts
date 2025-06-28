import { Test, TestingModule } from '@nestjs/testing';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './property.entity';

describe('PropertyController', () => {
  let controller: PropertyController;
  let service: Partial<Record<keyof PropertyService, jest.Mock>>;

  beforeEach(async () => {
    service = {
      findAll: jest.fn().mockResolvedValue([] as Property[]),
      findOne: jest.fn().mockResolvedValue({ id: 1 } as Property),
      create: jest.fn().mockResolvedValue({ id: 1 } as Property),
      update: jest.fn().mockResolvedValue({ id: 1 } as Property),
      remove: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyController],
      providers: [{ provide: PropertyService, useValue: service }],
    }).compile();

    controller = module.get<PropertyController>(PropertyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('returns an array', async () => {
      await expect(controller.findAll()).resolves.toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns one property', async () => {
      await expect(controller.findOne(1)).resolves.toEqual({ id: 1 });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('creates a property', async () => {
      const dto: CreatePropertyDto = {
        address: 'Rua Teste',
        area: 50,
        bedrooms: 1,
        bathrooms: 1,
        parking: 0,
        geom: null,
      };
      await expect(controller.create(dto)).resolves.toEqual({ id: 1 });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('updates a property', async () => {
      const dto: UpdatePropertyDto = { bedrooms: 2 };
      await expect(controller.update(1, dto)).resolves.toEqual({ id: 1 });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('removes a property', async () => {
      await expect(controller.remove(1)).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
