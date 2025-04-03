import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Result } from './schemas/result.schema';
import { Model } from 'mongoose';
import { Candidate } from '../candidates/schemas/candidate.schema';
import { Subject } from 'rxjs';
import { CANDIDATE_COLLECTION_NAME, SUBJECT_COLLECTION_NAME } from '@/const/collection.name';

// async const promiseTask = () =>{}

@Injectable()
export class ResultsService {
  constructor(
    @InjectModel(Result.name)
    private resultModel: Model<Result>,

  ) { }


  async getScoreStatistics() {
    try {

      const res_1 = await this.resultModel.aggregate([
        {
          $match: { score: { $gte: 8 } } // Lọc những document có score >= 8
        },
        {
          $group: {
            "_id": '$subject_id',
            count: { $sum: 1 }
          }
        }
      ])
      const res_2 = await this.resultModel.aggregate([
        {
          $match: { score: { $gte: 6, $lt: 8 } } // Lọc những document có score >= 8
        },
        {
          $group: {
            "_id": '$subject_id',
            count: { $sum: 1 }
          }
        }
      ])
      const res_3 = await this.resultModel.aggregate([
        {
          $match: { score: { $gte: 4, $lt: 6 } } // Lọc những document có score >= 8
        },
        {
          $group: {
            "_id": '$subject_id',
            count: { $sum: 1 }
          }
        }
      ])
      const res_4 = await this.resultModel.aggregate([
        {
          $match: { score: { $lt: 4 } } // Lọc những document có score >= 8
        },
        {
          $group: {
            "_id": '$subject_id',
            count: { $sum: 1 }
          }
        }
      ])

      return {
        res_1,
        res_2,
        res_3,
        res_4
      }

    } catch (err) { }

  }

  async getTop10AGroup() {
    return await this.resultModel.aggregate([
      {
        $match: {
          subject_id: { $in: ["toan", "vat_li", "hoa_hoc"] }
        }
      },
      {
        $group: {
          _id: "$candidate_id",
          totalScore: { $sum: "$score" },
          scores: { $push: { "subject": "$subject_id", "score": "$score" } },

        },

      },

      { $sort: { totalScore: -1 } },
      { $limit: 10 }
    ]).option({ allowDiskUse: true })

  }

  async findByRegistrationNumber(registration_number: string) {
    return await this.resultModel.aggregate([
      {
        $lookup: {
          from: CANDIDATE_COLLECTION_NAME,
          localField: 'candidate_id',
          foreignField: 'registration_number',
          as: 'candidate_info'
        }
      },
      { $unwind: '$candidate_info' },
      { $match: { candidate_id: registration_number } },
      {
        $group: {
          _id: '$candidate_id',
          scores: { $push: { "subject": "$subject_id", "score": "$score" } },
          foreign_language_code: { $first: '$candidate_info.foreign_language_code' }
        }
      },
    ])
  }

}
