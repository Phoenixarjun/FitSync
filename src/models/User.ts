import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 13,
    max: 120
  },
  sex: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  weight: {
    type: Number,
    required: true,
    min: 30,
    max: 300
  },
  height: {
    type: Number,
    required: true,
    min: 100,
    max: 250
  },
  bmi: {
    type: Number,
    required: true
  },
  profilePhoto: String,
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 20
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent model overwrite upon hot reload
export default mongoose.models.User || mongoose.model('User', UserSchema);