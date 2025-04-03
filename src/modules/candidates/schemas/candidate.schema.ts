import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CandidateDocument = HydratedDocument<Candidate>;

@Schema({ timestamps: true })
export class Candidate {
  @Prop({ required: true, unique: true })
  registration_number: string;

  @Prop()
  foreign_language_code: string;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
