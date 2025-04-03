
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ResultDocument = HydratedDocument<Result>;

@Schema({ timestamps: true })
export class Result {
  @Prop({ type: String, ref: 'Candidate', required: true })
  candidate_id: string;

  @Prop({ type: String, ref: 'Subject', required: true })
  subject_id: string;

  @Prop({ required: true })
  score: number;
}
const ResultSchema = SchemaFactory.createForClass(Result);
ResultSchema.index({ candidate_id: 1, subject_id: 1 }, { unique: true });

export { ResultSchema };
