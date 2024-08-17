// src/models/user.model.ts
import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    email: string;
    role: 'admin' | 'teacher' | 'student';
    batches: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    role: { type: String },
    batches: [{ type: Schema.Types.ObjectId, ref: 'Batch' }],
});

export const User = model<IUser>('User', userSchema);
