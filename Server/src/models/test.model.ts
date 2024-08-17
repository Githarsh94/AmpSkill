// src/models/test.model.ts
import { Schema, model, Document } from 'mongoose';

interface ITest extends Document {
    title: string;
    description: string;
    questions: string[];
    batch: Schema.Types.ObjectId;
    testCode: string;
    password: string;
}

const testSchema = new Schema<ITest>({
    title: { type: String, required: true },
    description: { type: String },
    questions: [{ type: String }],
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    testCode: { type: String, required: true },
    password: { type: String, required: true },
});

export const Test = model<ITest>('Test', testSchema);
