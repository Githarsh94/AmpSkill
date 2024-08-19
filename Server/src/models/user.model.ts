import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    uid: string;
    email: string;
    name: string;
    picture?: string;
    role: 'admin' | 'teacher' | 'student';
    provider: string;
    batch: Schema.Types.ObjectId;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String },
    role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
    provider: { type: String, required: true },
    batch: [{ type: Schema.Types.ObjectId, ref: 'Batch' }],
    createdAt: { type: Date, default: Date.now },
});

const User = model<IUser>('User', UserSchema);

export { User };