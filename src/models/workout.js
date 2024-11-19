const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: Number,
  reps: Number,
  weight: Number,
  duration: Number,
  notes: String
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'hiit'],
    required: true
  },
  exercises: [exerciseSchema],
  duration: Number,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scheduledFor: Date,
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

workoutSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Workout', workoutSchema);