import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController (health)', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('health()', () => {
    it('should return "OK"', () => {
      expect(appController.health()).toBe('OK');
    });
  });
});
