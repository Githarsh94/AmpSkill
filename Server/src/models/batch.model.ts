// src/models/batch.model.ts
import { Schema, model, Document } from 'mongoose';

interface IBatch extends Document {
    name: string;
    teachers: Schema.Types.ObjectId[];
    students: Schema.Types.ObjectId[];
    tests: Schema.Types.ObjectId[];
}

const batchSchema = new Schema<IBatch>({
    name: { type: String, required: true },
    teachers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tests: [{ type: Schema.Types.ObjectId, ref: 'Test' }],
});

export const Batch = model<IBatch>('Batch', batchSchema);
