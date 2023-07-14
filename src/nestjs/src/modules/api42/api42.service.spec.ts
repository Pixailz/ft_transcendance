import { Test, TestingModule } from '@nestjs/testing';
import { Api42Service } from './api42.service';

describe('Api42Service', () => {
  let service: Api42Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Api42Service],
    }).compile();

    service = module.get<Api42Service>(Api42Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
