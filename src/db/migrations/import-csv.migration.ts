import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-stream';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Result } from '@/modules/results/schemas/result.schema';
import { Candidate } from '@/modules/candidates/schemas/candidate.schema';
import { Subject } from '@/modules/subjects/schemas/subject.schema';
import { Transform } from 'stream';

const BATCH_SIZE = 1000;

interface IKeepResult {
  candidate_id: string,
  subject_id: string,
  score: number
}

async function importCSV(filePath: string) {
  const app = await NestFactory.createApplicationContext(AppModule);
  const candidateModel = app.get<Model<Candidate>>('CandidateModel');
  const subjectModel = app.get<Model<Subject>>('SubjectModel');
  const resultModel = app.get<Model<Result>>('ResultModel');

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  let candidate_batch: Candidate[] = [];
  let result_batch: IKeepResult[] = [];
  let isSubjectReaded = false;

  var csvStream = csv.createStream();
  var readStream = fs.createReadStream(filePath);

  readStream
    .pipe(csvStream)
    .on('data', async (chunk) => {
      candidate_batch.push({
        registration_number: chunk['sbd'],
        foreign_language_code: chunk['ma_ngoai_ngu']
      })
      if (candidate_batch.length === BATCH_SIZE) {
        candidateModel.insertMany(candidate_batch);
        candidate_batch = [];
      }
      // 
      const keys = Object.keys(chunk).filter(key => key != 'sbd' && key != 'ma_ngoai_ngu');

      keys.map(v => {
        if (chunk[v])
          result_batch.push({
            candidate_id: chunk['sbd'],
            subject_id: v,
            score: chunk[v]
          })
      })
      if (result_batch.length >= BATCH_SIZE) {
        resultModel.insertMany(result_batch);
        result_batch = [];
      }

      // 
      if (!isSubjectReaded) {
        const subjects = keys.map((v): Subject => {
          return { code: v }
        })
        subjectModel.insertMany(subjects);
        isSubjectReaded = true;
      }
    })
    .on('error', (err) => {
      console.error(err);
      process.exit();
    })
    .on('end', () => {
      if (candidate_batch.length > 0) {
        candidateModel.insertMany(candidate_batch);
        candidate_batch = [];
      }
      if (result_batch.length > 0) {
        resultModel.insertMany(result_batch);
        result_batch = [];
      }

      // read score
      console.log(`Imported  records successfully`);
      process.exit(0);
    })


}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: npm run migrate <file-path>');
  process.exit(1);
} else {
  (async () => {
    await importCSV(path.join(process.cwd(), filePath));
  })();
}
