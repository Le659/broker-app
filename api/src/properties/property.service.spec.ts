// broker-app/api/src/properties/property.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import {
  CacheModule,
  CACHE_MANAGER,
  NotFoundException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PropertyService } from './property.service';
import { Property } from './property.entity';

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
      imports: [
        // importa o CacheModule para registrar o token CACHE_MANAGER
        CacheModule.register(),
      ],
      providers: [
        PropertyService,
        {
          provide: getRepositoryToken(Property),
          useValue: mockRepo,
        },
        {
          provide: PinoLogger,
          useValue: mockLogger,
        },
      ],
    })
      // sobrescreve o provider CACHE_MANAGER pelo seu mock
      .overrideProvider(CACHE_MANAGER)
      .useValue(mockCache)
      .compile();

    service = module.get<PropertyService>(PropertyService);
  });

  describe('findAll', () => {
    it('should return an array of properties', async () => {
      const fakeList = [{ id: 1, address: 'A', price: 100 }] as Property[];
      mockRepo.find!.mockResolvedValue(fakeList);

      await expect(service.findAll()).resolves.toBe(fakeList);
      expect(mockRepo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a property when found', async () => {
      const prop = { id: 2, address: 'B', price: 200 } as Property;
      mockRepo.findOneBy!.mockResolvedValue(prop);

      await expect(service.findOne(2)).resolves.toBe(prop);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 2 });
    });

    it('should throw NotFoundException when not found', async () => {
      mockRepo.findOneBy!.mockResolvedValue(undefined);
      await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create, save and return the new property', async () => {
      const dto = { address: 'C', price: 300 };
      const saved = { id: 3, ...dto } as Property;
      mockRepo.create!.mockReturnValue(dto);
      mockRepo.save!.mockResolvedValue(saved);

      await expect(service.create(dto as any)).resolves.toEqual(saved);
      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(dto);
      expect(mockCache.del).toHaveBeenCalledWith('GET-/properties');
    });
  });

  describe('update', () => {
    it('should update and return the updated property', async () => {
      const dto = { address: 'D New' };
      const before = { id: 4, address: 'D Old', price: 400 } as Property;
      const after = { id: 4, address: 'D New', price: 400 } as Property;

      mockRepo.findOneBy!.mockResolvedValueOnce(before);
      mockRepo.update!.mockResolvedValue({ affected: 1 } as any);
      mockRepo.findOneBy!.mockResolvedValueOnce(after);

      await expect(service.update(4, dto as any)).resolves.toEqual(after);
      expect(mockCache.del).toHaveBeenCalledWith('GET-/properties');
    });

    it('should throw NotFoundException when updating non-existent', async () => {
      mockRepo.findOneBy!.mockResolvedValue(undefined);
      await expect(service.update(999, {} as any)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the property and invalidate cache', async () => {
      const prop = { id: 5, address: 'E', price: 500 } as Property;
      mockRepo.findOneBy!.mockResolvedValue(prop);

      await expect(service.remove(5)).resolves.toBeUndefined();
      expect(mockRepo.remove).toHaveBeenCalledWith(prop);
      expect(mockCache.del).toHaveBeenCalledWith('GET-/properties');
    });

    it('should throw NotFoundException when removing non-existent', async () => {
      mockRepo.findOneBy!.mockResolvedValue(undefined);
      await expect(service.remove(999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
