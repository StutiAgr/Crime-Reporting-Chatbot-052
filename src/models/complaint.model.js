// File: backend/models/Complaint.js
import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Registered'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sentimentAnalysis: {
    sentiment: String,
    sentimentScore: Number,
    emotion: String,
    urgencyLevel: String,
    urgencyScore: Number
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Resolved']
  }
}, {
  timestamps: true
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
