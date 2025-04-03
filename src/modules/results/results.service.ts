import { Injectable } from '@nestjs/common';

@Injectable()
export class ResultsService {

  findAll() {
    return `This action returns all results`;
  }

  findOne(id: number) {
    return `This action returns a #${id} result`;
  }


  remove(id: number) {
    return `This action removes a #${id} result`;
  }
}
