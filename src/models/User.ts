import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  isAdmin: boolean;
  createdAt: Date;
  lastLogin: Date;
  preferences: {
    theme: 'light' | 'dark';
    language: string;
  };
  todoList: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: Date;
    completed: boolean;
    createdAt: Date;
  }>;
  history: Array<{
    id: string;
    type: 'career_guidance' | 'todo_completed' | 'item_saved';
    title: string;
    content: string;
    timestamp: Date;
    metadata?: any;
  }>;
  savedItems: Array<{
    id: string;
    title: string;
    content: string;
    category: string;
    savedAt: Date;
    tags: string[];
  }>;
  loginHistory: Array<{
    timestamp: Date;
    ipAddress?: string;
    userAgent?: string;
    success: boolean;
  }>;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    language: { type: String, default: 'en' }
  },
  todoList: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  history: [{
    id: { type: String, required: true },
    type: { type: String, enum: ['career_guidance', 'todo_completed', 'item_saved'], required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed }
  }],
  savedItems: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    savedAt: { type: Date, default: Date.now },
    tags: [{ type: String }]
  }],
  loginHistory: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String },
    success: { type: Boolean, required: true }
  }]
}, {
  timestamps: true
});

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ isAdmin: 1 });
UserSchema.index({ 'loginHistory.timestamp': -1 });

// Virtual for user ID (to match the existing interface)
UserSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
