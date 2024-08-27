// src/models/batch.model.ts
import { Schema, model, Document } from 'mongoose';

interface IBatch extends Document {
    batchName: { type: String, required: true },
    department: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: Number, required: true },
    students: { type: [String], required: true },
    teachers: { type: [{ email: String, subject: String }], required: true },
}

const batchSchema = new Schema<IBatch>({
    batchName: { type: String, required: true },
    department: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: Number, required: true },
    students: { type: [String], required: true },
    teachers: { type: [{ email: String, subject: String }], required: true },
});

export const Batch = model<IBatch>('Batch', batchSchema);
