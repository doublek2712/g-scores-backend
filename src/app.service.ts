import { Injectable } from '@nestjs/common';
import { Result, ResultSchema } from './modules/results/schemas/result.schema';
import { ResultsService } from './modules/results/results.service';

@Injectable()
export class AppService {
  constructor(private readonly resultService: ResultsService) { }
  getHello(): string {
    return `Hello`;
  }
  async getTop10AGroup() {
    return this.resultService.getTop10AGroup()
  }
  async getScoreStatistics() {
    return this.resultService.getScoreStatistics();
  }
}
