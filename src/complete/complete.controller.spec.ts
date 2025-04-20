import { Test, TestingModule } from '@nestjs/testing';
import { CompleteController } from './complete.controller';
import { CompleteService } from './complete.service';

describe('CompleteController', () => {
  let controller: CompleteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompleteController],
      providers: [CompleteService],
    }).compile();

    controller = module.get<CompleteController>(CompleteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
