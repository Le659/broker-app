// broker-app/api/src/properties/property.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, CACHE_MANAGER, NotFoundException } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PropertyService } from './property.service';
import { Property } from './property.entity';

// helper “any” para não reclamar de campos extras
const makeProp = (overrides: any = {}): Property =>
  ({
    id: 0,
    address: '',
    // nome e tipo exatos aqui não importam, pois estamos forçando com “as any”
    price: 0,
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as any;

type MockRepo = Partial<Record<keyof Repository<Property>, jest.Mock>>;

describe('PropertyService', () => {
  let service: PropertyService;
  let mockRepo: MockRepo;
  let mockCache: { del: jest.Mock };
  let mockLogger: Partial<Record<keyof PinoLogger, jest.Mock>>;

  beforeEach(async () => {
    mockRepo = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    mockCache = { del: jest.fn() };
    mockLogger = {
      setContext: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        PropertyService,
        { provide: getRepositoryToken(Property), useValue: mockRepo },
        { provide: PinoLogger, useValue: mockLogger },
      ],
    })
      .overrideProvider(CACHE_MANAGER)
      .useValue(mockCache)
      .compile();

    service = module.get<PropertyService>(PropertyService);
  });

  describe('findAll', () => {
    it('should return an array of properties', async () => {
      const list = [makeProp({ id: 1, address: 'A', price: 100 })];
      mockRepo.find!.mockResolvedValue(list);

      await expect(service.findAll()).resolves.toEqual(list);
    });
  });

  describe('findOne', () => {
    it('should return a property when found', async () => {
      const prop = makeProp({ id: 2, address: 'B', price: 200 });
      mockRepo.findOneBy!.mockResolvedValue(prop);

      await expect(service.findOne(2)).resolves.toEqual(prop);
    });

    it('should throw when not found', async () => {
      mockRepo.findOneBy!.mockResolvedValue(undefined);
      await expect(service.findOne(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create, save and return the new property', async () => {
      // dto também vira “any” (sem tipagem estrita)
      const dto = {
        address: 'C',
        price: 300,
        area: 0,
        bedrooms: 0,
        bathrooms: 0,
        parking: 0,
      } as any;
      const saved = makeProp({ id: 3, ...dto });
      mockRepo.create!.mockReturnValue(dto);
      mockRepo.save!.mockResolvedValue(saved);

      await expect(service.create(dto)).resolves.toEqual(saved);
      expect(mockCache.del).toHaveBeenCalledWith('GET-/properties');
    });
  });

  describe('update', () => {
    it('should update and return the updated property', async () => {
      const before = makeProp({ id: 4, address: 'D Old', price: 400 });
      const dto = { address: 'D New' } as any;
      const after = makeProp({ id: 4, address: 'D New', price: 400 });

      mockRepo.findOneBy!.mockResolvedValueOnce(before);
      mockRepo.update!.mockResolvedValue({ affected: 1 } as any);
      mockRepo.findOneBy!.mockResolvedValueOnce(after);

      await expect(service.update(4, dto)).resolves.toEqual(after);
      expect(mockCache.del).toHaveBeenCalledWith('GET-/properties');
    });

    it('should throw when updating non-existent', async () => {
      mockRepo.findOneBy!.mockResolvedValue(undefined);
      await expect(service.update(999, {} as any)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the property and invalidate cache', async () => {
      const prop = makeProp({ id: 5, address: 'E', price: 500 });
      mockRepo.findOneBy!.mockResolvedValue(prop);

      await expect(service.remove(5)).resolves.toBeUndefined();
      expect(mockCache.del).toHaveBeenCalledWith('GET-/properties');
    });

    it('should throw when removing non-existent', async () => {
      mockRepo.findOneBy!.mockResolvedValue(undefined);
      await expect(service.remove(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
