const mongoose = require('mongoose');

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'General', 'Other'],
      default: 'General',
    },
    location: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Closed'],
      default: 'Open',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Text index for keyword search (bonus)
jobRequestSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('JobRequest', jobRequestSchema, 'jobRequests');
