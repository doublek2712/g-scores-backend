import { Injectable } from '@nestjs/common';

@Injectable()
export class CandidatesService {

  findAll() {
    return `This action returns all candidates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} candidate`;
  }


  remove(id: number) {
    return `This action removes a #${id} candidate`;
  }
}
