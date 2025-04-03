import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResultsService } from './modules/results/results.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('top')
  async getTop10AGroup() {
    return this.appService.getTop10AGroup();
  }

  @Get('statistic')
  async getScoreStatistics() {
    return this.appService.getScoreStatistics();
  }
}
