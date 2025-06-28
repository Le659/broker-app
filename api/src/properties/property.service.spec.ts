import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Property } from './property.entity';

type MockRepo<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepo = <T extends ObjectLiteral = any>(): MockRepo<T> => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('PropertyService', () => {
  let service: PropertyService;
  let repo: MockRepo<Property>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        {
          provide: getRepositoryToken(Property),
          useValue: createMockRepo<Property>(),
        },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    repo = module.get<MockRepo<Property>>(getRepositoryToken(Property));
  });

  describe('findAll', () => {
    it('should return an array of properties', async () => {
      const items = [{ id: 1 }] as Property[];
      repo.find!.mockResolvedValue(items);
      await expect(service.findAll()).resolves.toEqual(items);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a property if found', async () => {
      const item = { id: 1 } as Property;
      repo.findOneBy!.mockResolvedValue(item);
      await expect(service.findOne(1)).resolves.toEqual(item);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOneBy!.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and save a property', async () => {
      const dto = {
        address: 'A',
        area: 100,
        bedrooms: 2,
        bathrooms: 1,
        parking: 1,
      } as any;
      const created = { id: 1, ...dto } as Property;
      repo.create!.mockReturnValue(created);
      repo.save!.mockResolvedValue(created);
      await expect(service.create(dto)).resolves.toEqual(created);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(created);
    });
  });

  describe('update', () => {
    it('should update and return the property', async () => {
      const existing = {
        id: 1,
        address: 'A',
        area: 100,
        bedrooms: 2,
        bathrooms: 1,
        parking: 1,
        geom: null,
        comparables: [],
      } as Property;
      const dto = { bedrooms: 3 } as any;
      jest.spyOn(service, 'findOne').mockResolvedValue(existing);
      repo.update!.mockResolvedValue(undefined as any);
      await expect(service.update(1, dto)).resolves.toEqual(existing);
      expect(repo.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException when updating non-existing', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.update(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the property', async () => {
      const existing = { id: 1 } as Property;
      jest.spyOn(service, 'findOne').mockResolvedValue(existing);
      repo.remove!.mockResolvedValue(existing as any);
      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(existing);
    });

    it('should throw NotFoundException when removing non-existing', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
