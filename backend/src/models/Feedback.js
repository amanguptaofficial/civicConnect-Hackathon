const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  policyProposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PolicyProposal',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['suggestion', 'concern', 'question', 'support', 'opposition'],
    required: true,
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['new', 'acknowledged', 'addressed', 'closed'],
    default: 'new',
  },
  attachments: [{
    type: String,
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
    address: {
      type: String,
    },
  },
  aiSummary: {
    type: String,
  },
  images: [{
    type: String,
  }],
}, {
  timestamps: true,
});

feedbackSchema.index({ userId: 1 });
feedbackSchema.index({ policyProposalId: 1 });
feedbackSchema.index({ status: 1, category: 1 });
feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Feedback', feedbackSchema);
