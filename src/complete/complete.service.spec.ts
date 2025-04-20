import { Test, TestingModule } from '@nestjs/testing';
import { CompleteService } from './complete.service';

describe('CompleteService', () => {
  let service: CompleteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompleteService],
    }).compile();

    service = module.get<CompleteService>(CompleteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
