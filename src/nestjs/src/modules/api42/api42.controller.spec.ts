import { Test, TestingModule } from '@nestjs/testing';
import { Api42Controller } from './api42.controller';

describe('Api42Controller', () => {
  let controller: Api42Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Api42Controller],
    }).compile();

    controller = module.get<Api42Controller>(Api42Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
