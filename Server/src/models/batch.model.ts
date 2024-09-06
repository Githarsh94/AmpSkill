// src/models/batch.model.ts
import { Schema, model, Document } from 'mongoose';

interface ITeacher {
    teacher: string;
    subject: string;
}

const teacherSchema = new Schema<ITeacher>({
    teacher: { type: String, required: true },
    subject: { type: String, required: true },
});

interface IBatch extends Document {
    batchName: string;
    department: string;
    branch: string;
    year: number;
    students: string[];
    teachers: ITeacher[];
}
const batchSchema = new Schema<IBatch>({
    batchName: { type: String},
    department: { type: String},
    branch: { type: String},
    year: { type: Number },
    students: { type: [String]},
    teachers: { type: [teacherSchema]},
});

export const Batch = model<IBatch>('Batch', batchSchema);
