import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) { }


  @Get(':registration_number')
  async getByRegistrationNumber(@Param('registration_number') registration_number: string) {
    return this.resultsService.findByRegistrationNumber(registration_number);
  }




}
